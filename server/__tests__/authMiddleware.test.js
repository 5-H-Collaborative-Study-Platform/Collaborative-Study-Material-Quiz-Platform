const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

const mockRes = () => ({
  statusCode: 200, body: null,
  status(c) { this.statusCode = c; return this; },
  json(p) { this.body = p; return this; },
});

describe("auth middleware", () => {
  test("valid token -> next + req.user", () => {
    const token = jwt.sign({ id: "123", role: "student" }, process.env.JWT_SECRET);
    const req = { headers: { authorization: `Bearer ${token}` } };
    let next = false;
    auth(req, mockRes(), () => { next = true; });
    expect(next).toBe(true);
    expect(req.user.id).toBe("123");
  });

  test("no token -> 401", () => {
    const res = mockRes();
    auth({ headers: {} }, res, () => {});
    expect(res.statusCode).toBe(401);
  });

  test("bad token -> 401", () => {
    const res = mockRes();
    auth({ headers: { authorization: "Bearer bad" } }, res, () => {});
    expect(res.statusCode).toBe(401);
  });
});