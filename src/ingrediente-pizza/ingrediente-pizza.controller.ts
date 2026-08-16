import { Request, Response, NextFunction } from 'express';
import * as service from './ingrediente-pizza.service.js';
import { handleError } from '../shared/handle-error.js';

export function sanitizeIngredientePizzaInput(req: Request, res: Response, next: NextFunction) {
  req.body.ingredientePizzaInput = {
    cantidad: req.body.cantidad,
    pizzaId: req.body.pizzaId,
    ingredienteId: req.body.ingredienteId,
  };

  Object.keys(req.body.ingredientePizzaInput).forEach((key) => {
    if (req.body.ingredientePizzaInput[key] === undefined) {
      delete req.body.ingredientePizzaInput[key];
    }
  });

  next();
}

export async function findAll(req: Request, res: Response) {
  try {
    const data = await service.listarTodo();
    return res.status(200).json({ message: 'Todos los ingredientes de pizza recuperados', data });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function findOne(req: Request, res: Response) {
  try {
    const data = await service.buscarUno(Number(req.params.pizzaId), Number(req.params.ingredienteId));
    return res.status(200).json({ data });
  } catch (error) {
    return handleError(res, error);
  }
}

// Composición completa de una pizza: qué ingredientes tiene y en qué cantidad
export async function findByPizza(req: Request, res: Response) {
  try {
    const data = await service.listarPorPizza(Number(req.params.pizzaId));
    return res.status(200).json({ data });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function add(req: Request, res: Response) {
  try {
    const nuevo = await service.crear(req.body.ingredientePizzaInput);
    return res.status(201).json({ message: 'Ingrediente agregado a la pizza con éxito', data: nuevo });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function update(req: Request, res: Response) {
  try {
    const pizzaId = Number(req.params.pizzaId);
    const ingredienteId = Number(req.params.ingredienteId);
    const data = await service.actualizar(pizzaId, ingredienteId, req.body.ingredientePizzaInput.cantidad);
    return res.status(200).json({ message: 'Actualizado con éxito', data });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const pizzaId = Number(req.params.pizzaId);
    const ingredienteId = Number(req.params.ingredienteId);
    await service.eliminar(pizzaId, ingredienteId);
    return res.status(200).json({ message: 'Eliminado exitosamente' });
  } catch (error) {
    return handleError(res, error);
  }
}