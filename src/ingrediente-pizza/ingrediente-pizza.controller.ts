import { Request, Response, NextFunction } from 'express';
import { IngredientePizzaRepository } from './ingrediente-pizza.repository.js';
import { PizzaRepository } from '../pizza/pizza.repository.js';
import { IngredienteRepository } from '../ingrediente/ingrediente.repository.js';

const repository = new IngredientePizzaRepository();
const pizzaRepository = new PizzaRepository();
const ingredienteRepository = new IngredienteRepository();

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
    const data = await repository.findAll();
    return res.status(200).json({ message: 'Todos los ingredientes de pizza recuperados', data });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export async function findOne(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const data = await repository.findOne(id);
    if (!data) {
      return res.status(404).json({ message: 'Registro no encontrado' });
    }
    return res.status(200).json({ data });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

// Composición completa de una pizza: qué ingredientes tiene y en qué cantidad
export async function findByPizza(req: Request, res: Response) {
  try {
    const pizzaId = Number(req.params.pizzaId);
    const pizza = await pizzaRepository.findOne(pizzaId);
    if (!pizza) {
      return res.status(404).json({ message: `No existe una pizza con id ${pizzaId}` });
    }
    const data = await repository.findByPizza(pizzaId);
    return res.status(200).json({ data });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export async function add(req: Request, res: Response) {
  try {
    const { cantidad, pizzaId, ingredienteId } = req.body.ingredientePizzaInput;

    if (cantidad === undefined || typeof cantidad !== 'number' || cantidad <= 0) {
      return res.status(400).json({ message: 'La cantidad es requerida y debe ser un número mayor a 0' });
    }
    if (pizzaId === undefined || typeof pizzaId !== 'number') {
      return res.status(400).json({ message: 'pizzaId es requerido y debe ser un número' });
    }
    if (ingredienteId === undefined || typeof ingredienteId !== 'number') {
      return res.status(400).json({ message: 'ingredienteId es requerido y debe ser un número' });
    }

    const pizza = await pizzaRepository.findOne(pizzaId);
    if (!pizza) {
      return res.status(404).json({ message: `No existe una pizza con id ${pizzaId}` });
    }
    const ingrediente = await ingredienteRepository.findOne(ingredienteId);
    if (!ingrediente) {
      return res.status(404).json({ message: `No existe un ingrediente con id ${ingredienteId}` });
    }

    const nuevo = await repository.add({ cantidad, pizza, ingrediente } as any);
    return res.status(201).json({ message: 'Ingrediente agregado a la pizza con éxito', data: nuevo });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const { cantidad, pizzaId, ingredienteId } = req.body.ingredientePizzaInput;

    if (Object.keys(req.body.ingredientePizzaInput).length === 0) {
      return res.status(400).json({ message: 'Debe enviar al menos un campo para actualizar' });
    }
    if (cantidad !== undefined && (typeof cantidad !== 'number' || cantidad <= 0)) {
      return res.status(400).json({ message: 'La cantidad debe ser un número mayor a 0' });
    }

    const cambios: any = {};
    if (cantidad !== undefined) cambios.cantidad = cantidad;

    if (pizzaId !== undefined) {
      const pizza = await pizzaRepository.findOne(pizzaId);
      if (!pizza) {
        return res.status(404).json({ message: `No existe una pizza con id ${pizzaId}` });
      }
      cambios.pizza = pizza;
    }
    if (ingredienteId !== undefined) {
      const ingrediente = await ingredienteRepository.findOne(ingredienteId);
      if (!ingrediente) {
        return res.status(404).json({ message: `No existe un ingrediente con id ${ingredienteId}` });
      }
      cambios.ingrediente = ingrediente;
    }

    const data = await repository.update(id, cambios);
    if (!data) {
      return res.status(404).json({ message: 'Registro no encontrado' });
    }
    return res.status(200).json({ message: 'Actualizado con éxito', data });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const eliminado = await repository.delete(id);
    if (!eliminado) {
      return res.status(404).json({ message: 'Registro no encontrado' });
    }
    return res.status(200).json({ message: 'Eliminado exitosamente' });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}