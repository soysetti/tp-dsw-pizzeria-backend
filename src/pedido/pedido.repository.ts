import { RequiredEntityData } from '@mikro-orm/core';
import { orm } from '../shared/db/orm.js';
import { Pedido } from './pedido.entity.js';
import { Pizza } from '../pizza/pizza.entity.js';
import { DetallePedido } from '../detalle-pedido/detalle-pedido.entity.js';
import { Repository } from '../shared/repository.js';

export interface ItemPedidoInput {
  pizza: Pizza;
  cantidad: number;
}

export class PedidoRepository implements Repository<Pedido> {
  async findAll(): Promise<Pedido[]> {
    return orm.em.find(Pedido, {});
  }

  async findOne(id: number): Promise<Pedido | null> {
    return orm.em.findOne(Pedido, { id }, { populate: ['detalles', 'detalles.pizza'] });
  }

  async add(item: Pedido): Promise<Pedido> {
    const pedido = orm.em.create(Pedido, item);
    await orm.em.persistAndFlush(pedido);
    return pedido;
  }

  // CUU: registrar un pedido junto con sus ítems (pizza + cantidad).
  // El total se calcula acá, nunca lo manda el cliente.
  async addConItems(retiro: boolean, items: ItemPedidoInput[]): Promise<Pedido> {
    const pedido = orm.em.create(Pedido, {
      retiro,
      estado: 'Pendiente',
      dia: new Date(),
      total: 0,
    });

    let total = 0;
    for (const { pizza, cantidad } of items) {
      const detalleData = { pedido, pizza, cantidad } as Omit<RequiredEntityData<DetallePedido>, 'subtotal'>;
      orm.em.create(DetallePedido, detalleData as RequiredEntityData<DetallePedido>);
      total += cantidad * pizza.precio;
    }
    pedido.total = total;

    await orm.em.flush();
    return pedido;
  }

  async update(id: number, item: Partial<Pedido>): Promise<Pedido | null> {
    const pedido = await orm.em.findOne(Pedido, { id });
    if (!pedido) return null;
    orm.em.assign(pedido, item);
    await orm.em.flush();
    return pedido;
  }

  async delete(id: number): Promise<boolean> {
    const pedido = await orm.em.findOne(Pedido, { id });
    if (!pedido) return false;
    await orm.em.removeAndFlush(pedido);
    return true;
  }
}