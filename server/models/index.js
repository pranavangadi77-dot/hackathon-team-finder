const mongoose = require('mongoose');
const MongooseUser = require('./User');
const MongooseTeam = require('./Team');
const MongooseJoinRequest = require('./JoinRequest');
const MongooseNotification = require('./Notification');
const memoryStore = require('../services/inMemoryStore');

const isMongoActive = () => mongoose.connection.readyState === 1;

// Helper to simulate Mongoose chaining & population on memory items
const enrichTeamInMemory = async (team) => {
  if (!team) return null;
  const enriched = { ...team };

  if (enriched.leader) {
    const leaderId = enriched.leader._id || enriched.leader;
    const leaderUser = await memoryStore.users.findById(leaderId);
    if (leaderUser) {
      const { password, ...safeLeader } = leaderUser;
      enriched.leader = safeLeader;
    }
  }

  if (Array.isArray(enriched.members)) {
    enriched.members = await Promise.all(
      enriched.members.map(async (m) => {
        const mId = m._id || m;
        const u = await memoryStore.users.findById(mId);
        if (u) {
          const { password, ...safeUser } = u;
          return safeUser;
        }
        return m;
      })
    );
  }

  return enriched;
};

const enrichJoinRequestInMemory = async (req) => {
  if (!req) return null;
  const enriched = { ...req };

  if (enriched.student) {
    const sId = enriched.student._id || enriched.student;
    const studentUser = await memoryStore.users.findById(sId);
    if (studentUser) {
      const { password, ...safeStudent } = studentUser;
      enriched.student = safeStudent;
    }
  }

  if (enriched.team) {
    const tId = enriched.team._id || enriched.team;
    const teamDoc = await memoryStore.teams.findById(tId);
    if (teamDoc) {
      enriched.team = await enrichTeamInMemory(teamDoc);
    }
  }

  return enriched;
};

const enrichNotificationInMemory = async (notif) => {
  if (!notif) return null;
  const enriched = { ...notif };

  if (enriched.sender) {
    const sId = enriched.sender._id || enriched.sender;
    const sender = await memoryStore.users.findById(sId);
    if (sender) {
      const { password, ...safeSender } = sender;
      enriched.sender = safeSender;
    }
  }

  if (enriched.team) {
    const tId = enriched.team._id || enriched.team;
    const teamDoc = await memoryStore.teams.findById(tId);
    if (teamDoc) {
      enriched.team = teamDoc;
    }
  }

  return enriched;
};

// Unified User API
const User = {
  isMongoose: () => isMongoActive(),
  async create(data) {
    if (isMongoActive()) return await MongooseUser.create(data);
    return await memoryStore.users.create(data);
  },
  async findOne(query) {
    if (isMongoActive()) return await MongooseUser.findOne(query);
    return await memoryStore.users.findOne(query);
  },
  async findById(id) {
    if (isMongoActive()) return await MongooseUser.findById(id);
    return await memoryStore.users.findById(id);
  },
  async find(query = {}) {
    if (isMongoActive()) return await MongooseUser.find(query).select('-password');
    const users = await memoryStore.users.find(query);
    return users.map(({ password, ...u }) => u);
  },
  async findByIdAndUpdate(id, update, opts = { new: true }) {
    if (isMongoActive()) return await MongooseUser.findByIdAndUpdate(id, update, opts).select('-password');
    const updated = await memoryStore.users.findByIdAndUpdate(id, update, opts);
    if (updated && updated.password) delete updated.password;
    return updated;
  },
  async countDocuments(query = {}) {
    if (isMongoActive()) return await MongooseUser.countDocuments(query);
    return await memoryStore.users.countDocuments(query);
  },
  async insertMany(docs) {
    if (isMongoActive()) return await MongooseUser.insertMany(docs);
    return await Promise.all(docs.map((d) => memoryStore.users.create(d)));
  },
  async deleteMany(query = {}) {
    if (isMongoActive()) return await MongooseUser.deleteMany(query);
    memoryStore.users.items = [];
    return { acknowledged: true };
  },
};

// Unified Team API
const Team = {
  isMongoose: () => isMongoActive(),
  async create(data) {
    if (isMongoActive()) return await MongooseTeam.create(data);
    const doc = await memoryStore.teams.create(data);
    return await enrichTeamInMemory(doc);
  },
  async find(query = {}, sort = { createdAt: -1 }) {
    if (isMongoActive()) {
      return await MongooseTeam.find(query)
        .populate('leader', 'name email college avatar branch technicalSkills')
        .populate('members', 'name email college avatar branch technicalSkills')
        .sort(sort);
    }
    const teams = await memoryStore.teams.find(query);
    const enriched = await Promise.all(teams.map(enrichTeamInMemory));
    return enriched.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },
  async findById(id) {
    if (isMongoActive()) {
      return await MongooseTeam.findById(id)
        .populate('leader', 'name email college avatar branch technicalSkills experience bio')
        .populate('members', 'name email college avatar branch technicalSkills experience bio');
    }
    const doc = await memoryStore.teams.findById(id);
    return await enrichTeamInMemory(doc);
  },
  async findOne(query) {
    if (isMongoActive()) {
      return await MongooseTeam.findOne(query)
        .populate('leader', 'name email college avatar branch technicalSkills')
        .populate('members', 'name email college avatar branch technicalSkills');
    }
    const doc = await memoryStore.teams.findOne(query);
    return await enrichTeamInMemory(doc);
  },
  async findByIdAndUpdate(id, update, opts = { new: true }) {
    if (isMongoActive()) {
      return await MongooseTeam.findByIdAndUpdate(id, update, opts)
        .populate('leader', 'name email college avatar branch technicalSkills')
        .populate('members', 'name email college avatar branch technicalSkills');
    }
    const updated = await memoryStore.teams.findByIdAndUpdate(id, update, opts);
    return await enrichTeamInMemory(updated);
  },
  async findByIdAndDelete(id) {
    if (isMongoActive()) return await MongooseTeam.findByIdAndDelete(id);
    return await memoryStore.teams.findByIdAndDelete(id);
  },
  async countDocuments(query = {}) {
    if (isMongoActive()) return await MongooseTeam.countDocuments(query);
    return await memoryStore.teams.countDocuments(query);
  },
  async insertMany(docs) {
    if (isMongoActive()) return await MongooseTeam.insertMany(docs);
    return await Promise.all(docs.map((d) => memoryStore.teams.create(d)));
  },
  async deleteMany(query = {}) {
    if (isMongoActive()) return await MongooseTeam.deleteMany(query);
    memoryStore.teams.items = [];
    return { acknowledged: true };
  },
};

