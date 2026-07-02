import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';

// Esto solo actuará en local si existe un archivo .env
dotenv.config();

// ⚠️ Usar las variables que tenemos en Render (DB_HOST, DB_USER, etc.)
const isLocalhost = process.env.DB_HOST === 'localhost' || !process.env.DB_HOST;

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,  // ← Cambiado de POSTGRES_HOST a DB_HOST
  port: parseInt(process.env.DB_PORT || '5432', 10),  // ← Cambiado
  username: process.env.DB_USER,  // ← Cambiado
  password: process.env.DB_PASSWORD,  // ← Cambiado
  database: process.env.DB_NAME,  // ← Cambiado
  synchronize: false,
  logging: true,
  entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
  migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
  
  // ⚡ Configuración SSL
  ssl: isLocalhost ? false : { rejectUnauthorized: false },
});

// ✅ Verificar que las variables se están cargando
console.log('📦 Configuración de base de datos:');
console.log(`   Host: ${process.env.DB_HOST || 'NO DEFINIDO'}`);
console.log(`   Base de datos: ${process.env.DB_NAME || 'NO DEFINIDO'}`);
console.log(`   Usuario: ${process.env.DB_USER || 'NO DEFINIDO'}`);
console.log(`   SSL: ${isLocalhost ? 'Desactivado' : 'Activado'}`);