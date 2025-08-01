import { Injectable, OnModuleInit } from '@nestjs/common'
import * as Minio from 'minio'

@Injectable()
export class MinioService implements OnModuleInit {
    private client: Minio.Client

    async onModuleInit() {
        this.client = new Minio.Client({
            endPoint: 'minio',
            port: 9000,
            useSSL: false,
            accessKey: 'minio',
            secretKey: 'minio123',
        })

        // Verificar que el bucket exista o crearlo
        const bucketName = 'pastes'
        const exists = await this.client.bucketExists(bucketName)
        if (!exists) {
            await this.client.makeBucket(bucketName)
            console.log(`Bucket '${bucketName}' creado`)
        }
    }

    async uploadPaste(pasteId: string, content: string): Promise<void> {
        const bucketName = 'pastes'
        const buffer = Buffer.from(content, 'utf-8')
        await this.client.putObject(bucketName, pasteId, buffer)
    }

    async getPaste(pasteId: string): Promise<string> {
        const bucketName = 'pastes'
        const stream = await this.client.getObject(bucketName, pasteId)

        return new Promise((resolve, reject) => {
            let data = ''
            stream.on('data', (chunk) => (data += chunk.toString()))
            stream.on('end', () => resolve(data))
            stream.on('error', (err) => reject(err))
        })
    }
}
