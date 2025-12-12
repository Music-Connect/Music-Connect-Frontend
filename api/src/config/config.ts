import dotenv from "dotenv";

dotenv.config();

const PG_HOST = process.env.PG_HOST || "localhost";
const PG_DATABASE = process.env.PG_DATABASE || "music_connect";
const PG_USER = process.env.PG_USER || "root";
const PG_PASSWORD = process.env.PG_PASSWORD || "";
const PG_PORT = process.env.PG_PORT || "5000";

const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || "localhost";
const SERVER_PORT = process.env.SERVER_PORT || "3000";

const POSTGRESQL = {
  host: PG_HOST,
  database: PG_DATABASE,
  user: PG_USER,
  password: PG_PASSWORD,
  port: PG_PORT,
};

const SERVER = {
  hostname: SERVER_HOSTNAME,
  port: SERVER_PORT,
};

const config = {
  database: POSTGRESQL,
  server: SERVER,
};

export default config;
