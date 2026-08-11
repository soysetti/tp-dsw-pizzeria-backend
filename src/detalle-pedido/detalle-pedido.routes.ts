import { Router } from 'express';
import {
  sanitizeDetallePedidoInput,
  findAll,
  findOne,
  add,
  update,
  remove,
} from './detalle-pedido.controller.js';

export const detallePedidoRouter = Router();

detallePedidoRouter.get('/', findAll);
detallePedidoRouter.get('/:id', findOne);
detallePedidoRouter.post('/', sanitizeDetallePedidoInput, add);
detallePedidoRouter.put('/:id', sanitizeDetallePedidoInput, update);
detallePedidoRouter.delete('/:id', remove);