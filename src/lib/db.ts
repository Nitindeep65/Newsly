import { PrismaClient } from '@prisma/client';
import { Pool } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

function createPrismaClient() {
  // Check if we're in edge runtime (Vercel Edge Functions)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isEdgeRuntime = typeof (globalThis as Record<string, unknown>).EdgeRuntime !== 'undefined';

  if (isEdgeRuntime) {
    // Use Neon adapter for edge runtime
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    
    const pool = new Pool({ connectionString });
    const adapter = new PrismaNeon(pool);
    
    return new PrismaClient({ adapter });
  } else {
    // Standard Prisma client for Node.js runtime
    return new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
  }
}

export const db = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}
