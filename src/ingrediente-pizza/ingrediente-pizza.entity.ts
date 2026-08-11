import { Entity, Property, ManyToOne, Rel } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/base.entity.js';
import { Pizza } from '../pizza/pizza.entity.js';
import { Ingrediente } from '../ingrediente/ingrediente.entity.js';

@Entity()
export class IngredientePizza extends BaseEntity {
  @Property({ type: 'double' })
  cantidad!: number;

  @ManyToOne(() => Pizza)
  pizza!: Rel<Pizza>;

  @ManyToOne(() => Ingrediente)
  ingrediente!: Rel<Ingrediente>;
}