import { USER_CHANGE } from '../constants';
const initialState = {
  user: {}
};
const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_CHANGE:
      return {
        ...state,
        user: action.payload
      };
    default:
      return state;
  }
}
export default userReducer;