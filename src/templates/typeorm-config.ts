import type { ProjectOptions } from '../types';

export function generateTypeORMConfig(options: ProjectOptions): string {
  const { database, language } = options;

  const extension = language === 'ts' ? 'ts' : 'js';

  return `import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: '${database}',
  ${database === 'sqlite' ? `database: process.env.DATABASE_URL || './sqlite.db',` : `url: process.env.DATABASE_URL,`}
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development',
  entities: ['src/entities/**/*.${extension}'],
  migrations: ['src/migrations/**/*.${extension}'],
  subscribers: ['src/subscribers/**/*.${extension}'],
});
`;
}

export function generateTypeORMEntity(options: ProjectOptions): string {
  return `import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
`;
}
