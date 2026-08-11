import { Request, Response, NextFunction } from 'express';
import { PedidoRepository } from './pedido.repository.js';

const repository = new PedidoRepository();

export function sanitizePedidoInput(req: Request, res: Response, next: NextFunction) {
  req.body.pedidoInput = {
    dia: req.body.dia,
    total: req.body.total,
    tipoPedido: req.body.tipoPedido,
    estado: req.body.estado,
    categoria: req.body.categoria,
  };

  Object.keys(req.body.pedidoInput).forEach((key) => {
    if (req.body.pedidoInput[key] === undefined) {
      delete req.body.pedidoInput[key];
    }
  });

  next();
}

export async function findAll(req: Request, res: Response) {
  try {
    const pedidos = await repository.findAll();
    return res.status(200).json({ message: 'Todos los pedidos recuperados', data: pedidos });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export async function findOne(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const pedido = await repository.findOne(id);
    if (!pedido) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }
    return res.status(200).json({ data: pedido });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export async function add(req: Request, res: Response) {
  try {
    const { tipoPedido, categoria } = req.body.pedidoInput;

    if (!tipoPedido || !categoria) {
      return res.status(400).json({ message: 'Faltan datos: tipoPedido y categoria son requeridos' });
    }

    const nuevoPedido = await repository.add(req.body.pedidoInput);
    return res.status(201).json({ message: 'Pedido creado con éxito', data: nuevoPedido });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const pedido = await repository.update(id, req.body.pedidoInput);
    if (!pedido) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }
    return res.status(200).json({ message: 'Pedido actualizado', data: pedido });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const eliminado = await repository.delete(id);
    if (!eliminado) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }
    return res.status(200).json({ message: 'Pedido eliminado exitosamente' });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}