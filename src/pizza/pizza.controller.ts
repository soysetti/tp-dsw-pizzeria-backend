import { Request, Response, NextFunction } from 'express';
import { PizzaRepository } from './pizza.repository.js';

const repository = new PizzaRepository();

export function sanitizePizzaInput(req: Request, res: Response, next: NextFunction) {
  req.body.pizzaInput = {
    nombre: req.body.nombre,
    precio: req.body.precio,
    vegetariana: req.body.vegetariana,
    disponible: req.body.disponible,
  };

  Object.keys(req.body.pizzaInput).forEach((key) => {
    if (req.body.pizzaInput[key] === undefined) {
      delete req.body.pizzaInput[key];
    }
  });

  next();
}

export async function findAll(req: Request, res: Response) {
  try {
    const pizzas = await repository.findAll();
    return res.status(200).json({ message: 'Todas las pizzas recuperadas', data: pizzas });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export async function findOne(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const pizza = await repository.findOne(id);
    if (!pizza) {
      return res.status(404).json({ message: 'Pizza no encontrada' });
    }
    return res.status(200).json({ data: pizza });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export async function add(req: Request, res: Response) {
  try {
    const { nombre, precio, vegetariana, disponible } = req.body.pizzaInput;

    if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
      return res.status(400).json({ message: 'El nombre es requerido y debe ser un texto válido' });
    }
    if (precio === undefined || typeof precio !== 'number' || precio < 0) {
      return res.status(400).json({ message: 'El precio es requerido y debe ser un número mayor o igual a 0' });
    }
    if (vegetariana === undefined || typeof vegetariana !== 'boolean') {
      return res.status(400).json({ message: 'El campo vegetariana es requerido y debe ser booleano' });
    }
    if (disponible === undefined || typeof disponible !== 'boolean') {
      return res.status(400).json({ message: 'El campo disponible es requerido y debe ser booleano' });
    }

    const nuevaPizza = await repository.add(req.body.pizzaInput);
    return res.status(201).json({ message: 'Pizza creada con éxito', data: nuevaPizza });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const { nombre, precio, vegetariana, disponible } = req.body.pizzaInput;

    if (Object.keys(req.body.pizzaInput).length === 0) {
      return res.status(400).json({ message: 'Debe enviar al menos un campo para actualizar' });
    }
    if (nombre !== undefined && (typeof nombre !== 'string' || nombre.trim() === '')) {
      return res.status(400).json({ message: 'El nombre debe ser un texto válido' });
    }
    if (precio !== undefined && (typeof precio !== 'number' || precio < 0)) {
      return res.status(400).json({ message: 'El precio debe ser un número mayor o igual a 0' });
    }
    if (vegetariana !== undefined && typeof vegetariana !== 'boolean') {
      return res.status(400).json({ message: 'El campo vegetariana debe ser booleano' });
    }
    if (disponible !== undefined && typeof disponible !== 'boolean') {
      return res.status(400).json({ message: 'El campo disponible debe ser booleano' });
    }

    const pizza = await repository.update(id, req.body.pizzaInput);
    if (!pizza) {
      return res.status(404).json({ message: 'Pizza no encontrada' });
    }
    return res.status(200).json({ message: 'Pizza actualizada', data: pizza });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const eliminada = await repository.delete(id);
    if (!eliminada) {
      return res.status(404).json({ message: 'Pizza no encontrada' });
    }
    return res.status(200).json({ message: 'Pizza eliminada exitosamente' });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}