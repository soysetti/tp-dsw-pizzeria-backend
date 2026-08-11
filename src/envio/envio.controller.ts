import { Request, Response, NextFunction } from 'express';
import { EnvioRepository } from './envio.repository.js';
import { orm } from '../shared/db/orm.js';
import { Pedido } from '../pedido/pedido.entity.js';

const repository = new EnvioRepository();

export function sanitizeEnvioInput(req: Request, res: Response, next: NextFunction) {
  req.body.envioInput = {
    costo: req.body.costo,
    monto_propina: req.body.monto_propina,
    pedido: req.body.pedidoId,
  };

  Object.keys(req.body.envioInput).forEach((key) => {
    if (req.body.envioInput[key] === undefined) {
      delete req.body.envioInput[key];
    }
  });

  next();
}

export async function findAll(req: Request, res: Response) {
  try {
    const envios = await repository.findAll();
    return res.status(200).json({ message: 'Todos los envíos recuperados', data: envios });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export async function findOne(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const envio = await repository.findOne(id);
    if (!envio) {
      return res.status(404).json({ message: 'Envío no encontrado' });
    }
    return res.status(200).json({ data: envio });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export async function add(req: Request, res: Response) {
  try {
    const { costo, monto_propina, pedido } = req.body.envioInput;

    if (costo === undefined || typeof costo !== 'number' || costo < 0) {
      return res.status(400).json({ message: 'El costo es requerido y debe ser un número mayor o igual a 0' });
    }
    if (monto_propina === undefined || typeof monto_propina !== 'number' || monto_propina < 0) {
      return res.status(400).json({ message: 'El monto de propina es requerido y debe ser un número mayor o igual a 0' });
    }
    if (pedido === undefined || typeof pedido !== 'number') {
      return res.status(400).json({ message: 'El pedidoId es requerido y debe ser un número' });
    }

    const pedidoEncontrado = await orm.em.findOne(Pedido, { id: pedido });
    if (!pedidoEncontrado) {
      return res.status(404).json({ message: 'El pedido indicado no existe' });
    }

    const nuevoEnvio = await repository.add({ ...req.body.envioInput, pedido: pedidoEncontrado });
    return res.status(201).json({ message: 'Envío creado con éxito', data: nuevoEnvio });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const { costo, monto_propina, pedido } = req.body.envioInput;

    if (Object.keys(req.body.envioInput).length === 0) {
      return res.status(400).json({ message: 'Debe enviar al menos un campo para actualizar' });
    }
    if (costo !== undefined && (typeof costo !== 'number' || costo < 0)) {
      return res.status(400).json({ message: 'El costo debe ser un número mayor o igual a 0' });
    }
    if (monto_propina !== undefined && (typeof monto_propina !== 'number' || monto_propina < 0)) {
      return res.status(400).json({ message: 'El monto de propina debe ser un número mayor o igual a 0' });
    }

    let inputFinal: any = { ...req.body.envioInput };
    if (pedido !== undefined) {
      const pedidoEncontrado = await orm.em.findOne(Pedido, { id: pedido });
      if (!pedidoEncontrado) {
        return res.status(404).json({ message: 'El pedido indicado no existe' });
      }
      inputFinal.pedido = pedidoEncontrado;
    }

    const envio = await repository.update(id, inputFinal);
    if (!envio) {
      return res.status(404).json({ message: 'Envío no encontrado' });
    }
    return res.status(200).json({ message: 'Envío actualizado', data: envio });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const eliminado = await repository.delete(id);
    if (!eliminado) {
      return res.status(404).json({ message: 'Envío no encontrado' });
    }
    return res.status(200).json({ message: 'Envío eliminado exitosamente' });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}