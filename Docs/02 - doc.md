## Arquitectura del Sistema

### 1. API Gateway / Load Balancer

Tecnología ejemplo: NGINX, AWS ALB
Responsabilidades:

- Distribución de carga
- Rate limiting
- SSL termination
- Health checks

### 2. Servidor de Aplicación

Responsabilidades:

- Lógica de negocio
- Validación de datos
- Orquestación de servicios
- Manejo de sesiones

### 3. Key Generation Service (KGS)

- Distributed ID Generation

Responsabilidades:

- Generación de IDs únicos
- Encoding de IDs (Base62)
- Pool de IDs pre-generados

Problema: Generar IDs únicos sin coordinación central.
Soluciones:

- UUID: Garantía global pero muy largo
- Database Auto-increment: Simple pero no escala<>
- Twitter Snowflake: Timestamp + Machine ID + Sequence
- Base62 Encoding: URLs amigables

### 4. Cache Layer

Tecnología: Redis, Memcached
Responsabilidades:

- Solo almacenamiento temporal
- Cache de pastes populares
- Metadata cache
- Session storage

Estrategias Aplicadas:

- Cache-Aside: App gestiona cache manualmente
- Write-Through: Escribir a cache y DB simultáneamente
- TTL-based: Expiración automática de cache

### 5. Base de Datos

Tecnología: PostgreSQL, MySQL

Responsabilidades:

- Solo metadata persistente
- Metadata de pastes
- Información de usuarios
- Configuración del sistema

Notas:

- Diferentes tipos de db para diferentes necesidades
- PostgreSQL: Para metadata estructurada y transacciones ACID
- Redis: Para cache de alta velocidad y TTL automático
- S3: Para almacenamiento masivo y durabilidad
- Bloom Filter: Para verificación rápida de existencia

- Conceptos Aplicados:

- Indexing: Índices en paste_id, user_id, expires_at
- Query Optimization: SELECT específicos, evitar N+1 queries
- Connection Pooling: Reutilizar conexiones DB
- Read Replicas: Separar lectura de escritura

### 6. Object Storage

Tecnología: AWS S3, MinIO
Responsabilidades:

- Almacenamiento de contenido
- Presigned URLs
- Backup y versioning

### Fault Tolerance

Patrones Aplicados:

- Circuit Breaker: Evitar cascading failures
- Retry with Backoff: Reintentar requests fallidos
- Graceful Degradation: Funcionar con funcionalidad reducida

Ejemplo: Si S3 falla, servir desde cache; si cache falla, servir desde DB.
