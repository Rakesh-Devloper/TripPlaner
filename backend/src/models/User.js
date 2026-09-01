// User Model & In-memory Store
import { initialUsers } from '../utils/seedData.js';

let users = [...initialUsers];
let currentUser = users[0];

export const UserModel = {
  getCurrentUser: () => currentUser,
  
  updateCurrentUser: (updates) => {
    currentUser = { ...currentUser, ...updates };
    return currentUser;
  },

  findByEmail: (email) => {
    return users.find((u) => u.email.toLowerCase() === (email || '').toLowerCase()) || null;
  },

  loginOrRegister: ({ name, email }) => {
    currentUser = {
      ...currentUser,
      name: name || currentUser.name || 'Explorer',
      email: email || currentUser.email || 'user@tripplanner.ai',
    };
    return currentUser;
  },

  incrementTripsCount: () => {
    currentUser.tripsCount = (currentUser.tripsCount || 0) + 1;
    return currentUser;
  }
};

export default UserModel;
