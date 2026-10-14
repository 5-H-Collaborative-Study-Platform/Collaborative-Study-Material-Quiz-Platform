
const request = require("supertest");
const bcrypt = require("bcryptjs");
const app = require("../index");
const User = require("../models/User");

const valid = {
  name: "Asha",
  email: "asha@test.com",
  password: "secret123",
};

describe("POST /api/auth/register", () => {
  test("valid registration -> 201, no password echoed", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send(valid);

    expect(res.statusCode).toBe(201);
    expect(res.body.email).toBe("asha@test.com");
    expect(res.body.passwordHash).toBeUndefined();
    expect(res.body.password).toBeUndefined();
  });

  test("password is stored hashed", async () => {
    await request(app)
      .post("/api/auth/register")
      .send(valid);

    const user = await User.findOne({
      email: valid.email,
    });

    expect(user).not.toBeNull();
    expect(
      await bcrypt.compare(valid.password, user.passwordHash)
    ).toBe(true);
  });

  test("missing fields -> 400", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "x@y.com" });

    expect(res.statusCode).toBe(400);
  });

  test("duplicate email -> 409", async () => {
    await request(app)
      .post("/api/auth/register")
      .send(valid);

    const res = await request(app)
      .post("/api/auth/register")
      .send(valid);

    expect(res.statusCode).toBe(409);
  });
});