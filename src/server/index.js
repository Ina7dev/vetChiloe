import express from 'express';
import pacientesRoutes from './routes/pacientes.routes.js';

const app = express();

app.use(express.json());
app.use('/api/pacientes', pacientesRoutes);

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});