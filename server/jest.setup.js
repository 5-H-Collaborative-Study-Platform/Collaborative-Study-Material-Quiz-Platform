const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

// Shared in-memory MongoDB so tests never touch a real database.
let mongo;

// A JWT secret is needed by auth code under test; provide one if absent.
process.env.JWT_SECRET = process.env.JWT_SECRET || "test_secret";

// Allow extra time here: the first run downloads the mongod binary.
beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
}, 120000);

// Keep tests isolated: wipe every collection between tests.
afterEach(async () => {
  const { collections } = mongoose.connection;
  for (const key of Object.keys(collections)) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongo) await mongo.stop();
});
