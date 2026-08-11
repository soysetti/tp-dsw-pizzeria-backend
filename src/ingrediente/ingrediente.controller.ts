import { Request, Response, NextFunction } from 'express';
import { IngredienteRepository } from './ingrediente.repository.js';

const repository = new IngredienteRepository();

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
    const ingredientes = await repository.findAll();
    return res.status(200).json({ message: 'Todos los ingredientes recuperados', data: ingredientes });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export async function findOne(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const ingrediente = await repository.findOne(id);
    if (!ingrediente) {
      return res.status(404).json({ message: 'Ingrediente no encontrado' });
    }
    return res.status(200).json({ data: ingrediente });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export async function add(req: Request, res: Response) {
  try {
    const { nombre, stock } = req.body.ingredienteInput;

    if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
      return res.status(400).json({ message: 'El nombre es requerido y debe ser un texto válido' });
    }
    if (stock === undefined || typeof stock !== 'number' || stock < 0) {
      return res.status(400).json({ message: 'El stock es requerido y debe ser un número mayor o igual a 0' });
    }

    const nuevoIngrediente = await repository.add(req.body.ingredienteInput);
    return res.status(201).json({ message: 'Ingrediente creado con éxito', data: nuevoIngrediente });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const { nombre, stock } = req.body.ingredienteInput;

    if (Object.keys(req.body.ingredienteInput).length === 0) {
      return res.status(400).json({ message: 'Debe enviar al menos un campo para actualizar' });
    }
    if (nombre !== undefined && (typeof nombre !== 'string' || nombre.trim() === '')) {
      return res.status(400).json({ message: 'El nombre debe ser un texto válido' });
    }
    if (stock !== undefined && (typeof stock !== 'number' || stock < 0)) {
      return res.status(400).json({ message: 'El stock debe ser un número mayor o igual a 0' });
    }

    const ingrediente = await repository.update(id, req.body.ingredienteInput);
    if (!ingrediente) {
      return res.status(404).json({ message: 'Ingrediente no encontrado' });
    }
    return res.status(200).json({ message: 'Ingrediente actualizado', data: ingrediente });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const eliminado = await repository.delete(id);
    if (!eliminado) {
      return res.status(404).json({ message: 'Ingrediente no encontrado' });
    }
    return res.status(200).json({ message: 'Ingrediente eliminado exitosamente' });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}