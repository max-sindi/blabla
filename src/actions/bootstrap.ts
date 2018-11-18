import axios from 'axios';
import getUrl from './url';
import { push } from 'connected-react-router';
import { unathorizeRequest } from '../utils/unauthorized';
import { setContainerTypeList, setContainerLineList} from './common-enums';
import {store} from '../index';

export const SET_BOOTSTRAP_DATA = 'SET_BOOTSTRAP_DATA';
export const GET_BOOTSTRAP_DATA = 'GET_BOOTSTRAP_DATA';
export const FAIL_BOOTSTRAP = 'FAIL_BOOTSTRAP';

const _window: any = window;

export const setBootstrapDataAction = (data: any) => {
  return {
    type: SET_BOOTSTRAP_DATA,
    payload: data
  };
};

export const getBootstrapDataAction = () => {
  return (dispatch: any, getState: any) => {
    const { auth } = getState();
    const url = getUrl() + '/users/bootstrap/';
    if (auth.token) {
      return axios({
        method: 'GET',
        url,
        headers: { Authorization: 'JWT ' + auth.token }
      })
        .then((response) => {
            _window.OneSignal.sendTag("user_id", `${response.data.user.id}`);

          dispatch(setBootstrapDataAction(response.data));
          dispatch(setContainerLineList(response.data.container.lines));
          dispatch(setContainerTypeList(response.data.container.types));
        })
        .catch((error) => {
          // unathorizeRequest(error,dispatch);
        });
    }
    // return dispatch(push('/login'));
  };
};

export const bootstrapFailAction = (message: string) => {
  return {
    type: FAIL_BOOTSTRAP,
    payload: message
  };
};
