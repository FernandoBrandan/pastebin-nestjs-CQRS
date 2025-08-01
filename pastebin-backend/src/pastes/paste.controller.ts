import { Controller, Post, Get, Param, Body, UsePipes, ValidationPipe, NotFoundException } from '@nestjs/common'
import { PasteService } from '../services/paste.service'
import { CreatePasteDto } from '../dtos/create-paste.dto'

@Controller('api/v1/pastes')
export class PasteController {
    constructor(private readonly pasteService: PasteService) { }

    @Post()
    @UsePipes(new ValidationPipe({ whitelist: true }))
    async create(@Body() dto: CreatePasteDto) {
        const paste = await this.pasteService.createPaste(dto)
        return {
            pasteId: paste.pasteId,
            url: `http://localhost:3000/api/v1/pastes/${paste.pasteId}`,
            expiresAt: paste.expiresAt,
        }
    }

    @Get(':id')
    async get(@Param('id') id: string) {
        const paste = await this.pasteService.getPaste(id)
        if (!paste) {
            throw new NotFoundException('Paste not found')
        }
        return paste
    }
}
