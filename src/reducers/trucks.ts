import {SET_TRUCKS, ITruckInfo} from '../actions/trucks';
import logger from '../utils/logger';

interface IState {
    list : ITruckInfo[],
}

const defaultState: IState  = {
  list:[],
};

export default (state: IState = defaultState, action: { type: string, payload: any }) => {
    switch(action.type){
      case  SET_TRUCKS:
        const s = { ...state,  list: action.payload}
        logger.debug('[TRUCKS R] action:', action, 'old state:', state, 'new state:', s);
        return s;

      default:
        return state;
    }
}
