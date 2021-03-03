import { COOKBOOKS_CHANGE } from '../constants';

export function changeCookbooks(cookbooks) {
  return {
    type: COOKBOOKS_CHANGE,
    payload: cookbooks
  }
}