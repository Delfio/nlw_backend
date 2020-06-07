import { Router } from 'express';
import PointsController from './controllers/PointsController';
import ItensController from './controllers/ItensController';
const rotas = Router();

rotas.get('/itens', ItensController.index);

rotas.get('/points', PointsController.index);
rotas.post('/points', PointsController.create);
rotas.get('/points/:id', PointsController.show);

export default rotas;