import axios from 'axios';
import getUrl from './url';
import { push } from 'connected-react-router';
import { serialize } from '../utils/serialize';

export const FAIL_LOGIN_RESPONSE = 'FAIL_LOGIN_RESPONSE';
export const REDIRECT_TO_REFER = 'REDIRECT_FROM';
export const SUCCESS_LOGIN_RESPONSE = 'SUCCESS_LOGIN_RESPONSE';
export const LOGOUT = 'LOGOUT';
export const LOGOUT_AND_REDIRECT = 'LOGOUT_AND_REDIRECT';

export const SET_BOOTSTRAP_DATA = 'SET_BOOTSTRAP_DATA';
export const GET_BOOTSTRAP_DATA = 'GET_BOOTSTRAP_DATA';
export const FAIL_BOOTSTRAP = 'FAIL_BOOTSTRAP';


const serializeTemplate = {
  phone_number: 'phone',
  password: 'password'
};

const _window: any = window;


const failLoginAction = (errors: any) => {
  return {
    type: FAIL_LOGIN_RESPONSE,
    payload: errors
  };
};

export const redirectToReferAction = (from: any) => {
  return {
    type: REDIRECT_TO_REFER,
    payload: from
  };
};

const successLoginAction = (token: string) => {
  return {
    type: SUCCESS_LOGIN_RESPONSE,
    payload: token
  };
};

export const sendLoginRequestAction = (userData: any) => {
  return (dispatch: any, getState: any) => {
    const { auth } = getState();
    axios
      .post(getUrl() + '/users/auth/', serialize(serializeTemplate, userData))
      .then((response) =>{
        if (response.data.token) {
          dispatch(successLoginAction(response.data.token));
          dispatch(push(auth.redirectTo));
        }else{
          dispatch(failLoginAction(response.data));
        }
      })
      .catch((reason) => {
        dispatch(failLoginAction(reason.response.data));
      });
  };
};

export const logoutAction = () => {
    _window.OneSignal.deleteTag("user_id");
  return {
      type: LOGOUT,
      payload: null,
    };
};

// not working as intended - last action is not working
export const logoutAndRedirectAction = () => {
  return function (dispatch: any, state: any) {
    // do logout
    dispatch(logoutAction());

    // then redirect
    // for some resaon do not work
    return push('/app/orders/create');
  };

};
