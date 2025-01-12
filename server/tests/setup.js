const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod;

// Connect to the in-memory database before running tests
beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
});

// Clear all test data after each test
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
});

// Disconnect and stop mongod after all tests are done
afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

// Mock environment variables
process.env.JWT_SECRET = 'test-secret';
process.env.NODE_ENV = 'test';

// Global test timeout
jest.setTimeout(30000); 