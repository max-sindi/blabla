import { push } from 'connected-react-router';
export const UNATHORIZED_REQUEST = 'UNATHORIZED_REQUEST';
const unathorizeRequestAction = () => {
  return {
    type: UNATHORIZED_REQUEST
  };
};

export const unathorizeRequest = (error: any, dispatch: any) => {
  if (error.response && error.response.status === 401) {
    dispatch(unathorizeRequestAction());
    dispatch(push('/login'));
  }
};
