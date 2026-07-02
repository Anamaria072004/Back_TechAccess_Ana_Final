import { registerAs } from "@nestjs/config"; 

export default registerAs('config', () => {
    return {
        dataBase: {
            name: process.env.DB_NAME, // Cambiado de POSTGRES_DB
            port: parseInt(process.env.DB_PORT || '5432', 10), // Cambiado
            user: process.env.DB_USER, // Cambiado
            password: process.env.DB_PASSWORD, // Cambiado
            host: process.env.DB_HOST, // Cambiado
            ssl: process.env.DB_HOST === 'localhost' ? false : { rejectUnauthorized: false },
        },
        jwt: {
            secret: process.env.JWT_SECRET,
            expiresIn: parseInt(process.env.JWT_EXPIRES_IN ?? '3600', 10),
        },
        email: {
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT || '587', 10),
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    }
});