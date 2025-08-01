import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm'

@Entity('pastes')
export class Paste {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true, length: 10 })
    @Index()
    pasteId: string

    @Column({ nullable: true, length: 255 })
    title?: string

    @Column('text')
    content: string

    @Column({ default: 'text/plain' })
    contentType: string

    @Column({ nullable: true, type: 'timestamp with time zone' })
    expiresAt?: Date

    @Column({ default: 'public' })
    visibility: 'public' | 'unlisted' | 'private'

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}
