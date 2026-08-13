import { Request, Response, NextFunction } from 'express';
import { PedidoRepository, ItemPedidoInput } from './pedido.repository.js';
import { PizzaRepository } from '../pizza/pizza.repository.js';

const repository = new PedidoRepository();
const pizzaRepository = new PizzaRepository();

export function sanitizePedidoInput(req: Request, res: Response, next: NextFunction) {
  req.body.pedidoInput = {
    retiro: req.body.retiro,
    estado: req.body.estado,
    items: req.body.items,
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
    const estado = req.query.estado as string | undefined;
    const pedidos = await repository.findAll(estado);
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
    const { retiro, items } = req.body.pedidoInput;

    if (typeof retiro !== 'boolean') {
      return res.status(400).json({ message: 'retiro es requerido y debe ser true o false' });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'items es requerido y debe ser una lista con al menos una pizza' });
    }

    // Validamos la forma de cada item antes de tocar la base de datos
    for (const item of items) {
      if (typeof item.pizzaId !== 'number' || typeof item.cantidad !== 'number' || item.cantidad <= 0) {
        return res.status(400).json({
          message: 'Cada item debe tener pizzaId (número) y cantidad (número mayor a 0)',
        });
      }
    }

    // Buscamos y validamos que cada pizza exista y esté disponible
    const itemsConPizza: ItemPedidoInput[] = [];
    for (const item of items) {
      const pizza = await pizzaRepository.findOne(item.pizzaId);
      if (!pizza) {
        return res.status(404).json({ message: `No existe una pizza con id ${item.pizzaId}` });
      }
      if (!pizza.disponible) {
        return res.status(400).json({ message: `La pizza "${pizza.nombre}" no está disponible` });
      }
      itemsConPizza.push({ pizza, cantidad: item.cantidad });
    }

    // El cliente solo define "retiro" y las pizzas del pedido.
    // dia, total y estado los calcula/asigna el sistema.
    const nuevoPedido = await repository.addConItems(retiro, itemsConPizza);
    return res.status(201).json({ message: 'Pedido creado con éxito', data: nuevoPedido });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    // "items" solo tiene sentido en la creación (add). El update de Pedido
    // no toca los ítems del pedido — eso se maneja desde /api/detalle-pedido.
    delete req.body.pedidoInput.items;

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