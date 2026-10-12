const mongoose = require("mongoose");

// Smoke test for the shared test harness: proves the in-memory MongoDB is
// connected and that the afterEach cleanup gives each test a clean slate.
const Thing = mongoose.model(
  "Thing",
  new mongoose.Schema({ name: String }),
);

describe("test harness", () => {
  test("mongoose is connected to the in-memory server", () => {
    expect(mongoose.connection.readyState).toBe(1);
  });

  test("documents can be written and read back", async () => {
    await Thing.create({ name: "alpha" });
    const found = await Thing.find();

    expect(found).toHaveLength(1);
    expect(found[0].name).toBe("alpha");
  });

  test("collections are cleared between tests", async () => {
    const count = await Thing.countDocuments();

    expect(count).toBe(0);
  });
});
