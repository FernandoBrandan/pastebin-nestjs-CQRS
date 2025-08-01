```bash
curl -X POST http://localhost:3000/api/v1/pastes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Mi primer paste",
    "content": "console.log(\"Hola mundo\");",
    "contentType": "text/javascript",
    "expiresIn": "1d",
    "visibility": "public"
  }'
```

```json
{
  "pasteId": "06GhGRs",
  "url": "http://localhost:3000/api/v1/pastes/06GhGRs",
  "expiresAt": "2025-07-26T06:23:32.161Z"
}
```

```bash
curl http://localhost:3000/api/v1/pastes/06GhGRs
```

```json
{
  "id": 1,
  "pasteId": "06GhGRs",
  "title": "Mi primer paste",
  "content": "console.log(\"Hola mundo\");",
  "contentType": "text/javascript",
  "expiresAt": "2025-07-26T06:23:32.161Z",
  "visibility": "public",
  "createdAt": "2025-07-25T09:23:32.180Z",
  "updatedAt": "2025-07-25T09:23:32.180Z"
}
```
