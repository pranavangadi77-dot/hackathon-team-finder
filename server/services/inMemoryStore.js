const crypto = require('crypto');

const generateId = () => crypto.randomBytes(12).toString('hex');

class MemoryCollection {
  constructor(name) {
    this.name = name;
    this.items = [];
  }

  async find(query = {}) {
    let result = this.items.filter((item) => this._matches(item, query));
    return result.map((i) => ({ ...i }));
  }

  async findOne(query = {}) {
    const item = this.items.find((i) => this._matches(i, query));
    return item ? { ...item } : null;
  }

  async findById(id) {
    if (!id) return null;
    const sId = id.toString();
    const item = this.items.find((i) => i._id.toString() === sId);
    return item ? { ...item } : null;
  }

  async create(data) {
    const now = new Date();
    const newItem = {
      _id: data._id ? data._id.toString() : generateId(),
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    this.items.push(newItem);
    return { ...newItem };
  }

  async findByIdAndUpdate(id, update, options = { new: true }) {
    const sId = id.toString();
    const index = this.items.findIndex((i) => i._id.toString() === sId);
    if (index === -1) return null;

    let updated = { ...this.items[index] };

    if (update.$set) {
      updated = { ...updated, ...update.$set };
    }
    if (update.$addToSet) {
      for (const [key, val] of Object.entries(update.$addToSet)) {
        if (!Array.isArray(updated[key])) updated[key] = [];
        const exists = updated[key].some((el) => el.toString() === (val._id || val).toString());
        if (!exists) updated[key].push(val);
      }
    }
    if (update.$pull) {
      for (const [key, val] of Object.entries(update.$pull)) {
        if (Array.isArray(updated[key])) {
          updated[key] = updated[key].filter(
            (el) => el.toString() !== (val._id || val).toString()
          );
        }
      }
    }
    if (update.$inc) {
      for (const [key, val] of Object.entries(update.$inc)) {
        updated[key] = (updated[key] || 0) + val;
      }
    }

    // Direct object update
    Object.keys(update).forEach((k) => {
      if (!k.startsWith('$')) {
        updated[k] = update[k];
      }
    });

    updated.updatedAt = new Date();
    this.items[index] = updated;
    return options.new ? { ...updated } : this.items[index];
  }

  async findByIdAndDelete(id) {
    const sId = id.toString();
    const index = this.items.findIndex((i) => i._id.toString() === sId);
    if (index === -1) return null;
    const removed = this.items.splice(index, 1)[0];
    return removed;
  }

  async countDocuments(query = {}) {
    return this.items.filter((item) => this._matches(item, query)).length;
  }

  _matches(item, query) {
    for (const [key, val] of Object.entries(query)) {
      if (val === undefined) continue;

      if (key === '$or') {
        const matchesAny = val.some((subQuery) => this._matches(item, subQuery));
        if (!matchesAny) return false;
        continue;
      }

      if (key === '$and') {
        const matchesAll = val.every((subQuery) => this._matches(item, subQuery));
        if (!matchesAll) return false;
        continue;
      }

      const itemVal = item[key];

      // Handle RegExp
      if (val instanceof RegExp) {
        if (typeof itemVal !== 'string' || !val.test(itemVal)) return false;
        continue;
      }

      // Handle operator objects
      if (val && typeof val === 'object' && !Array.isArray(val) && !(val instanceof Date)) {
        if (val.$in) {
          const list = val.$in.map((v) => (v ? v.toString().toLowerCase() : ''));
          if (Array.isArray(itemVal)) {
            const hasCommon = itemVal.some((iv) =>
              list.includes(iv ? iv.toString().toLowerCase() : '')
            );
            if (!hasCommon) return false;
          } else {
            if (!list.includes(itemVal ? itemVal.toString().toLowerCase() : '')) {
              return false;
            }
          }
          continue;
        }

        if (val.$nin) {
          const list = val.$nin.map((v) => v.toString());
          if (list.includes(itemVal ? itemVal.toString() : '')) return false;
          continue;
        }

        if (val.$ne !== undefined) {
          const target = val.$ne ? val.$ne.toString() : null;
          const current = itemVal ? itemVal.toString() : null;
          if (target === current) return false;
          continue;
        }

        if (val.$regex) {
          const regex = new RegExp(val.$regex, val.$options || '');
          if (Array.isArray(itemVal)) {
            const matchesSome = itemVal.some((iv) => regex.test(iv));
            if (!matchesSome) return false;
          } else if (typeof itemVal === 'string') {
            if (!regex.test(itemVal)) return false;
          } else {
            return false;
          }
          continue;
        }

        if (val.$gt !== undefined && !(itemVal > val.$gt)) return false;
        if (val.$gte !== undefined && !(itemVal >= val.$gte)) return false;
        if (val.$lt !== undefined && !(itemVal < val.$lt)) return false;
        if (val.$lte !== undefined && !(itemVal <= val.$lte)) return false;

        continue;
      }

      // Array field contains val
      if (Array.isArray(itemVal) && !Array.isArray(val)) {
        const target = val ? val.toString().toLowerCase() : '';
        const has = itemVal.some((iv) => iv && iv.toString().toLowerCase() === target);
        if (!has) return false;
        continue;
      }

      // Equality check
      const left = itemVal ? itemVal.toString() : itemVal;
      const right = val ? val.toString() : val;
      if (left !== right) return false;
    }
    return true;
  }
}

const memoryStore = {
  users: new MemoryCollection('users'),
  teams: new MemoryCollection('teams'),
  joinRequests: new MemoryCollection('joinRequests'),
  notifications: new MemoryCollection('notifications'),
};

module.exports = memoryStore;