// Unified JoinRequest API
const JoinRequest = {
  isMongoose: () => isMongoActive(),
  async create(data) {
    if (isMongoActive()) return await MongooseJoinRequest.create(data);
    const doc = await memoryStore.joinRequests.create(data);
    return await enrichJoinRequestInMemory(doc);
  },
  async find(query = {}) {
    if (isMongoActive()) {
      return await MongooseJoinRequest.find(query)
        .populate('student', 'name email college avatar branch technicalSkills experience bio')
        .populate('team')
        .sort({ createdAt: -1 });
    }
    const requests = await memoryStore.joinRequests.find(query);
    const enriched = await Promise.all(requests.map(enrichJoinRequestInMemory));
    return enriched.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },
  async findOne(query) {
    if (isMongoActive()) {
      return await MongooseJoinRequest.findOne(query)
        .populate('student', 'name email college avatar branch technicalSkills experience bio')
        .populate('team');
    }
    const doc = await memoryStore.joinRequests.findOne(query);
    return await enrichJoinRequestInMemory(doc);
  },
  async findById(id) {
    if (isMongoActive()) {
      return await MongooseJoinRequest.findById(id)
        .populate('student', 'name email college avatar branch technicalSkills experience bio')
        .populate('team');
    }
    const doc = await memoryStore.joinRequests.findById(id);
    return await enrichJoinRequestInMemory(doc);
  },
  async findByIdAndUpdate(id, update, opts = { new: true }) {
    if (isMongoActive()) {
      return await MongooseJoinRequest.findByIdAndUpdate(id, update, opts)
        .populate('student', 'name email college avatar branch technicalSkills experience bio')
        .populate('team');
    }
    const updated = await memoryStore.joinRequests.findByIdAndUpdate(id, update, opts);
    return await enrichJoinRequestInMemory(updated);
  },
  async countDocuments(query = {}) {
    if (isMongoActive()) return await MongooseJoinRequest.countDocuments(query);
    return await memoryStore.joinRequests.countDocuments(query);
  },
  async insertMany(docs) {
    if (isMongoActive()) return await MongooseJoinRequest.insertMany(docs);
    return await Promise.all(docs.map((d) => memoryStore.joinRequests.create(d)));
  },
  async deleteMany(query = {}) {
    if (isMongoActive()) return await MongooseJoinRequest.deleteMany(query);
    memoryStore.joinRequests.items = [];
    return { acknowledged: true };
  },
};

// Unified Notification API
const Notification = {
  isMongoose: () => isMongoActive(),
  async create(data) {
    if (isMongoActive()) return await MongooseNotification.create(data);
    const doc = await memoryStore.notifications.create(data);
    return await enrichNotificationInMemory(doc);
  },
  async find(query = {}) {
    if (isMongoActive()) {
      return await MongooseNotification.find(query)
        .populate('sender', 'name avatar')
        .populate('team', 'name projectTitle')
        .sort({ createdAt: -1 });
    }
    const list = await memoryStore.notifications.find(query);
    const enriched = await Promise.all(list.map(enrichNotificationInMemory));
    return enriched.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },
  async findById(id) {
    if (isMongoActive()) return await MongooseNotification.findById(id);
    const doc = await memoryStore.notifications.findById(id);
    return await enrichNotificationInMemory(doc);
  },
  async findByIdAndUpdate(id, update, opts = { new: true }) {
    if (isMongoActive()) return await MongooseNotification.findByIdAndUpdate(id, update, opts);
    const updated = await memoryStore.notifications.findByIdAndUpdate(id, update, opts);
    return await enrichNotificationInMemory(updated);
  },
  async updateMany(query, update) {
    if (isMongoActive()) return await MongooseNotification.updateMany(query, update);
    const items = await memoryStore.notifications.find(query);
    for (const item of items) {
      await memoryStore.notifications.findByIdAndUpdate(item._id, update);
    }
    return { acknowledged: true, modifiedCount: items.length };
  },
  async countDocuments(query = {}) {
    if (isMongoActive()) return await MongooseNotification.countDocuments(query);
    return await memoryStore.notifications.countDocuments(query);
  },
  async deleteMany(query = {}) {
    if (isMongoActive()) return await MongooseNotification.deleteMany(query);
    memoryStore.notifications.items = [];
    return { acknowledged: true };
  },
};

module.exports = {
  User,
  Team,
  JoinRequest,
  Notification,
  MongooseUser,
  MongooseTeam,
  MongooseJoinRequest,
  MongooseNotification,
  isMongoActive,
};
