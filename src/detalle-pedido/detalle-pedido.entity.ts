import { Entity, Property, ManyToOne, Rel } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/base.entity.js';
import { Pizza } from '../pizza/pizza.entity.js';
import { Pedido } from '../pedido/pedido.entity.js';

@Entity()
export class DetallePedido extends BaseEntity {
  @Property({ type: 'number' })
  cantidad!: number;

  @ManyToOne(() => Pizza)
  pizza!: Rel<Pizza>;

  @ManyToOne(() => Pedido)
  pedido!: Rel<Pedido>;

  // subtotal es atributo derivado (el "/" del diagrama): no se persiste
  get subtotal(): number {
    return this.cantidad * (this.pizza?.precio ?? 0);
  }
}