import { Injectable } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { CreatePasteDto } from '../dtos/create-paste.dto'
import { CreatePasteCommand } from '../commands/impl/create-paste.command'
import { GetPasteQuery } from '../queries/impl/get-paste.query'
import { Paste } from '../entities/paste.entity'

@Injectable()
export class PasteService {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) { }

    createPaste(dto: CreatePasteDto): Promise<Paste> {
        return this.commandBus.execute(
            new CreatePasteCommand(
                dto.title,
                dto.content,
                dto.contentType,
                dto.expiresIn,
                dto.visibility,
            ),
        )
    }

    getPaste(pasteId: string): Promise<Paste> {
        return this.queryBus.execute(new GetPasteQuery(pasteId))
    }
}
