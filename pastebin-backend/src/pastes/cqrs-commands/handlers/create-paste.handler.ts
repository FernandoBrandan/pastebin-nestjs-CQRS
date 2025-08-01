import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { CreatePasteCommand } from '../impl/create-paste.command'
import { Paste } from '../../entities/paste.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { KgsService } from '../../../common/kgs/kgs.service'

// Importar MinioService
import { MinioService } from '../../../common/storage/minio.service'

@CommandHandler(CreatePasteCommand)
export class CreatePasteHandler implements ICommandHandler<CreatePasteCommand> {
    constructor(
        @InjectRepository(Paste)
        private readonly pasteRepo: Repository<Paste>,
        private readonly kgsService: KgsService,
        private readonly minioService: MinioService, // MinioService
    ) { }

    async execute(command: CreatePasteCommand): Promise<Paste> {
        const { title, content, contentType, expiresIn, visibility } = command

        // Generar pasteId usando KGS (pool pre-generado)
        const pasteId = await this.kgsService.generatePasteId()

        // Calcular expiresAt
        let expiresAt: Date | undefined = undefined
        if (expiresIn !== 'never') {
            const now = new Date()
            switch (expiresIn) {
                case '1h':
                    expiresAt = new Date(now.getTime() + 3600 * 1000)
                    break
                case '1d':
                    expiresAt = new Date(now.getTime() + 24 * 3600 * 1000)
                    break
                case '1w':
                    expiresAt = new Date(now.getTime() + 7 * 24 * 3600 * 1000)
                    break
                case '1m':
                    expiresAt = new Date(now.setMonth(now.getMonth() + 1))
                    break
            }
        }

        // Guardar el contenido en MinIO
        await this.minioService.uploadPaste(pasteId, content)

        const paste = this.pasteRepo.create({
            pasteId,
            title,
            // content,  // guarda contenido en DB
            content: '', // No guardamos contenido en DB
            contentType,
            expiresAt,
            visibility,
        })

        await this.pasteRepo.save(paste)

        return paste
    }
}
