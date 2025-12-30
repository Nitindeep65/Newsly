import { db } from './src/lib/db.ts';

async function main() {
  const subs = await db.subscriber.findMany({
    take: 5,
    select: {
      email: true,
      topicAiTools: true,
      topicStockMarket: true,
      topicCrypto: true,
      topicStartups: true,
      topicMutualFunds: true,
    }
  });
  console.log(JSON.stringify(subs, null, 2));
  process.exit(0);
}
main();
