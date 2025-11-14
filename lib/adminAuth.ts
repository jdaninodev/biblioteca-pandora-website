import jwt from "jsonwebtoken";

const TOKEN_NAME = "admin_token";

export function signAdmin(payload: object) {
  const secret = process.env.ADMIN_JWT_SECRET || "dev_secret";
  return jwt.sign(payload, secret, { expiresIn: "1d" });
}

export function verifyAdmin(token: string) {
  const secret = process.env.ADMIN_JWT_SECRET || "dev_secret";
  try {
    return jwt.verify(token, secret) as object;
  } catch (e) {
    return null;
  }
}

export { TOKEN_NAME };
