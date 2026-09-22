import { Router } from 'express';
import { sanitizePedidoInput, findAll, findOne, add, update, remove } from './pedido.controller.js';
import { requiereNivel } from '../auth/auth.middleware.js';

export const pedidoRouter = Router();

pedidoRouter.get('/', findAll);
pedidoRouter.get('/:id', findOne);
pedidoRouter.post('/', sanitizePedidoInput, add);
pedidoRouter.put('/:id', requiereNivel(1), sanitizePedidoInput, update);
pedidoRouter.delete('/:id', requiereNivel(1), remove);