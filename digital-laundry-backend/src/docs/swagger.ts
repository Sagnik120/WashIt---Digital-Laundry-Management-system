// src/docs/swagger.ts
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import fs from 'fs';
import path from 'path';

export function setupSwagger(app: Express) {
  const specPath = path.join(process.cwd(), 'src', 'docs', 'openapi.json');
  let spec: any = {};
  try {
    spec = JSON.parse(fs.readFileSync(specPath, 'utf-8'));
  } catch (e) {
    console.error('Failed to load OpenAPI spec at', specPath, e);
    spec = { openapi: '3.0.0', info: { title: 'Laundry API', version: '1.0.0' }, paths: {} };
  }
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(spec));
}
