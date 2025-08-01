import { TypeOrmModuleOptions } from '@nestjs/typeorm'

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'postgres',
  port: 5432,
  username: 'pastebin',
  password: 'secret',
  database: 'pastebin_db',
  autoLoadEntities: true,
  synchronize: true, // ⚠️ desactivar en producción
}
