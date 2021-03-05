import { USER_CHANGE } from '../constants';

export function changeUser(user) {
  return {
    type: USER_CHANGE,
    payload: user
  }
}