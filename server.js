import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './src/config/swagger.js';

dotenv.config();
const app = express();

app.set('trust proxy', 1);

app.use(express.json());

app.use(cookieParser());

const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

app.get('/', (req, res) => {
  res.json({
    status: 'Server online'
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'ok'
  });
});

const PORT = process.env.PORT || 3000;

const externalUrl = process.env.EXTERNAL_URL;

const server = app.listen(PORT, () => {
const baseUrl = externalUrl || `http://localhost:${PORT}`;
  console.log(`Server rodando em ${baseUrl}`);
});