export class CreatePasteCommand {
    constructor(
        public readonly title: string | undefined,
        public readonly content: string,
        public readonly contentType: string,
        public readonly expiresIn: '1h' | '1d' | '1w' | '1m' | 'never',
        public readonly visibility: 'public' | 'unlisted' | 'private',
    ) { }
}
