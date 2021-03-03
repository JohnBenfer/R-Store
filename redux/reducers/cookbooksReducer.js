import { COOKBOOKS_CHANGE } from '../constants';
const initialState = {
  cookbooks: []
};
const cookbooksReducer = (state = initialState, action) => {
  switch (action.type) {
    case COOKBOOKS_CHANGE:
      return {
        ...state,
        cookbooks: action.payload
      };
    default:
      return state;
  }
}
export default cookbooksReducer;