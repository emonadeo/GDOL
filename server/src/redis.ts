import { Client } from 'redis-om';

export const redis = new Client();

await redis.open(process.env['REDIS_URL']);
