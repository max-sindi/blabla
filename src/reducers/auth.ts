import { FAIL_LOGIN_RESPONSE, REDIRECT_TO_REFER, SUCCESS_LOGIN_RESPONSE, LOGOUT } from '../actions/auth';
import {UNATHORIZED_REQUEST} from '../utils/unauthorized';
import logger from '../utils/logger';

interface IAuthReducerState {
  errors: any[];
  redirectTo: any;
}

interface IAction {
  type: string;
  payload: any;
}

const defaultState:IAuthReducerState = {errors:[], redirectTo: '/' };

/**
 * Reducer for all auth actions.
 *
 * @param {IAuthReducerState} state
 * @param {IAction} action
 * @returns {any}
 */
export default (state: IAuthReducerState = defaultState, action: IAction) => {
  let newState:any;

  switch (action.type) {
    case FAIL_LOGIN_RESPONSE:
      // on failed login, add to state errors.
      newState = {...state, errors: action.payload };
      logger.debug('[AUTH R] ACTION: ', action, 'NEW STATE: ', newState, 'OLD STATE: ', state );
      break;

    case REDIRECT_TO_REFER:
      // on failed login, add to state redirectTo.
      newState  = { ...state, redirectTo: action.payload ? action.payload : state.redirectTo  }
      logger.debug('[AUTH R] ACTION: ', action, 'NEW STATE: ', newState, 'OLD STATE: ', state );
      break;

    case SUCCESS_LOGIN_RESPONSE:
      // on success login, add to state token.
      newState = { ...state, token: action.payload}
      logger.debug('[AUTH R] ACTION: ', action, 'NEW STATE: ', newState, 'OLD STATE: ', state );
      break;

    case LOGOUT:
      // on logout request, reset state to default.
      newState = {errors: [], redirectTo : '/login'};
      logger.debug('[AUTH R] ACTION: ', action, 'NEW STATE: ', newState, 'OLD STATE: ', state );
      break;

    case UNATHORIZED_REQUEST:
      // on unauthorized request, reset state to default.
      newState = defaultState;
      logger.debug('[AUTH R] ACTION: ', action, 'NEW STATE: ', newState, 'OLD STATE: ', state );

    default:
      // some other action, make no change to state
      newState = state;
  }

  return newState;
};
