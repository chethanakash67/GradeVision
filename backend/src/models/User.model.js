import { v4 as uuidv4 } from 'uuid';

// In-memory user storage (replace with MongoDB in production)
const users = new Map();

// Default admin user
users.set('admin@gradevision.edu', {
  id: uuidv4(),
  email: 'admin@gradevision.edu',
  password: '$2a$10$example', // In real app, this would be hashed
  firstName: 'Admin',
  lastName: 'User',
  role: 'admin',
  avatar: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

export class User {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.email = data.email;
    this.password = data.password;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.role = data.role || 'student';
    this.avatar = data.avatar || null;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  static async findByEmail(email) {
    return users.get(email) || null;
  }

  static async findById(id) {
    for (const user of users.values()) {
      if (user.id === id) return user;
    }
    return null;
  }

  static async create(userData) {
    const user = new User(userData);
    users.set(user.email, user);
    return user;
  }

  static async update(id, updateData) {
    for (const [email, user] of users.entries()) {
      if (user.id === id) {
        const updated = { ...user, ...updateData, updatedAt: new Date().toISOString() };
        users.set(email, updated);
        return updated;
      }
    }
    return null;
  }

  toJSON() {
    const { password, ...user } = this;
    return user;
  }
}

export default User;
