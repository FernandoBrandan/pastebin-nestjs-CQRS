# Sistema Pastebin

## Resumen del Producto

Este sistema permite a los usuarios subir texto y recibir una URL única para compartir ese contenido.

## Requerimientos Funcionales

### RF-001: Creación de Paste

- **Descripción**: El sistema debe permitir a los usuarios subir contenido de texto
- **Entrada**: Texto plano (máximo 1MB por paste)
- **Salida**: URL única para acceder al contenido
- **Validaciones**:
  - Contenido no vacío
  - Tamaño máximo del archivo
  - Sanitización de contenido malicioso

### RF-002: Recuperación de Paste

- **Descripción**: Los usuarios deben poder acceder al contenido usando la URL única
- **Entrada**: Paste ID válido
- **Salida**: Contenido original del paste
- **Manejo de errores**: Paste no encontrado, paste expirado

### RF-003: Gestión de Usuarios (Opcional)

- **Descripción**: Registro y autenticación de usuarios
- **Funcionalidades**:
  - Registro con email/contraseña
  - Login/logout
  - Historial de pastes del usuario
  - Configuración de privacidad

### RF-004: Configuración de Paste

- **Descripción**: Opciones adicionales para cada paste
- **Parámetros**:
  - Fecha de expiración (1 hora, 1 día, 1 semana, 1 mes, nunca)
  - Visibilidad (público, no listado, privado)
  - Tipo de contenido (texto plano, código con syntax highlighting)

## Requerimientos No Funcionales

### RNF-001: Rendimiento

- **Latencia**: < 100ms para lectura de pastes
- **Throughput**: 1000 lecturas/segundo, 100 escrituras/segundo
- **Tiempo de respuesta**: < 200ms para creación de pastes

### RNF-002: Disponibilidad

- **Uptime**: 99.9% (8.76 horas de downtime por año)
- **Recuperación**: RTO < 4 horas, RPO < 1 hora

### RNF-003: Escalabilidad

- **Crecimiento**: Soportar 10x de tráfico actual
- **Almacenamiento**: 100GB de pastes por mes
- **Usuarios concurrentes**: 10,000 usuarios simultáneos

### RNF-004: Seguridad

- **Rate limiting**: 10 pastes/hora por IP no autenticada
- **Validación**: Sanitización de input, protección XSS
- **Encriptación**: HTTPS obligatorio, datos sensibles encriptados
