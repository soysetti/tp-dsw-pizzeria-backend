import { orm } from '../shared/db/orm.js';
import { DetallePedido } from './detalle-pedido.entity.js';
import { Pizza } from '../pizza/pizza.entity.js';
import { Pedido } from '../pedido/pedido.entity.js';

// DetallePedido no implementa Repository<T> como las demás entidades:
// para crear o actualizar un detalle necesitamos el id de la pizza y del
// pedido (no el objeto completo), así que la forma de entrada es distinta.
export interface DetallePedidoInput {
  cantidad: number;
  pizzaId: number;
  pedidoId: number;
}

export class DetallePedidoRepository {
  async findAll(): Promise<DetallePedido[]> {
    return orm.em.find(DetallePedido, {}, { populate: ['pizza', 'pedido'] });
  }

  async findOne(id: number): Promise<DetallePedido | null> {
    return orm.em.findOne(DetallePedido, { id }, { populate: ['pizza', 'pedido'] });
  }

  async add(item: DetallePedidoInput): Promise<DetallePedido> {
    const detalle = new DetallePedido();
    detalle.cantidad = item.cantidad;
    detalle.pizza = orm.em.getReference(Pizza, item.pizzaId);
    detalle.pedido = orm.em.getReference(Pedido, item.pedidoId);

    await orm.em.persistAndFlush(detalle);
    return detalle;
  }

  async update(id: number, item: Partial<DetallePedidoInput>): Promise<DetallePedido | null> {
    const detalle = await orm.em.findOne(DetallePedido, { id });
    if (!detalle) return null;

    if (item.cantidad !== undefined) detalle.cantidad = item.cantidad;
    if (item.pizzaId !== undefined) detalle.pizza = orm.em.getReference(Pizza, item.pizzaId);
    if (item.pedidoId !== undefined) detalle.pedido = orm.em.getReference(Pedido, item.pedidoId);

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