import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { GetPasteQuery } from '../impl/get-paste.query'
import { Paste } from '../../entities/paste.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { RedisService } from '../../../common/redis/redis.service'

const CACHE_TTL_SECONDS = 300 // 5 minutos

// Se busca primero en Redis
// Si existe, devuelve cache rápido
// Si no, consulta a PostgreSQL y cachea 5 minutos

// Importar MinioService
import { MinioService } from '../../../common/storage/minio.service'

@QueryHandler(GetPasteQuery)
export class GetPasteHandler implements IQueryHandler<GetPasteQuery> {
    constructor(
        @InjectRepository(Paste)
        private readonly pasteRepo: Repository<Paste>,
        private readonly redisService: RedisService,
        private readonly minioService: MinioService, // MinioService
    ) { }

    async execute(query: GetPasteQuery): Promise<Paste | null> {
        const cacheKey = `paste:${query.pasteId}`
        const cached = await this.redisService.get(cacheKey)
        if (cached) return JSON.parse(cached) as Paste

        // Si no está en cache, buscamos en DB
        const paste = await this.pasteRepo.findOneBy({ pasteId: query.pasteId })
        if (!paste) return null

        // Obtener contenido desde MinIO
        const content = await this.minioService.getPaste(paste.pasteId)
        paste.content = content

        if (paste) await this.redisService.set(cacheKey, JSON.stringify(paste), CACHE_TTL_SECONDS)
        return paste
    }
}


// Sin Redis !!!!!!!!!!!!!!!!!!!!!!
// import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
// import { GetPasteQuery } from '../impl/get-paste.query'
// import { Paste } from '../../entities/paste.entity'
// import { Repository } from 'typeorm'
// import { InjectRepository } from '@nestjs/typeorm'

// @QueryHandler(GetPasteQuery)
// export class GetPasteHandler implements IQueryHandler<GetPasteQuery> {
//     constructor(
//         @InjectRepository(Paste)
//         private readonly pasteRepo: Repository<Paste>,
//     ) { }

//     async execute(query: GetPasteQuery): Promise<Paste | null> {
//         return this.pasteRepo.findOneBy({ pasteId: query.pasteId })
//     }
// }
