import { Request, Response, NextFunction } from 'express';
import * as service from './pizza.service.js';
import { handleError } from '../shared/handle-error.js';

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
    const pizzas = await service.listarPizzas();
    return res.status(200).json({ message: 'Todas las pizzas recuperadas', data: pizzas });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function findOne(req: Request, res: Response) {
  try {
    const pizza = await service.buscarPizza(Number(req.params.id));
    return res.status(200).json({ data: pizza });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function add(req: Request, res: Response) {
  try {
    const nuevaPizza = await service.crearPizza(req.body.pizzaInput);
    return res.status(201).json({ message: 'Pizza creada con éxito', data: nuevaPizza });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function update(req: Request, res: Response) {
  try {
    const pizza = await service.actualizarPizza(Number(req.params.id), req.body.pizzaInput);
    return res.status(200).json({ message: 'Pizza actualizada', data: pizza });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function remove(req: Request, res: Response) {
  try {
    await service.eliminarPizza(Number(req.params.id));
    return res.status(200).json({ message: 'Pizza eliminada exitosamente' });
  } catch (error) {
    return handleError(res, error);
  }
}