import express from 'express';
import pacientesRoutes from './routes/pacientes.routes.js';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hola mundo');
});

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/pacientes', pacientesRoutes);

export default app;