import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CqrsModule } from '@nestjs/cqrs'
import { Paste } from './entities/paste.entity'
import { PasteService } from './paste.service'
import { PasteController } from './paste.controller'
import { CreatePasteHandler } from './cqrs-commands/handlers/create-paste.handler'
import { GetPasteHandler } from './cqrs-queries/handlers/get-paste.handler'
import { KgsService } from '../common/kgs/kgs.service'
import { RedisService } from '../common/redis/redis.service'
import { MinioModule } from '../common/storage/minio.module'

const CommandHandlers = [CreatePasteHandler]
const QueryHandlers = [GetPasteHandler]

@Module({
    imports: [TypeOrmModule.forFeature([Paste]), CqrsModule, MinioModule],
    controllers: [PasteController],
    providers: [PasteService, KgsService, RedisService, ...CommandHandlers, ...QueryHandlers],
    exports: [],
})
export class PasteModule { }
