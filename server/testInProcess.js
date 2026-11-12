const { app } = require('./server');
const runSeed = require('./seed');
const { User, Team, JoinRequest, Notification } = require('./models');
const { calculateRecommendations } = require('./services/recommendationService');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper to simulate express request dispatch without TCP sockets
const mockReqRes = (method, url, headers = {}, body = {}) => {
  return new Promise((resolve) => {
    const parsedUrl = new URL(url, 'http://localhost');
    const query = {};
    parsedUrl.searchParams.forEach((v, k) => { query[k] = v; });

    let resBody = null;
    let resStatus = 200;
    let resHeaders = {};

    const req = {
      method,
      url: parsedUrl.pathname + parsedUrl.search,
      originalUrl: parsedUrl.pathname + parsedUrl.search,
      path: parsedUrl.pathname,
      query,
      headers: {
        'content-type': 'application/json',
        ...headers,
      },
      body,
    };

    const res = {
      statusCode: 200,
      setHeader: (k, v) => { resHeaders[k] = v; },
      status: function (code) {
        resStatus = code;
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        resBody = data;
        resolve({ status: resStatus, data: resBody });
      },
      send: function (data) {
        resBody = data;
        resolve({ status: resStatus, data: resBody });
      },
    };

    app.handle(req, res);
  });
};

