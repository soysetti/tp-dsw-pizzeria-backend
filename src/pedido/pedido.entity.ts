import { Entity, Property, OneToMany, OneToOne, ManyToOne, Collection, Rel } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/base.entity.js';
import { DetallePedido } from '../detalle-pedido/detalle-pedido.entity.js';
import { Envio } from '../envio/envio.entity.js';
import { Repartidor } from '../repartidor/repartidor.entity.js';
import { Cliente } from '../cliente/cliente.entity.js';

@Entity()
export class Pedido extends BaseEntity {
  @Property({ type: 'Date' })
  dia: Date = new Date();

  @Property({ type: 'number' })
  total: number = 0;

  @Property({ type: 'string' })
  tipoPedido!: string;

  @Property({ type: 'string' })
  estado: string = 'Pendiente';

  @Property({ type: 'string' })
  categoria!: string;

  @OneToMany(() => DetallePedido, (detalle) => detalle.pedido)
  detalles = new Collection<DetallePedido>(this);

  @OneToOne(() => Envio, (envio) => envio.pedido, { nullable: true })
  envio?: Envio;

  @ManyToOne(() => Repartidor, { nullable: true })
  repartidor?: Repartidor;

  @ManyToOne(() => Cliente, { nullable: true })
  cliente?: Rel<Cliente>;
}