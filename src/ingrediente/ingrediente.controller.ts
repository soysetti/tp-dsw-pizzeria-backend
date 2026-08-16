import { Request, Response, NextFunction } from 'express';
import * as service from './ingrediente.service.js';
import { handleError } from '../shared/handle-error.js';

export function sanitizeIngredienteInput(req: Request, res: Response, next: NextFunction) {
  req.body.ingredienteInput = {
    nombre: req.body.nombre,
    stock: req.body.stock,
  };

  Object.keys(req.body.ingredienteInput).forEach((key) => {
    if (req.body.ingredienteInput[key] === undefined) {
      delete req.body.ingredienteInput[key];
    }
  });

  next();
}

export async function findAll(req: Request, res: Response) {
  try {
    const ingredientes = await service.listarIngredientes();
    return res.status(200).json({ message: 'Todos los ingredientes recuperados', data: ingredientes });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function findOne(req: Request, res: Response) {
  try {
    const ingrediente = await service.buscarIngrediente(Number(req.params.id));
    return res.status(200).json({ data: ingrediente });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function add(req: Request, res: Response) {
  try {
    const nuevoIngrediente = await service.crearIngrediente(req.body.ingredienteInput);
    return res.status(201).json({ message: 'Ingrediente creado con éxito', data: nuevoIngrediente });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function update(req: Request, res: Response) {
  try {
    const ingrediente = await service.actualizarIngrediente(Number(req.params.id), req.body.ingredienteInput);
    return res.status(200).json({ message: 'Ingrediente actualizado', data: ingrediente });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function remove(req: Request, res: Response) {
  try {
    await service.eliminarIngrediente(Number(req.params.id));
    return res.status(200).json({ message: 'Ingrediente eliminado exitosamente' });
  } catch (error) {
    return handleError(res, error);
  }
}