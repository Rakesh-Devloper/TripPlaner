// Database configuration and connection manager
// Handles both in-memory store and optional MongoDB/Cloud database

class Database {
  constructor() {
    this.isConnected = true;
    this.type = 'in-memory';
  }

  async connect() {
    console.log('[Database] In-memory datastore initialized and ready.');
    return true;
  }
}

export const db = new Database();
export default db;
