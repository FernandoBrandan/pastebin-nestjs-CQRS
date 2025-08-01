## Esquema de Base de Datos

### Tabla: users

```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabla: pastes

```sql
CREATE TABLE pastes (
    id BIGSERIAL PRIMARY KEY,
    paste_id VARCHAR(10) UNIQUE NOT NULL,
    user_id BIGINT REFERENCES users(id),
    title VARCHAR(255),
    content_type VARCHAR(50) DEFAULT 'text/plain',
    storage_url VARCHAR(500) NOT NULL,
    expires_at TIMESTAMP,
    visibility ENUM('public', 'unlisted', 'private') DEFAULT 'public',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_paste_id (paste_id),
    INDEX idx_user_id (user_id),
    INDEX idx_expires_at (expires_at)
);
```

### Tabla: paste_analytics

```sql
CREATE TABLE paste_analytics (
    id BIGSERIAL PRIMARY KEY,
    paste_id VARCHAR(10) REFERENCES pastes(paste_id),
    ip_address INET,
    user_agent TEXT,
    accessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_paste_id (paste_id),
    INDEX idx_accessed_at (accessed_at)
);
```

## APIs Requeridas

### POST /api/v1/pastes

```json
Request:
{
  "content": "string",
  "title": "string (optional)",
  "expires_in": "1h|1d|1w|1m|never",
  "visibility": "public|unlisted|private",
  "content_type": "text/plain|application/json|text/javascript"
}

Response:
{
  "paste_id": "abc123def4",
  "url": "https://pastebin.com/abc123def4",
  "expires_at": "2025-07-19T10:00:00Z"
}
```

### GET /api/v1/pastes/:id

```json
Response:
{
  "paste_id": "abc123def4",
  "title": "Mi código",
  "content": "console.log('hello world');",
  "content_type": "text/javascript",
  "created_at": "2025-07-18T10:00:00Z",
  "expires_at": "2025-07-19T10:00:00Z",
  "visibility": "public"
}
```

### GET /api/v1/users/:id/pastes

```json
Response:
{
  "pastes": [
    {
      "paste_id": "abc123def4",
      "title": "Mi código",
      "created_at": "2025-07-18T10:00:00Z",
      "expires_at": "2025-07-19T10:00:00Z",
      "visibility": "public"
    }
  ],
  "total": 1,
  "page": 1,
  "per_page": 20
}
```

## Flujo de Datos

### Write Path (Creación de Paste)

1. Cliente envía POST /api/v1/pastes
2. Rate limiting validation
3. Input validation y sanitización
4. Generar paste_id único (KGS)
5. Obtener presigned URL de S3
6. Guardar metadata en PostgreSQL
7. Cliente sube contenido directamente a S3
8. Confirmar creación y retornar paste_id

### Read Path (Lectura de Paste)

1. Cliente solicita GET /api/v1/pastes/:id
2. Verificar en Bloom Filter si existe
3. Buscar en cache (Redis)
4. Si no está en cache, consultar metadata en PostgreSQL
5. Obtener contenido desde S3
6. Cachear resultado
7. Retornar contenido al cliente

## Consideraciones de Implementación

### Generación de IDs

- Usar Base62 encoding (a-z, A-Z, 0-9) para URLs amigables
- Pre-generar pool de IDs para mejor performance
- Longitud de ID: 7 caracteres (62^7 = 3.5 trillion combinaciones)

### Caching Strategy

- Cache pastes populares por 1 hora
- Cache metadata por 5 minutos
- Implementar cache warming para contenido trending

### Rate Limiting

- Por IP: 10 pastes/hora para usuarios no autenticados
- Por usuario: 100 pastes/hora para usuarios autenticados
- Implementar sliding window algorithm

### Monitoreo y Métricas

- Latencia P50, P95, P99
- Error rate por endpoint
- Throughput por minuto
- Utilización de storage
- Cache hit rate

## Fases de Desarrollo

### Fase 1: MVP (2 semanas)

- API básica para crear/leer pastes
- Base de datos PostgreSQL
- Almacenamiento en S3
- Rate limiting básico

### Fase 2: Optimización (1 semana)

- Implementar cache con Redis
- Bloom filter para verificación rápida
- Mejorar generación de IDs

### Fase 3: Funcionalidades Avanzadas (2 semanas)

- Sistema de usuarios
- Historial de pastes
- Configuración de expiración
- Analytics básicos
