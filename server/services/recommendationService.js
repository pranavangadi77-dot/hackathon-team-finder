/**
 * HackathonTeam Finder - Smart Team Recommendation Service
 * Deterministic Weighted Scoring Algorithm (Section 5.H):
 *
 * 1. Compare student's skills against team's missing skills (case-insensitive)
 * 2. Skill Match Score = (Number of missing skills matched / Total missing skills) * 100
 * 3. Preferred Role Score = 100 if student's preferred role matches an open role, else 0
 * 4. Availability Score = 100 if team has open positions, else 0
 *
 * Final Score = (Skill Match * 0.70) + (Preferred Role * 0.20) + (Availability * 0.10)
 *
 * Exclusions:
 * - Teams student is already a leader or member of
 * - Teams student has already requested to join (Pending or Accepted)
 * - Teams that are not Open, or full (availablePositions <= 0)
 * - Teams past registration deadline
 * - Teams with no missing skills (do not recommend based on missing skill matching)
 */

// Helper to normalize skill strings (e.g., "Node.js" -> "nodejs", "react.js" -> "react", "c++" -> "c++")
const normalizeSkill = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/[\s_.-]+/g, '');
};

const doesSkillMatch = (skillA, skillB) => {
  const a = normalizeSkill(skillA);
  const b = normalizeSkill(skillB);
  if (!a || !b) return false;
  if (a === b) return true;
  // Substring match for common frameworks (e.g. "react" & "reactjs", "express" & "expressjs", "mongo" & "mongodb")
  if (a.includes(b) || b.includes(a)) return true;
  return false;
};

