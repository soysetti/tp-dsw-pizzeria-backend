import { Router } from 'express';
import {
  sanitizeIngredientePizzaInput,
  findAll,
  findOne,
  findByPizza,
  add,
  update,
  remove,
} from './ingrediente-pizza.controller.js';

export const ingredientePizzaRouter = Router();

ingredientePizzaRouter.get('/', findAll);
ingredientePizzaRouter.get('/pizza/:pizzaId', findByPizza);
ingredientePizzaRouter.get('/:id', findOne);
ingredientePizzaRouter.post('/', sanitizeIngredientePizzaInput, add);
ingredientePizzaRouter.put('/:id', sanitizeIngredientePizzaInput, update);
ingredientePizzaRouter.delete('/:id', remove);