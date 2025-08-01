import { Injectable } from '@nestjs/common'

// Simple ejemplo de generación Base62 con timestamp + random
const BASE62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

@Injectable()
export class KgsService {
    private encodeBase62(num: number): string {
        let s = ''
        while (num > 0) {
            s = BASE62[num % 62] + s
            num = Math.floor(num / 62)
        }
        return s.padStart(7, '0')
    }

    async generatePasteId(): Promise<string> {
        // Usa timestamp y un número aleatorio para evitar colisiones
        const timestamp = Date.now()
        const random = Math.floor(Math.random() * 9999)
        const num = Number(`${timestamp}${random}`.slice(-10))
        return this.encodeBase62(num)
    }
} 