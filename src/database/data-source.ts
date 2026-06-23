import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';

// Esto solo actuará en local si existe un archivo .env
dotenv.config();

const isLocalhost = process.env.POSTGRES_HOST === 'localhost' || !process.env.POSTGRES_HOST;

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: false, // Es mejor dejarlo en false si usas migraciones oficiales
  logging: true,
  entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
  migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
  
  // ⚡ Configuración SSL directa y blindada para el CLI de Render
  ssl: isLocalhost ? false : { rejectUnauthorized: false },
});