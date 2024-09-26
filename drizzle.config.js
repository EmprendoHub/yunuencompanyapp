import { defineConfig } from "drizzle-kit";
export default defineConfig({
  schema: "./utils/schema.tsx",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://ofertazosdb_owner:gaDZAqFp1dM3@ep-proud-feather-a6vcump4.us-west-2.aws.neon.tech/ofertazosdb?sslmode=require",
  },
  verbose: true,
  strict: true,
});
