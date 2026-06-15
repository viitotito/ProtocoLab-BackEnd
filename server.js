import express from 'express';
import swaggerUi from 'swagger-ui-express';

import swaggerSpec from './src/config/swagger.js';

const app = express();

app.use(express.json());

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

/**
 * @swagger
 * /:
 *   get:
 *     summary: API check
 *     tags:
 *       - default
 *     responses:
 *       200:
 *         description: API is running
 */
app.get('/', (req, res) => {
  res.json({ ok: true });
});

/**
 * @swagger
 * /test:
 *   get:
 *     summary: Test endpoint
 *     tags:
 *       - test
 *     responses:
 *       200:
 *         description: Test message
 */
app.get('/test', (req, res) => {
  res.json({
    test: 'This is a test endpoint',
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(
    `Server is running on http://localhost:${PORT}`
  );
});