import { FAIL_REGISTRATION_RESPONSE } from '../actions/registration';

interface IRegistrationReducerState {
  errors: any[];
}

interface IAction {
  type: string;
  payload: any;
}

export default (state: IRegistrationReducerState = {errors:[]}, action: IAction) => {
    switch (action.type) {
    case FAIL_REGISTRATION_RESPONSE:
      state.errors = action.payload;
      return state;
    default:
      return state;
  }
};
