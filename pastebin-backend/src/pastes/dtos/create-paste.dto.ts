import { IsNotEmpty, IsOptional, MaxLength, IsIn, IsEnum } from 'class-validator'

export class CreatePasteDto {
    @IsOptional()
    @MaxLength(255)
    title?: string

    @IsNotEmpty()
    @MaxLength(1_000_000) // 1MB aprox
    content: string

    @IsOptional()
    @IsIn(['text/plain', 'application/json', 'text/javascript'])
    contentType?: string = 'text/plain';

    @IsOptional()
    @IsEnum(['1h', '1d', '1w', '1m', 'never'])
    expiresIn?: '1h' | '1d' | '1w' | '1m' | 'never' = 'never';

    @IsOptional()
    @IsEnum(['public', 'unlisted', 'private'])
    visibility?: 'public' | 'unlisted' | 'private' = 'public';
}
