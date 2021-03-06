import { createStore, combineReducers } from 'redux';
import recipesReducer from '../reducers/recipesReducer';
import cookbooksReducer from '../reducers/cookbooksReducer';
import userReducer from '../reducers/userReducer';

const rootReducer = combineReducers(
  { 
    recipes: recipesReducer,
    cookbooks: cookbooksReducer,
    user: userReducer,
  }
);
const configureStore = () => {
  return createStore(rootReducer);
}
export default configureStore;