"use server";
import { cookies } from "next/headers";
import * as jose from "jose";
import { TOKEN_COOKIE, encodedJwtSecret } from "@/config";

export async function createSession(user: any) {
  const token = await new jose.SignJWT(user)
    .setProtectedHeader({ alg: "HS256" })
    .sign(encodedJwtSecret);

  cookies().set(TOKEN_COOKIE, token);
}

export async function deleteSession() {
  cookies().delete(TOKEN_COOKIE);
}
