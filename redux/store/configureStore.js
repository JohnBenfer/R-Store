import { createStore, combineReducers } from 'redux';
import recipesReducer from '../reducers/recipesReducer';

const rootReducer = combineReducers(
  { recipes: recipesReducer }
);
const configureStore = () => {
  return createStore(rootReducer);
}
export default configureStore;