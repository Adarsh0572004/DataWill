import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const mongoUrl = process.env.MONGO_URI || "mongodb://localhost:27017/datawill";
const client = new MongoClient(mongoUrl);

let db;
try {
  await client.connect();
  db = client.db();
  console.log("✅ Better Auth MongoDB client connected");
} catch (err) {
  console.warn("⚠️  Better Auth: Could not connect to MongoDB, auth features may be limited");
  db = null;
}

export const auth = betterAuth({
  database: db ? mongodbAdapter(db, { client }) : undefined,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5000",
  basePath: "/api/auth",
  secret: process.env.BETTER_AUTH_SECRET || process.env.JWT_SECRET,
  emailAndPassword: {
    enabled: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  trustedOrigins: [
    "http://localhost:5173",
    "http://localhost:5174",
  ],
});
