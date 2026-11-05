require('dotenv').config();
const bcrypt = require('bcryptjs');
const { connectDB } = require('./config/db');
const { User, Team, JoinRequest, Notification } = require('./models');
const { seedUsers, seedTeams } = require('./seedData');

const runSeed = async () => {
  console.log('[Seed] Initializing HackMate database seeding...');
  const { getIsConnected } = require('./config/db');
  if (!getIsConnected()) {
    await connectDB();
  }

  try {
    // Clear existing data
    await User.deleteMany({});
    await Team.deleteMany({});
    await JoinRequest.deleteMany({});
    await Notification.deleteMany({});
    console.log('[Seed] Cleared old collections.');

    // 1. Hash passwords and insert users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const userDocs = [];
    for (const u of seedUsers) {
      const created = await User.create({
        ...u,
        password: hashedPassword,
      });
      userDocs.push(created);
    }
    console.log(`[Seed] Successfully inserted ${userDocs.length} student profiles.`);

    const userMap = new Map();
    userDocs.forEach((u) => {
      userMap.set(u.email.toLowerCase(), u);
    });

    // 2. Insert teams
    const createdTeams = [];
    for (const t of seedTeams) {
      const leader = userMap.get(t.leaderEmail.toLowerCase());
      if (!leader) continue;

      const memberIds = [leader._id];
      if (Array.isArray(t.memberEmails)) {
        t.memberEmails.forEach((email) => {
          const m = userMap.get(email.toLowerCase());
          if (m && !memberIds.includes(m._id)) {
            memberIds.push(m._id);
          }
        });
      }

      const availablePositions = Math.max(0, t.maxMembers - memberIds.length);

      const teamDoc = await Team.create({
        name: t.name,
        projectTitle: t.projectTitle,
        hackathonName: t.hackathonName,
        description: t.description,
        problemStatement: t.problemStatement,
        category: t.category,
        leader: leader._id,
        members: memberIds,
        requiredSkills: t.requiredSkills,
        maxMembers: t.maxMembers,
        availablePositions,
        preferredExperience: t.preferredExperience,
        applicationDeadline: t.applicationDeadline,
        contactInfo: t.contactInfo,
        status: availablePositions === 0 ? 'Full' : 'Open',
      });

      createdTeams.push(teamDoc);
    }
    console.log(`[Seed] Successfully created ${createdTeams.length} hackathon teams.`);

    // 3. Create Sample Join Requests
    // Request 1: Liam O'Connor (Backend specialist) -> NeuroPulse Health (Pending)
    const liam = userMap.get('liam@hackmate.dev');
    const neuroPulse = createdTeams.find((t) => t.name.includes('NeuroPulse'));
    if (liam && neuroPulse) {
      await JoinRequest.create({
        student: liam._id,
        team: neuroPulse._id,
        message: 'Hey Priya! I have extensive Node.js and REST microservices experience. I can build the real-time audio telemetry ingestion pipeline for the stroke detection model.',
        status: 'Pending',
      });

      await Notification.create({
        recipient: neuroPulse.leader._id || neuroPulse.leader,
        sender: liam._id,
        title: `Join Request: ${neuroPulse.name}`,
        message: `${liam.name} sent a join request to ${neuroPulse.name}.`,
        type: 'request_received',
        team: neuroPulse._id,
      });
    }

    // Request 2: Zoe Washington -> EduBridge Tutor (Pending)
    const zoe = userMap.get('zoe@hackmate.dev');
    const eduBridge = createdTeams.find((t) => t.name.includes('EduBridge'));
    if (zoe && eduBridge) {
      await JoinRequest.create({
        student: zoe._id,
        team: eduBridge._id,
        message: 'Hi Elena! I love the vision of voice-first education for neurodivergent learners. I can help build interactive UI components and structure our demo pitch deck.',
        status: 'Pending',
      });
    }

    // Request 3: Sofia -> AetherShield (Accepted)
    const sofia = userMap.get('sofia@hackmate.dev');
    const aetherShield = createdTeams.find((t) => t.name.includes('AetherShield'));
    if (sofia && aetherShield) {
      await JoinRequest.create({
        student: sofia._id,
        team: aetherShield._id,
        message: 'Devon, I specialize in cloud attack graphs and kernel privilege escalation. Would love to join AetherShield!',
        status: 'Accepted',
      });
    }

    console.log('[Seed] Successfully seeded join requests and notifications.');
    console.log('\n=============================================');
    console.log('✅ HackMate Database Seeding Complete!');
    console.log('Test Accounts (Password for all: password123)');
    console.log('1. priya@hackmate.dev  (Leader: NeuroPulse Health, MIT, ML/Python)');
    console.log('2. liam@hackmate.dev   (Backend/Node.js, Trinity College Dublin)');
    console.log('3. aarav@hackmate.dev  (Fullstack/React, Stanford University)');
    console.log('4. marcus@hackmate.dev (Web3/Solidity, UC Berkeley)');
    console.log('=============================================\n');
  } catch (error) {
    console.error('[Seed Error]:', error);
  }
};

if (require.main === module) {
  runSeed().then(() => {
    process.exit(0);
  });
}

module.exports = runSeed;
