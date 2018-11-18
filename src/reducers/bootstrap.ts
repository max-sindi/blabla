import { SET_BOOTSTRAP_DATA } from '../actions/bootstrap';
import {UNATHORIZED_REQUEST} from '../utils/unauthorized';

interface IBootstrapReducerState {
  fetched: boolean;
  user?: any;
}

interface IAction {
  type: string;
  payload: any;
}

const defaultState  = {
  fetched: false,
  user: {}
};

export default (state: IBootstrapReducerState = defaultState, action: IAction) => {
  switch (action.type) {
    case SET_BOOTSTRAP_DATA:
      return { fetched: true, user: action.payload.user};
     case UNATHORIZED_REQUEST: return defaultState;

    default:
      return state;
  }
};
