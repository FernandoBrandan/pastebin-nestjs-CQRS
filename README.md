# Sistema Pastebin con NestJS, CQRS, Redis y MinIO

## Arquitectura General

- NestJS.
- CQRS: separa comandos de consultas para mejorar mantenimiento y escalabilidad.
- PostgreSQL para almacenamiento de metadata.
- Redis como capa de caché para acelerar consultas frecuentes y reducir latencia.
- MinIO para almacenamiento distribuido y durable del contenido de los texto.

## Flujo de Datos

### Creación de Paste (Write Path)

- Cliente envía solicitud POST con contenido y parámetros.
- Se valida y sanitiza la entrada.
- Servicio KGS genera un ID único amigable (Base62).
- Contenido se almacena en MinIO (objeto con key = pasteId).
- Metadata (sin contenido) se guarda en PostgreSQL.
- Respuesta con URL única es devuelta al cliente.

### Consulta de Paste (Read Path)

- Cliente solicita GET con pasteId.
- Se busca en Redis cache.
- Si cache existe, se retorna inmediatamente.
- Si no, se consulta PostgreSQL para metadata.
- Se recupera contenido desde MinIO.
- Resultado se cachea en Redis (TTL configurable).
- Se retorna el paste completo al cliente.

### Instalaciones

- TypeORM y PostgreSQL: npm install @nestjs/typeorm typeorm pg
- CQRS: npm install @nestjs/cqrs
- Redis : npm install ioredis
- MinIO (S3 compatible): npm install minio
- Validación y transformación: npm install class-validator class-transformer
- Opcional para desarrollo: npm install -D @types/ioredis
