import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/db";
import * as schema from "@/db/schema";

export const auth = betterAuth({
  plugins: [nextCookies()],
  trustedOrigins: ["https://spooky-quizz.vercel.app", "http://localhost:3000"],
  emailAndPassword: {
    enabled: true,
  },
  session: {},
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
    schema: schema,
  }),
});
