import Redis from 'ioredis';
import IORedis from 'ioredis'

const redis = new Redis({
    host:'127.0.0.1',
    port: 6379
})

redis.on('connect', () => {
    console.log('Redis connected')
})

redis.on('error',(err)=> {
    console.error('Redis error',err)
})

export default redis;

export const bullRedis = new IORedis({
    host:'127.0.0.1',
    port:6379,
    maxRetriesPerRequest:null,
})