import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import Redis from 'ioredis'

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private client: Redis

    async onModuleInit() {
        this.client = new Redis({ host: 'redis', port: 6379, })
        this.client.on('connect', () => console.log('Redis connected'))
        this.client.on('error', (err) => console.error('Redis error', err))
    }

    async onModuleDestroy() { await this.client.quit() }

    getClient(): Redis { return this.client }

    async get(key: string): Promise<string | null> { return this.client.get(key) }

    async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
        if (ttlSeconds) await this.client.set(key, value, 'EX', ttlSeconds)
        else await this.client.set(key, value)
    }
}
