import {SET_OFFERS, IOffer} from '../actions/offers';
import logger from '../utils/logger';

interface IState {
  list : IOffer[],
}

const defaultState: IState  = {
  list:[],
};

export default (state: IState = defaultState, action: { type: string, payload: any }) => {
  switch(action.type){
    case  SET_OFFERS:
      const s = { ...state,  list: action.payload}
      logger.debug('[OFFERS R] action:', action, 'old state:', state, 'new state:', s);
      return s;

    default:
      return state;
  }
}
