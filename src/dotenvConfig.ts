import dotenv from "dotenv";

if (process.env.NODE_ENV === "production")
  dotenv.config({ path: process.env.API_ENV_PATH });
else dotenv.config();
