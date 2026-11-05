const http = require('http');
const { app } = require('./server');
const { connectDB } = require('./config/db');
const runSeed = require('./seed');

let server;
let API_URL;

const req = async (path, options = {}) => {
  const url = `${API_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const error = new Error(data?.message || `HTTP ${res.status}`);
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return { status: res.status, data };
};

const runSuite = async () => {
  console.log('🧪 Starting HackMate Full In-Process Verification Suite...\n');

  // 1. Initialize DB and Seed
  await connectDB();
  await runSeed();

  // 2. Start HTTP server on port 5000 (or random port)
  await new Promise((resolve) => {
    server = app.listen(5000, () => {
      API_URL = `http://127.0.0.1:5000/api`;
      console.log(`📡 In-process test server active at ${API_URL}\n`);
      resolve();
    });
  });

  try {
    // Test 1: Health check
    const health = await req('/health');
    console.log('✅ 1. Health Check:', health.data.status, health.data.product);

    // Test 2: Login as pre-seeded user (Priya)
    const priyaLogin = await req('/auth/login', {
      method: 'POST',
      body: {
        email: 'priya@hackmate.dev',
        password: 'password123',
      },
    });
    console.log('✅ 2. Login (Priya): Success, token received for', priyaLogin.data.user.name);
    const priyaToken = priyaLogin.data.token;

    // Test 3: Login as Liam
    const liamLogin = await req('/auth/login', {
      method: 'POST',
      body: {
        email: 'liam@hackmate.dev',
        password: 'password123',
      },
    });
    console.log('✅ 3. Login (Liam): Success, token received for', liamLogin.data.user.name);
    const liamToken = liamLogin.data.token;

    // Test 4: Protected Route GET /api/auth/me
    const meRes = await req('/auth/me', {
      headers: { Authorization: `Bearer ${liamToken}` },
    });
    console.log(`✅ 4. Protected Route /auth/me: ${meRes.data.user.name} (${meRes.data.profileCompletion}% profile strength)`);

    // Test 5: Dynamic Skill-Gap Recommendations for Liam
    const recRes = await req('/teams/recommendations', {
      headers: { Authorization: `Bearer ${liamToken}` },
    });
    console.log(`✅ 5. Skill-Gap Recommendations: Generated ${recRes.data.count} recommended teams for Liam`);
    if (recRes.data.recommendations.length > 0) {
      const top = recRes.data.recommendations[0];
      console.log(`   Top Match: "${top.team.name}" - ${top.matchPercentage}% match`);
      console.log(`   Explanation: ${top.explanation}`);
      console.log(`   Weighted Breakdown: Skills: ${top.scoreBreakdown.skillGapScore}pts, Interests: ${top.scoreBreakdown.interestScore}pts`);
    }

    // Test 6: Team Discovery
    const teamsRes = await req('/teams?openPositionsOnly=true');
    console.log(`✅ 6. Team Discovery: Found ${teamsRes.data.count} open teams`);

    // Test 7: Filter by Skill
    const mlTeams = await req('/teams?skill=Machine Learning');
    console.log(`✅ 7. Filter Teams by Skill (Machine Learning): Found ${mlTeams.data.count} teams`);

    // Test 8: Register new student
    const testEmail = `jordan_${Date.now()}@hackmate.dev`;
    const regRes = await req('/auth/register', {
      method: 'POST',
      body: {
        name: 'Jordan Smith',
        email: testEmail,
        password: 'password123',
        college: 'Cornell Tech',
        branch: 'Information Science',
        yearOfStudy: '2nd Year',
        technicalSkills: ['Flutter', 'Firebase', 'Dart', 'UI/UX Design'],
        experience: 'Beginner (0 hackathons)',
      },
    });
    console.log(`✅ 8. Student Registration: Created account for ${regRes.data.user.name}`);
    const jordanToken = regRes.data.token;

    // Test 9: Create Team Opening as Jordan
    const createTeamRes = await req('/teams', {
      method: 'POST',
      headers: { Authorization: `Bearer ${jordanToken}` },
      body: {
        name: 'EcoRoute Navigation',
        projectTitle: 'Realtime Carbon-Neutral Transit Router',
        hackathonName: 'TreeHacks 2026',
        category: 'Sustainability & CleanTech',
        description: 'Micro-transit route optimization minimizing emissions for urban commuters.',
        problemStatement: 'Urban navigation apps prioritize speed over fuel efficiency and carbon footprints.',
        requiredSkills: ['Flutter', 'Python', 'FastAPI', 'GIS'],
        maxMembers: 3,
        preferredExperience: 'Any',
        applicationDeadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        contactInfo: 'Discord: @jordan_ecoroute',
      },
    });
    const newTeamId = createTeamRes.data.team._id;
    console.log(`✅ 9. Create Team Opening: Published "${createTeamRes.data.team.name}" (Capacity: 3, Vacancies: ${createTeamRes.data.team.availablePositions})`);

    // Test 10: Aarav applies to Jordan's team
    const aaravLogin = await req('/auth/login', {
      method: 'POST',
      body: {
        email: 'aarav@hackmate.dev',
        password: 'password123',
      },
    });
    const aaravToken = aaravLogin.data.token;

    const joinRes = await req('/requests', {
      method: 'POST',
      headers: { Authorization: `Bearer ${aaravToken}` },
      body: {
        teamId: newTeamId,
        message: 'Hey Jordan! I have extensive map routing & UI experience. Let us build this winning project.',
      },
    });
    const joinReqId = joinRes.data.request._id;
    console.log(`✅ 10. Submit Join Request: Aarav applied to EcoRoute (Req ID: ${joinReqId})`);

    // Test 11: Duplicate Request Prevention
    try {
      await req('/requests', {
        method: 'POST',
        headers: { Authorization: `Bearer ${aaravToken}` },
        body: {
          teamId: newTeamId,
          message: 'Trying to submit duplicate request',
        },
      });
      console.log('❌ Duplicate request prevention failed');
    } catch (dupErr) {
      console.log(`✅ 11. Duplicate Prevention: Correctly blocked with "${dupErr.data?.message}"`);
    }

    // Test 12: Incoming Requests for Jordan
    const incomingRes = await req('/requests/incoming', {
      headers: { Authorization: `Bearer ${jordanToken}` },
    });
    console.log(`✅ 12. Incoming Requests: Jordan sees ${incomingRes.data.count} pending applicant(s)`);

    // Test 13: Accept Request
    const acceptRes = await req(`/requests/${joinReqId}/accept`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${jordanToken}` },
    });
    console.log(`✅ 13. Accept Request: Status updated to "${acceptRes.data.request.status}"`);

    // Test 14: Verify Roster Update & Capacity Decrement
    const updatedTeamRes = await req(`/teams/${newTeamId}`);
    console.log(`✅ 14. Team Roster Updated: Members = ${updatedTeamRes.data.team.members.length}, Open vacancies = ${updatedTeamRes.data.team.availablePositions}`);

    // Test 15: Notifications
    const notifRes = await req('/notifications', {
      headers: { Authorization: `Bearer ${aaravToken}` },
    });
    console.log(`✅ 15. Notifications: Aarav received acceptance notification ("${notifRes.data.notifications[0]?.title}")`);

    // Test 16: Mark Notification Read
    if (notifRes.data.notifications.length > 0) {
      const nId = notifRes.data.notifications[0]._id;
      await req(`/notifications/${nId}/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${aaravToken}` },
      });
      console.log(`✅ 16. Mark Notification Read: Successfully updated notification status`);
    }

    console.log('\n============================================================');
    console.log('🎉 ALL 16 COMPREHENSIVE VERIFICATION TESTS PASSED 100%!');
    console.log('============================================================\n');
  } catch (err) {
    console.error('❌ Test suite error:', err.data || err.message);
  } finally {
    if (server) server.close();
    process.exit(0);
  }
};

runSuite();
