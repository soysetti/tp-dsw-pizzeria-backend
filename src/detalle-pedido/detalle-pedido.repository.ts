import { orm } from '../shared/db/orm.js';
import { DetallePedido } from './detalle-pedido.entity.js';
import { Repository } from '../shared/repository.js';

export class DetallePedidoRepository implements Repository<DetallePedido> {
  async findAll(): Promise<DetallePedido[]> {
    return orm.em.find(DetallePedido, {}, { populate: ['pizza', 'pedido'] });
  }

  async findOne(id: number): Promise<DetallePedido | null> {
    return orm.em.findOne(DetallePedido, { id }, { populate: ['pizza', 'pedido'] });
  }

  async add(item: DetallePedido): Promise<DetallePedido> {
    const detalle = orm.em.create(DetallePedido, item);
    await orm.em.persistAndFlush(detalle);
    return detalle;
  }

  async update(id: number, item: Partial<DetallePedido>): Promise<DetallePedido | null> {
    const detalle = await orm.em.findOne(DetallePedido, { id });
    if (!detalle) return null;
    orm.em.assign(detalle, item);
    await orm.em.flush();
    return detalle;
  }

  async delete(id: number): Promise<boolean> {
    const detalle = await orm.em.findOne(DetallePedido, { id });
    if (!detalle) return false;
    await orm.em.removeAndFlush(detalle);
    return true;
  }
}