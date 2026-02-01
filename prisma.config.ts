import 'dotenv/config';
import { defineConfig, env } from 'prisma/config'; // Note: no "@" symbol here

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: env('DATABASE_URL'),
  },
});