
const request = require("supertest");
const app = require("../index");

const creds = { name: "Asha", email: "asha@test.com", password: "secret123" };
const register = () => request(app).post("/api/auth/register").send(creds);

describe("POST /api/auth/login", () => {
  test("correct credentials -> token", async () => {
    await register();

    const res = await request(app).post("/api/auth/login")
      .send({ email: creds.email, password: creds.password });

    expect(res.statusCode).toBe(200);
    expect(typeof res.body.token).toBe("string");
  });

  test("wrong password -> 401", async () => {
    await register();

    const res = await request(app).post("/api/auth/login")
      .send({ email: creds.email, password: "wrong" });

    expect(res.statusCode).toBe(401);
  });

  test("missing fields -> 400", async () => {
    const res = await request(app).post("/api/auth/login").send({});

    expect(res.statusCode).toBe(400);
  });
});
