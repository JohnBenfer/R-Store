import { RECIPES_CHANGE } from '../constants';

export function changeRecipes(recipes) {
  return {
    type: RECIPES_CHANGE,
    payload: recipes
  }
}