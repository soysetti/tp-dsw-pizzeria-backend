import { orm } from '../shared/db/orm.js';
import { IngredientePizza } from './ingrediente-pizza.entity.js';
import { Repository } from '../shared/repository.js';

export class IngredientePizzaRepository implements Repository<IngredientePizza> {
  async findAll(): Promise<IngredientePizza[]> {
    return orm.em.find(IngredientePizza, {}, { populate: ['pizza', 'ingrediente'] });
  }

  async findOne(id: number): Promise<IngredientePizza | null> {
    return orm.em.findOne(IngredientePizza, { id }, { populate: ['pizza', 'ingrediente'] });
  }

  async findByPizza(pizzaId: number): Promise<IngredientePizza[]> {
    return orm.em.find(IngredientePizza, { pizza: pizzaId }, { populate: ['ingrediente'] });
  }

  async add(item: IngredientePizza): Promise<IngredientePizza> {
    const ip = orm.em.create(IngredientePizza, item);
    await orm.em.persistAndFlush(ip);
    return ip;
  }

  async update(id: number, item: Partial<IngredientePizza>): Promise<IngredientePizza | null> {
    const ip = await orm.em.findOne(IngredientePizza, { id });
    if (!ip) return null;
    orm.em.assign(ip, item);
    await orm.em.flush();
    return ip;
  }

  async delete(id: number): Promise<boolean> {
    const ip = await orm.em.findOne(IngredientePizza, { id });
    if (!ip) return false;
    await orm.em.removeAndFlush(ip);
    return true;
  }
}