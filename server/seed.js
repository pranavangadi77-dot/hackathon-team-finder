require('dotenv').config();
const bcrypt = require('bcryptjs');
const { connectDB, getIsConnected } = require('./config/db');
const { User, Team, JoinRequest, Notification } = require('./models');
const { seedUsers, seedTeams } = require('./seedData');

const runSeed = async () => {
  console.log('[Seed] Initializing HackathonTeam Finder database seeding...');
  if (!getIsConnected()) {
    await connectDB();
  }

  try {
    // Clear existing data safely
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

    // 2. Insert 8 Teams
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

      const maxCap = t.maximumMembers || t.maxMembers || 4;
      const availablePositions = Math.max(0, maxCap - memberIds.length);

      const teamDoc = await Team.create({
        teamName: t.teamName || t.name,
        name: t.name || t.teamName,
        projectTitle: t.projectTitle,
        hackathonName: t.hackathonName,
        description: t.description,
        problemStatement: t.problemStatement,
        category: t.category,
        college: t.college || leader.college,
        leader: leader._id,
        members: memberIds,
        requiredSkills: t.requiredSkills,
        missingSkills: t.missingSkills,
        availableRoles: t.availableRoles,
        maximumMembers: maxCap,
        maxMembers: maxCap,
        availablePositions,
        preferredExperience: t.preferredExperience,
        hackathonDeadline: t.hackathonDeadline,
        applicationDeadline: t.applicationDeadline,
        hackathonDate: t.hackathonDate,
        eventDate: t.eventDate,
        contactInfo: t.contactInfo,
        status: availablePositions === 0 ? 'Full' : 'Open',
        visibility: t.visibility || 'Public',
      });

      createdTeams.push(teamDoc);
    }
    console.log(`[Seed] Successfully created ${createdTeams.length} hackathon teams.`);

    // 3. Create Sample Join Requests (Pending, Accepted, Rejected)
    // Request 1: Liam O'Connor (Node.js & Backend) -> AI Innovators (Pending)
    const liam = userMap.get('liam@hackmate.dev');
    const aiInnovators = createdTeams.find((t) => (t.teamName || t.name) === 'AI Innovators');
    if (liam && aiInnovators) {
      const req1 = await JoinRequest.create({
        student: liam._id,
        team: aiInnovators._id,
        message: 'Hey Aarav! I have extensive Node.js and Python backend microservices experience. I can build the agent orchestration and streaming API pipeline.',
        status: 'Pending',
      });

      await Notification.create({
        recipient: aiInnovators.leader._id || aiInnovators.leader,
        sender: liam._id,
        title: `Join Request: ${aiInnovators.name || aiInnovators.teamName}`,
        message: `${liam.name} sent a join request to ${aiInnovators.name || aiInnovators.teamName}.`,
        type: 'request_received',
        team: aiInnovators._id,
        relatedTeam: aiInnovators._id,
        relatedRequest: req1._id,
      });
    }

    // Request 2: Maya Lin (React & MongoDB) -> Web Wizards (Pending)
    const maya = userMap.get('maya@hackmate.dev');
    const webWizards = createdTeams.find((t) => (t.teamName || t.name) === 'Web Wizards');
    if (maya && webWizards) {
      const req2 = await JoinRequest.create({
        student: maya._id,
        team: webWizards._id,
        message: 'Hi Liam! My primary stack is React and MongoDB. I would love to build the collaborative whiteboard interface and responsive canvas component.',
        status: 'Pending',
      });

      await Notification.create({
        recipient: webWizards.leader._id || webWizards.leader,
        sender: maya._id,
        title: `Join Request: ${webWizards.name || webWizards.teamName}`,
        message: `${maya.name} applied to join ${webWizards.name || webWizards.teamName}.`,
        type: 'request_received',
        team: webWizards._id,
        relatedTeam: webWizards._id,
        relatedRequest: req2._id,
      });
    }

    // Request 3: Elena -> AI Innovators (Accepted)
    const elena = userMap.get('elena@hackmate.dev');
    if (elena && aiInnovators) {
      await JoinRequest.create({
        student: elena._id,
        team: aiInnovators._id,
        message: 'Hi Aarav! I would love to design the multi-agent UI system and user interaction flows in Figma and Tailwind.',
        status: 'Accepted',
        reviewedBy: aiInnovators.leader._id || aiInnovators.leader,
        reviewedAt: new Date(),
      });

      await Notification.create({
        recipient: elena._id,
        sender: aiInnovators.leader._id || aiInnovators.leader,
        title: 'Join Request Accepted! 🎉',
        message: `Aarav Sharma accepted your request to join AI Innovators for National Innovation Challenge 2026!`,
        type: 'request_accepted',
        team: aiInnovators._id,
        relatedTeam: aiInnovators._id,
      });
    }

    // Request 4: Carlos Mendez -> FinTech Pioneers (Rejected)
    const carlos = userMap.get('carlos@hackmate.dev');
    const finTechPioneers = createdTeams.find((t) => (t.teamName || t.name) === 'FinTech Pioneers');
    if (carlos && finTechPioneers) {
      await JoinRequest.create({
        student: carlos._id,
        team: finTechPioneers._id,
        message: 'Hey Zoe, I can help build an AR interface for visualizing transaction flows.',
        status: 'Rejected',
        reviewedBy: finTechPioneers.leader._id || finTechPioneers.leader,
        reviewedAt: new Date(),
      });

      await Notification.create({
        recipient: carlos._id,
        sender: finTechPioneers.leader._id || finTechPioneers.leader,
        title: 'Join Request Status Update',
        message: `Your request to join "FinTech Pioneers" was declined. There are other teams searching for Computer Vision!`,
        type: 'request_rejected',
        team: finTechPioneers._id,
        relatedTeam: finTechPioneers._id,
      });
    }

    console.log('[Seed] Successfully seeded join requests and notifications.');
    console.log('\n=============================================');
    console.log('✅ HackathonTeam Finder Database Seeding Complete!');
    console.log('Demonstration Accounts (Password for all: password123)');
    console.log('1. priya@hackmate.dev  (ML/Python, Leader: HealthTech Squad)');
    console.log('2. liam@hackmate.dev   (Backend/Node.js, Leader: Web Wizards)');
    console.log('3. aarav@hackmate.dev  (React/TypeScript, Leader: AI Innovators)');
    console.log('4. marcus@hackmate.dev (Python/FastAPI, Leader: Quantum Coders)');
    console.log('5. sofia@hackmate.dev  (Cybersecurity/Cloud, Leader: Cyber Defenders)');
    console.log('6. ananya@hackmate.dev (Data Science/Python, Leader: GreenTech Builders)');
    console.log('7. zoe@hackmate.dev    (Database/Node.js, Leader: FinTech Pioneers)');
    console.log('8. kavita@hackmate.dev (Computer Vision/React, Leader: Vision Developers)');
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
