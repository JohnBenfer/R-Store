import { createStore, combineReducers } from 'redux';
import recipesReducer from '../reducers/recipesReducer';
import cookbooksReducer from '../reducers/cookbooksReducer';

const rootReducer = combineReducers(
  { 
    recipes: recipesReducer,
    cookbooks: cookbooksReducer,
  }
);
const configureStore = () => {
  return createStore(rootReducer);
}
export default configureStore;