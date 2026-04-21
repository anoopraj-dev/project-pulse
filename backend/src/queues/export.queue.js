import {Queue} from 'bullmq'
import { bullRedis } from '../config/redis.js';

export const exportQueue = new Queue('export-queue',{
    connection: bullRedis,
})