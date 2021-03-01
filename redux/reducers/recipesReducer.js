import { RECIPES_CHANGE } from '../constants';
const initialState = {
  recipes: []
};
const recipesReducer = (state = initialState, action) => {
  switch (action.type) {
    case RECIPES_CHANGE:
      return {
        ...state,
        recipes: action.payload
      };
    default:
      return state;
  }
}
export default recipesReducer;