import { Request, Response, NextFunction } from 'express';
import * as service from './detalle-pedido.service.js';
import { handleError } from '../shared/handle-error.js';

export function sanitizeDetallePedidoInput(req: Request, res: Response, next: NextFunction) {
  req.body.detalleInput = {
    cantidad: req.body.cantidad,
    pizzaId: req.body.pizzaId,
    pedidoId: req.body.pedidoId,
  };

  Object.keys(req.body.detalleInput).forEach((key) => {
    if (req.body.detalleInput[key] === undefined) {
      delete req.body.detalleInput[key];
    }
  });

  next();
}

export async function findAll(req: Request, res: Response) {
  try {
    const detalles = await service.listarDetalles();
    return res.status(200).json({ message: 'Todos los detalles de pedido recuperados', data: detalles });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function findOne(req: Request, res: Response) {
  try {
    const detalle = await service.buscarDetalle(Number(req.params.pedidoId), Number(req.params.pizzaId));
    return res.status(200).json({ data: detalle });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function findByPedido(req: Request, res: Response) {
  try {
    const data = await service.listarPorPedido(Number(req.params.pedidoId));
    return res.status(200).json({ data });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function add(req: Request, res: Response) {
  try {
    const { detalle, pedido } = await service.crearDetalle(req.body.detalleInput);
    return res.status(201).json({
      message: 'Detalle de pedido creado con éxito',
      data: detalle,
      pedido,
    });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function update(req: Request, res: Response) {
  try {
    const pedidoId = Number(req.params.pedidoId);
    const pizzaId = Number(req.params.pizzaId);
    const { detalle, pedido } = await service.actualizarDetalle(pedidoId, pizzaId, req.body.detalleInput.cantidad);
    return res.status(200).json({
      message: 'Detalle de pedido actualizado',
      data: detalle,
      pedido,
    });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const pedidoId = Number(req.params.pedidoId);
    const pizzaId = Number(req.params.pizzaId);
    const pedidoActualizado = await service.eliminarDetalle(pedidoId, pizzaId);
    return res.status(200).json({
      message: 'Detalle de pedido eliminado exitosamente',
      pedido: pedidoActualizado,
    });
  } catch (error) {
    return handleError(res, error);
  }
}