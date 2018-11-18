import {
  SET_CONTAINER_LINE_LIST,
  SET_CONTAINER_TYPE_LIST
} from '../actions/common-enums';
import logger from '../utils/logger';

interface ICommonEnumsReducerState {
  containerLineList?: any[];
  containerTypeList?: any[];
}

interface IAction {
  type: string;
  payload: any;
}

const defaultState = {};

export default (
  state: ICommonEnumsReducerState = defaultState,
  action: IAction
) => {

  logger.debug(action, state);

  switch (action.type) {
    case SET_CONTAINER_LINE_LIST:
      return {
        ...state,
        containerLineList: action.payload
      };
    case SET_CONTAINER_TYPE_LIST:
      return {
        ...state,
        containerTypeList: action.payload
      };
    default:
      return state;
  }
};