const calculateRecommendations = async (user, teams, existingRequests = []) => {
  if (!user || !teams || !teams.length) return [];

  const userId = user._id ? user._id.toString() : '';
  const userSkills = [
    ...(user.technicalSkills || []),
    ...(user.nonTechnicalSkills || []),
  ].filter(Boolean);

  const userPreferredRoles = (user.preferredRoles || []).map((r) => r.toLowerCase().trim());

  // Set of team IDs student has already requested
  const requestedTeamIds = new Set(
    existingRequests
      .filter((r) => {
        const sId = r.student?._id ? r.student._id.toString() : r.student?.toString();
        return sId === userId && (r.status === 'Pending' || r.status === 'Accepted');
      })
      .map((r) => (r.team?._id ? r.team._id.toString() : r.team?.toString()))
  );

  const recommendations = [];

  for (const team of teams) {
    const teamId = team._id ? team._id.toString() : '';

    // 1. Exclude if already requested
    if (requestedTeamIds.has(teamId)) continue;

    // 2. Exclude if user is leader
    const leaderId = team.leader?._id ? team.leader._id.toString() : team.leader?.toString();
    if (leaderId === userId) continue;

    // 3. Exclude if user is already a member
    const isMember = (team.members || []).some((m) => {
      const mId = m?._id ? m._id.toString() : m?.toString();
      return mId === userId;
    });
    if (isMember) continue;

    // 4. Exclude if status is not Open
    if (team.status && team.status !== 'Open') continue;

    // 5. Exclude if full
    const openPositions = team.availablePositions !== undefined ? team.availablePositions : (team.maxMembers || team.maximumMembers || 4) - ((team.members || []).length || 1);
    if (openPositions <= 0) continue;

    // 6. Check deadline if provided
    const deadline = team.hackathonDeadline || team.applicationDeadline;
    if (deadline && new Date(deadline) < new Date()) {
      continue;
    }

    // Determine missing skills:
    // If team has explicitly specified missingSkills, use those.
    // Otherwise fallback to requiredSkills.
    let targetMissingSkills = [];
    if (Array.isArray(team.missingSkills) && team.missingSkills.length > 0) {
      targetMissingSkills = [...team.missingSkills];
    } else if (Array.isArray(team.requiredSkills) && team.requiredSkills.length > 0) {
      targetMissingSkills = [...team.requiredSkills];
    }

    // If the team has no missing skills at all, do not recommend based on missing skill matching
    if (targetMissingSkills.length === 0) continue;

    // Calculate matched and still required skills
    const matchedSkills = [];
    const unmatchedSkills = [];

    targetMissingSkills.forEach((reqSkill) => {
      const matches = userSkills.some((uSkill) => doesSkillMatch(uSkill, reqSkill));
      if (matches) {
        matchedSkills.push(reqSkill);
      } else {
        unmatchedSkills.push(reqSkill);
      }
    });

    // A team with 0 matched skills has 0 skill match
    const skillMatchRatio = matchedSkills.length / targetMissingSkills.length;
    const skillMatchScore = Math.min(100, Math.round(skillMatchRatio * 100));

    // If 0 skills matched and user has skills, don't recommend or keep score 0
    if (matchedSkills.length === 0) {
      continue;
    }

    // Role matching
    const teamRoles = (team.availableRoles || []).map((r) => r.toLowerCase().trim());
    let roleMatched = false;
    let suggestedRole = team.availableRoles?.[0] || 'Team Contributor';

    if (userPreferredRoles.length > 0 && teamRoles.length > 0) {
      for (const pRole of userPreferredRoles) {
        const found = (team.availableRoles || []).find((r) =>
          r.toLowerCase().includes(pRole) || pRole.includes(r.toLowerCase())
        );
        if (found) {
          roleMatched = true;
          suggestedRole = found;
          break;
        }
      }
    } else if (teamRoles.length > 0) {
      // If student has ML skills and team has "ML Engineer"
      if (matchedSkills.some((s) => /ml|machine|ai|python/i.test(s))) {
        suggestedRole = (team.availableRoles || []).find((r) => /ml|ai|data|python/i.test(r)) || suggestedRole;
      } else if (matchedSkills.some((s) => /backend|node|express|database|sql|mongo/i.test(s))) {
        suggestedRole = (team.availableRoles || []).find((r) => /backend|database|api/i.test(r)) || suggestedRole;
      } else if (matchedSkills.some((s) => /react|frontend|ui|css|html/i.test(s))) {
        suggestedRole = (team.availableRoles || []).find((r) => /frontend|ui/i.test(r)) || suggestedRole;
      }
    }

    const preferredRoleScore = roleMatched ? 100 : (teamRoles.length === 0 ? 50 : 0);
    const availabilityScore = openPositions > 0 ? 100 : 0;

    // Weighted Formula per Section 5.H:
    // Final Score = (Skill Match * 0.70) + (Preferred Role * 0.20) + (Availability * 0.10)
    const rawFinalScore = (skillMatchScore * 0.70) + (preferredRoleScore * 0.20) + (availabilityScore * 0.10);
    const finalScore = Math.min(100, Math.max(1, Math.round(rawFinalScore)));

    // Formulate clear, deterministic reason
    let reasonText = '';
    if (unmatchedSkills.length === 0) {
      reasonText = `Your ${matchedSkills.join(' and ')} skills directly cover 100% of this team's missing requirements.`;
    } else {
      reasonText = `Your ${matchedSkills.slice(0, 3).join(', ')} skills provide ${skillMatchScore}% coverage of this team's missing skill gaps.`;
    }

    if (roleMatched) {
      reasonText += ` Your preferred role matches the open ${suggestedRole} position.`;
    }

    recommendations.push({
      team,
      matchPercentage: finalScore,
      skillMatchScore,
      preferredRoleScore,
      availabilityScore,
      matchedSkills,
      unmatchedMissingSkills: unmatchedSkills,
      missingSkillsStillNotCovered: unmatchedSkills,
      suggestedRole,
      availablePositions: openPositions,
      reason: reasonText,
      explanation: reasonText,
    });
  }

  // Sort descending by matchPercentage
  recommendations.sort((a, b) => b.matchPercentage - a.matchPercentage);

  return recommendations;
};

module.exports = {
  calculateRecommendations,
  normalizeSkill,
  doesSkillMatch,
};