const runAllTests = async () => {
  console.log('🧪 Starting HackathonTeam Finder Full In-Process Test Suite...\n');

  // Seed DB first
  await runSeed();

  let passed = 0;
  let failed = 0;

  const assert = (condition, desc) => {
    if (condition) {
      console.log(`✅ ${desc}`);
      passed++;
    } else {
      console.error(`❌ FAILED: ${desc}`);
      failed++;
    }
  };

  try {
    // 1. Health check
    const health = await mockReqRes('GET', '/api/health');
    assert(health.status === 200 && health.data.status === 'online', '1. API Health Check');

    // 2. Register a new student
    const regRes = await mockReqRes('POST', '/api/auth/register', {}, {
      name: 'Test Student',
      email: 'test.student@univ.edu',
      password: 'password123',
      college: 'Global Tech Institute',
      department: 'Computer Science',
      technicalSkills: ['Python', 'Backend Development'],
      preferredRoles: ['Backend Developer'],
    });
    assert(regRes.status === 201 && regRes.data.token, '2. Student Registration');

    // 3. Duplicate email registration prevention
    const dupRes = await mockReqRes('POST', '/api/auth/register', {}, {
      name: 'Duplicate Student',
      email: 'test.student@univ.edu',
      password: 'password123',
      college: 'Global Tech Institute',
    });
    assert(dupRes.status === 409, '3. Duplicate Email Registration Prevented');

    // 4. Login with valid credentials
    const loginRes = await mockReqRes('POST', '/api/auth/login', {}, {
      email: 'test.student@univ.edu',
      password: 'password123',
    });
    assert(loginRes.status === 200 && loginRes.data.token, '4. Student Login (Valid Credentials)');
    const testToken = loginRes.data.token;
    const authHeaders = { authorization: `Bearer ${testToken}` };

    // 5. Login with invalid password
    const badLogin = await mockReqRes('POST', '/api/auth/login', {}, {
      email: 'test.student@univ.edu',
      password: 'wrongpassword',
    });
    assert(badLogin.status === 401, '5. Student Login (Invalid Password Rejected)');

    // 6. Get Current User (/api/auth/me)
    const meRes = await mockReqRes('GET', '/api/auth/me', authHeaders);
    assert(meRes.status === 200 && meRes.data.user.email === 'test.student@univ.edu', '6. Auth Me Endpoint (/api/auth/me)');

    // 7. Update Profile (/api/users/profile or /api/users/me)
    const updateRes = await mockReqRes('PUT', '/api/users/profile', authHeaders, {
      bio: 'Enthusiastic builder passionate about AI pipelines',
      technicalSkills: ['Python', 'Backend Development', 'FastAPI', 'Docker'],
      nonTechnicalSkills: ['Communication', 'Presentation'],
      githubUrl: 'https://github.com/teststudent',
      linkedinUrl: 'https://linkedin.com/in/teststudent',
    });
    assert(updateRes.status === 200 && updateRes.data.user.bio.includes('Enthusiastic'), '7. Student Profile Update');

    // 8. Explore Teams (Filter & Search)
    const teamsRes = await mockReqRes('GET', '/api/teams?q=AI');
    assert(teamsRes.status === 200 && teamsRes.data.teams.length > 0, '8. Explore Teams (Search by keyword "AI")');

    // 9. Smart Recommendations Endpoint (/api/recommendations)
    // Student has Python + Backend Development
    // Expected top match: "AI Innovators" (missing: Python and Backend Development) -> 100% missing skill match!
    const recsRes = await mockReqRes('GET', '/api/recommendations', authHeaders);
    assert(recsRes.status === 200 && recsRes.data.recommendations.length > 0, '9. Smart Recommendations Endpoint Active');
    const topRec = recsRes.data.recommendations[0];
    const topTeamName = topRec.team.teamName || topRec.team.name;
    assert(topTeamName === 'AI Innovators', `10. Top Recommendation Accurately Calculated: ${topTeamName}`);
    assert(topRec.matchPercentage >= 70, `11. Match Score Percentage Deterministic: ${topRec.matchPercentage}% (Reason: ${topRec.reason})`);

    // 10. Create a New Team
    const createTeamRes = await mockReqRes('POST', '/api/teams', authHeaders, {
      teamName: 'Neural Nexuses',
      name: 'Neural Nexuses',
      projectTitle: 'Real-time Autonomous Edge Vision',
      hackathonName: 'Global AI & Web3 Hackathon',
      description: 'Building an edge vision pipeline for high-speed obstacle detection on quadcopters.',
      category: 'AI & Machine Learning',
      maxMembers: 3,
      maximumMembers: 3,
      requiredSkills: ['Python', 'Computer Vision', 'React'],
      missingSkills: ['Computer Vision', 'React'],
      availableRoles: ['Computer Vision Engineer', 'Frontend Developer'],
      applicationDeadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    });
    assert(createTeamRes.status === 201 && createTeamRes.data.team._id, '12. Create Team Endpoint');
    const newTeamId = createTeamRes.data.team._id;

    // 11. My Teams List
    const myTeamsRes = await mockReqRes('GET', '/api/teams/my-teams', authHeaders);
    assert(myTeamsRes.status === 200 && myTeamsRes.data.teams.some((t) => t._id.toString() === newTeamId.toString()), '13. My Teams Endpoint (/api/teams/my-teams)');

    // 12. Send Join Request
    // Login as Priya (ML / Python expert)
    const priyaLogin = await mockReqRes('POST', '/api/auth/login', {}, {
      email: 'priya@hackmate.dev',
      password: 'password123',
    });
    const priyaHeaders = { authorization: `Bearer ${priyaLogin.data.token}` };

    // Priya requests to join Test Student's new team
    const sendReqRes = await mockReqRes('POST', '/api/requests', priyaHeaders, {
      teamId: newTeamId,
      message: 'Hi! I have extensive PyTorch vision pipeline experience and would love to collaborate!',
    });
    assert(sendReqRes.status === 201 && sendReqRes.data.request._id, '14. Send Join Request');
    const requestId = sendReqRes.data.request._id;

    // 13. Prevent Duplicate Join Request
    const dupJoin = await mockReqRes('POST', '/api/requests', priyaHeaders, {
      teamId: newTeamId,
      message: 'Duplicate request',
    });
    assert(dupJoin.status === 400, '15. Prevent Duplicate Join Request');

    // 14. Team Leader Checks Incoming Requests
    const incomingRes = await mockReqRes('GET', '/api/requests/incoming', authHeaders);
    assert(incomingRes.status === 200 && incomingRes.data.requests.some((r) => r._id.toString() === requestId.toString()), '16. Leader Retrieves Incoming Requests');

    // 15. Team Leader Accepts Join Request
    const acceptRes = await mockReqRes('PATCH', `/api/requests/${requestId}/accept`, authHeaders);
    assert(acceptRes.status === 200 && acceptRes.data.request.status === 'Accepted', '17. Leader Accepts Join Request');

    // 16. Verify Member Added to Team and Vacancy Decreased
    const updatedTeamRes = await mockReqRes('GET', `/api/teams/${newTeamId}`);
    assert(
      updatedTeamRes.data.team.members.some((m) => (m._id || m).toString() === priyaLogin.data.user._id.toString()) &&
      updatedTeamRes.data.team.availablePositions === 1,
      '18. Member Added to Team Roster and Vacancies Decremented'
    );

    // 17. Priya Checks Notifications
    const priyaNotifs = await mockReqRes('GET', '/api/notifications', priyaHeaders);
    assert(
      priyaNotifs.status === 200 &&
      priyaNotifs.data.notifications.some((n) => n.type === 'request_accepted'),
      '19. Applicant Receives Notification on Acceptance'
    );

    // 18. Mark Notification as Read
    const notifId = priyaNotifs.data.notifications[0]._id;
    const markReadRes = await mockReqRes('PATCH', `/api/notifications/${notifId}/read`, priyaHeaders);
    assert(markReadRes.status === 200 && markReadRes.data.notification.read === true, '20. Mark Notification as Read');

    // 19. Team Leader Cannot Leave Team Without Transferring
    const leaveRes = await mockReqRes('POST', `/api/teams/${newTeamId}/leave`, authHeaders);
    assert(leaveRes.status === 400, '21. Prevent Team Leader From Abandoning Team');

    console.log(`\n=============================================`);
    console.log(`🎉 TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
    console.log(`=============================================\n`);

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error('Test Suite Exception:', err);
    process.exit(1);
  }
};

runAllTests();
