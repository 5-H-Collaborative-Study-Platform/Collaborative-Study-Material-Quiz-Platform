const User = require("../models/User");

describe("User role", () => {
  test("defaults to student", async () => {
    const u = await User.create({
      name: "A",
      email: "a@test.com",
      passwordHash: "x",
    });

    expect(u.role).toBe("student");
  });

  test("accepts admin", async () => {
    const u = await User.create({
      name: "B",
      email: "b@test.com",
      passwordHash: "x",
      role: "admin",
    });

    expect(u.role).toBe("admin");
  });

  test("rejects invalid role", async () => {
    await expect(
      User.create({
        name: "C",
        email: "c@test.com",
        passwordHash: "x",
        role: "teacher",
      }),
    ).rejects.toThrow();
  });
});
