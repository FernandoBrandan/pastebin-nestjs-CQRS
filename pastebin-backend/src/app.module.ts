import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { typeOrmConfig } from './config/database.config'
import { PasteModule } from './pastes/paste.module'
import { RedisService } from './common/redis/redis.service'
import { MinioService } from './common/storage/minio.service'

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), PasteModule],
  providers: [RedisService, MinioService],
  exports: [RedisService, MinioService],
})
export class AppModule { }
