"use server";
import { cookies } from "next/headers";
import * as jose from "jose";
import { TOKEN_COOKIE, encodedJwtSecret } from "@/config";

export type User = {
  id: string | number;
  login: string;
};

export async function createSession(user: jose.JWTPayload) {
  const token = await new jose.SignJWT(user)
    .setProtectedHeader({ alg: "HS256" })
    .sign(encodedJwtSecret);

  (await cookies()).set(TOKEN_COOKIE, token);
}

export async function deleteSession() {
  (await cookies()).delete(TOKEN_COOKIE);
}
export async function getUserFromSession() {
  const token = (await cookies()).get(TOKEN_COOKIE)?.value;
  if (!token) return null;
  const currentUser = (await jose.jwtVerify(token, encodedJwtSecret)).payload;
  if (!currentUser) return null;
  return currentUser as User;
}
