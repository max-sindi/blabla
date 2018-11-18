import axios from 'axios';
import getUrl from './url';
import logger from '../utils/logger';

export const SET_CONTAINER_TYPE_LIST = 'SET_CONTAINER_TYPE_LIST';
export const SET_CONTAINER_LINE_LIST = 'SET_CONTAINER_LINE_LIST';

export const setContainerTypeList = (listOfTypes: any) => {
  return {
    type: SET_CONTAINER_TYPE_LIST,
    payload: listOfTypes
  };
};

export const setContainerLineList = (listOfTypes: any) => {
  return {
    type: SET_CONTAINER_LINE_LIST,
    payload: listOfTypes
  };
};

// @deprecated not used anymore. See getBootstrapDataAction()
export const getEnums = (url: string, action: any) => {
  return (dispatch: any, getState: any) => {
    const { commonEnums: { containerTypeList } ,auth } = getState();
    if (containerTypeList) {
      return dispatch(setContainerTypeList(containerTypeList));
    }
    return axios({
      method: 'GET',
     url:  getUrl() + url,
     headers: { Authorization: 'JWT ' + auth.token }
    }).then((response) => {
        if (response.data) {
          dispatch(action(response.data));
        }
      })
      .catch((reason) => {
        logger.warn(reason.response);
      });
  };
};

// @deprecated not used anymore. See getBootstrapDataAction()
export const getContainerType = () => {
  return getEnums('/common/container/types/', setContainerTypeList);
};

// @deprecated not used anymore. See getBootstrapDataAction()
export const getContainerLine = () => {
  return getEnums('/common/container/lines/', setContainerLineList);
};
