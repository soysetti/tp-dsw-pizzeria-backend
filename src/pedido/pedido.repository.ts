import { orm } from '../shared/db/orm.js';
import { Pedido } from './pedido.entity.js';
import { Repository } from '../shared/repository.js';

export class PedidoRepository implements Repository<Pedido> {
  async findAll(): Promise<Pedido[]> {
    return orm.em.find(Pedido, {});
  }

  async findOne(id: number): Promise<Pedido | null> {
    return orm.em.findOne(Pedido, { id }, { populate: ['detalles'] });
  }

  async add(item: Pedido): Promise<Pedido> {
    const pedido = orm.em.create(Pedido, item);
    await orm.em.persistAndFlush(pedido);
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