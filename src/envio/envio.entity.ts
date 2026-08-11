import { Entity, Property, ManyToOne, OneToOne, Rel } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/base.entity.js';
import { Repartidor } from '../repartidor/repartidor.entity.js';
import { Pedido } from '../pedido/pedido.entity.js';

@Entity()
export class Envio extends BaseEntity {
  @Property({ type: 'number' })
  costo!: number;

  @Property({ type: 'number' })
  montoPropina!: number;

  @ManyToOne(() => Repartidor)
  repartidor!: Rel<Repartidor>;

  @OneToOne(() => Pedido)
  pedido!: Rel<Pedido>;
}