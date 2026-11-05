/**
 * HackMate Intelligent Skill-Gap Recommendation Service
 * Weighted Scoring:
 * - 60% Skill Gap & Required Skill Overlap
 * - 20% Interest Compatibility
 * - 10% Experience Level Compatibility
 * - 10% Hackathon / Project Compatibility
 */

// Helper: Normalize skill string for accurate matching (e.g. "React.js" -> "react", "NodeJS" -> "node")
const normalizeStr = (str) =>
  (str || '')
    .toLowerCase()
    .trim()
    .replace(/[._-\s]+/g, '');

const areSkillsEqual = (s1, s2) => {
  const n1 = normalizeStr(s1);
  const n2 = normalizeStr(s2);
  if (n1 === n2) return true;
  if (n1.includes(n2) || n2.includes(n1)) return true;
  return false;
};

const calculateRecommendations = async (user, teams) => {
  if (!user || !teams || !teams.length) return [];

  const userSkills = (user.technicalSkills || []).map((s) => s.trim());
  const userInterests = (user.interests || []).map((i) => i.trim());
  const userExperience = user.experience || 'Beginner (0 hackathons)';

  const scoredTeams = [];

  for (const team of teams) {
    // Exclude if team is not Open or has 0 available positions
    if (team.status !== 'Open' || team.availablePositions <= 0) continue;

    // Exclude if user is already leader or member
    const isLeader = team.leader?._id?.toString() === user._id?.toString() || team.leader?.toString() === user._id?.toString();
    const isMember = (team.members || []).some(
      (m) => (m._id ? m._id.toString() : m.toString()) === user._id?.toString()
    );
    if (isLeader || isMember) continue;

    // Check application deadline
    if (team.applicationDeadline && new Date(team.applicationDeadline) < new Date()) {
      continue;
    }

    const requiredSkills = team.requiredSkills || [];

    // 1. Gather all existing team members' skills (leader + members)
    const existingMembers = [];
    if (team.leader && team.leader.technicalSkills) existingMembers.push(team.leader);
    if (Array.isArray(team.members)) {
      team.members.forEach((m) => {
        if (m && m.technicalSkills) existingMembers.push(m);
      });
    }

    const teamCoveredSkills = new Set();
    existingMembers.forEach((member) => {
      (member.technicalSkills || []).forEach((skill) => {
        teamCoveredSkills.add(normalizeStr(skill));
      });
    });

    // 2. Identify missing / unfulfilled skills in the team
    const missingSkills = [];
    const fulfilledSkills = [];

    requiredSkills.forEach((reqSkill) => {
      const isCovered = Array.from(teamCoveredSkills).some((cov) =>
        areSkillsEqual(cov, reqSkill)
      );
      if (isCovered) {
        fulfilledSkills.push(reqSkill);
      } else {
        missingSkills.push(reqSkill);
      }
    });

    // If no existing member skills were populated, treat all required as missing
    const activeMissingSkills = missingSkills.length > 0 ? missingSkills : requiredSkills;

    // 3. Evaluate candidate student's match with missing skills and required skills
    const candidateMatchesMissing = [];
    const candidateMatchesRequired = [];

    requiredSkills.forEach((reqSkill) => {
      const matches = userSkills.some((uSkill) => areSkillsEqual(uSkill, reqSkill));
      if (matches) {
        candidateMatchesRequired.push(reqSkill);
        if (activeMissingSkills.some((mSkill) => areSkillsEqual(mSkill, reqSkill))) {
          candidateMatchesMissing.push(reqSkill);
        }
      }
    });

    // --- SCORE 1: SKILL GAP (Weight: 60) ---
    let skillRatio = 0;
    if (activeMissingSkills.length > 0) {
      const missingCoverageRatio = candidateMatchesMissing.length / activeMissingSkills.length;
      const overallCoverageRatio = candidateMatchesRequired.length / Math.max(1, requiredSkills.length);
      skillRatio = missingCoverageRatio * 0.7 + overallCoverageRatio * 0.3;
    } else {
      skillRatio = candidateMatchesRequired.length / Math.max(1, requiredSkills.length);
    }
    const skillScore = Math.min(1, Math.max(0, skillRatio)) * 60;

    // --- SCORE 2: INTEREST COMPATIBILITY (Weight: 20) ---
    let interestMatches = 0;
    const category = (team.category || '').toLowerCase();
    const projectTitle = (team.projectTitle || '').toLowerCase();
    const description = (team.description || '').toLowerCase();

    userInterests.forEach((interest) => {
      const normInterest = interest.toLowerCase();
      if (
        category.includes(normInterest) ||
        projectTitle.includes(normInterest) ||
        description.includes(normInterest)
      ) {
        interestMatches++;
      }
    });

    const interestRatio = userInterests.length > 0 ? Math.min(1, interestMatches / Math.max(1, userInterests.length)) : 0.5;
    const interestScore = interestRatio * 20;

    // --- SCORE 3: EXPERIENCE COMPATIBILITY (Weight: 10) ---
    let expScore = 7; // baseline
    const preferred = team.preferredExperience || 'Any';
    if (preferred === 'Any') {
      expScore = 10;
    } else if (preferred === 'Beginner Friendly') {
      expScore = userExperience.includes('Beginner') ? 10 : 8;
    } else if (preferred === 'Intermediate') {
      expScore = userExperience.includes('Intermediate') ? 10 : userExperience.includes('Advanced') ? 9 : 6;
    } else if (preferred === 'Advanced') {
      expScore = userExperience.includes('Advanced') || userExperience.includes('Winner') ? 10 : 5;
    }

    // --- SCORE 4: HACKATHON / PROJECT PREFERENCE (Weight: 10) ---
    let preferenceScore = 7; // baseline
    if (team.leader?.college && user.college && team.leader.college.toLowerCase() === user.college.toLowerCase()) {
      preferenceScore += 3; // bonus college synergy
    }
    preferenceScore = Math.min(10, preferenceScore);

    const totalScore = Math.round(skillScore + interestScore + expScore + preferenceScore);

    // Build transparent explanation
    let reasons = [];
    if (candidateMatchesMissing.length > 0) {
      reasons.push(`Fills critical skill gaps: ${candidateMatchesMissing.slice(0, 3).join(', ')}`);
    } else if (candidateMatchesRequired.length > 0) {
      reasons.push(`Matches required stack: ${candidateMatchesRequired.slice(0, 3).join(', ')}`);
    }

    if (interestMatches > 0) {
      reasons.push(`Aligned with project category (${team.category})`);
    }

    if (team.leader?.college && user.college && team.leader.college.toLowerCase() === user.college.toLowerCase()) {
      reasons.push(`Same university campus (${user.college})`);
    }

    if (reasons.length === 0) {
      reasons.push('Complementary team composition');
    }

    scoredTeams.push({
      team,
      matchPercentage: Math.min(99, Math.max(20, totalScore)),
      matchingSkills: candidateMatchesRequired,
      missingTeamSkills: activeMissingSkills,
      matchingMissingSkills: candidateMatchesMissing,
      explanation: reasons.join(' • '),
      scoreBreakdown: {
        skillGapScore: Math.round(skillScore),
        interestScore: Math.round(interestScore),
        experienceScore: Math.round(expScore),
        preferenceScore: Math.round(preferenceScore),
      },
    });
  }

  // Sort descending by matchPercentage
  scoredTeams.sort((a, b) => b.matchPercentage - a.matchPercentage);

  return scoredTeams;
};

module.exports = {
  calculateRecommendations,
};
