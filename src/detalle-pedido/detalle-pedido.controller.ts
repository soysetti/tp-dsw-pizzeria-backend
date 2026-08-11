import { Request, Response, NextFunction } from 'express';
import { DetallePedidoRepository } from './detalle-pedido.repository.js';
import { PizzaRepository } from '../pizza/pizza.repository.js';
import { PedidoRepository } from '../pedido/pedido.repository.js';

const repository = new DetallePedidoRepository();
const pizzaRepository = new PizzaRepository();
const pedidoRepository = new PedidoRepository();

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
    const detalles = await repository.findAll();
    return res.status(200).json({ message: 'Todos los detalles de pedido recuperados', data: detalles });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export async function findOne(req: Request, res: Response) {
  try {
    const pedidoId = Number(req.params.pedidoId);
    const pizzaId = Number(req.params.pizzaId);
    const detalle = await repository.findOne(pedidoId, pizzaId);
    if (!detalle) {
      return res.status(404).json({ message: 'Detalle de pedido no encontrado' });
    }
    return res.status(200).json({ data: detalle });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export async function findByPedido(req: Request, res: Response) {
  try {
    const pedidoId = Number(req.params.pedidoId);
    const pedido = await pedidoRepository.findOne(pedidoId);
    if (!pedido) {
      return res.status(404).json({ message: `No existe un pedido con id ${pedidoId}` });
    }
    const data = await repository.findByPedido(pedidoId);
    return res.status(200).json({ data });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export async function add(req: Request, res: Response) {
  try {
    const { cantidad, pizzaId, pedidoId } = req.body.detalleInput;

    if (cantidad === undefined || typeof cantidad !== 'number' || cantidad <= 0) {
      return res.status(400).json({ message: 'La cantidad es requerida y debe ser un número mayor a 0' });
    }
    if (pizzaId === undefined || typeof pizzaId !== 'number') {
      return res.status(400).json({ message: 'pizzaId es requerido y debe ser un número' });
    }
    if (pedidoId === undefined || typeof pedidoId !== 'number') {
      return res.status(400).json({ message: 'pedidoId es requerido y debe ser un número' });
    }

    const pizza = await pizzaRepository.findOne(pizzaId);
    if (!pizza) {
      return res.status(404).json({ message: `No existe una pizza con id ${pizzaId}` });
    }
    const pedido = await pedidoRepository.findOne(pedidoId);
    if (!pedido) {
      return res.status(404).json({ message: `No existe un pedido con id ${pedidoId}` });
    }

    const existente = await repository.findOne(pedidoId, pizzaId);
    if (existente) {
      return res.status(409).json({
        message: 'Esa pizza ya está en el pedido. Usá PUT para modificar la cantidad.',
      });
    }

    const nuevoDetalle = await repository.add({ cantidad, pizza, pedido } as any);
    return res.status(201).json({ message: 'Detalle de pedido creado con éxito', data: nuevoDetalle });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const pedidoId = Number(req.params.pedidoId);
    const pizzaId = Number(req.params.pizzaId);
    const { cantidad } = req.body.detalleInput;

    if (cantidad === undefined || typeof cantidad !== 'number' || cantidad <= 0) {
      return res.status(400).json({ message: 'La cantidad es requerida y debe ser un número mayor a 0' });
    }

    const detalle = await repository.update(pedidoId, pizzaId, { cantidad });
    if (!detalle) {
      return res.status(404).json({ message: 'Detalle de pedido no encontrado' });
    }
    return res.status(200).json({ message: 'Detalle de pedido actualizado', data: detalle });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const pedidoId = Number(req.params.pedidoId);
    const pizzaId = Number(req.params.pizzaId);
    const eliminado = await repository.delete(pedidoId, pizzaId);
    if (!eliminado) {
      return res.status(404).json({ message: 'Detalle de pedido no encontrado' });
    }
    return res.status(200).json({ message: 'Detalle de pedido eliminado exitosamente' });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}