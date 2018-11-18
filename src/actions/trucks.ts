import axios from 'axios';
import getUrl from './url';
import * as moment from 'moment';
import {serialize} from '../utils/serialize';
import notify, {ENotifyType} from "../utils/notify";
import logger from '../utils/logger';

// data interfaces
export interface ITrailerInfo {
    'registration_number': string,
    'technical_passport': string,
    'brand': string,
    'date': string,
    'color': string,
    'chassis': string,
    'axles': number,
    'type': string,
    'load_capacity'?: number;
    'is_protected': boolean,
    'is_telescopic': boolean
}

export interface ITruckInfo {
  'id'?:string,
  'registration_number': string,
  'technical_passport': string,
  'brand': string,
  'date': string,
  'color': string,
  'chassis': string,
  'axles': number,
  'engine': string,
  'fuel_economy': number,
  'trailer' ?: ITrailerInfo,
};

// actions id
export const GET_TRUCKS = 'GET_TRUCKS';
export const ADD_TRUCK = 'ADD_TRUCK';
export const SET_TRUCKS = 'SET_TRUCKS';

// sends GET request to server
export const getTrucksAction = () => {
  return (dispatch: any, getState: any) => {
    const url = getUrl() + `/carriers/trucks/`;
    return axios.get(url)
      .then((response) => {
        dispatch(setTrucksAction(response.data.results));
      })
      .catch((reason) => {
        notify(ENotifyType.error, 'Не удaлось получить список машин');
        failedRequest('FAILED GET /carriers/trucks', reason.response.data);
      });
  };
};

// send POST request with truc data. Then dispatch getTrucksAction()
export const addTruckAction = (truck: any) => {
  return (dispatch: any, getState: any) => {
    const url = getUrl() + `/carriers/trucks/`;
    return axios
      .post(url, serializeRequest(truck))
      .then((response) => {
        notify(ENotifyType.success, 'Машина успешно добавлена');
        dispatch(getTrucksAction());
      })
      .catch((reason) => {
        notify(ENotifyType.error, 'Не удaлось добавить машину');
        failedRequest('FAILED POST /carriers/trucks', reason.response.data);
      });
  };
};

// update truck: send PUT request, Then dispatch getTrucksAction()
export const updateTruckAction = (truck:any) => {
  return (dispatch: any, getState: any) => {
    const url = getUrl() + `/carriers/trucks/` + truck.id + '/';
    return axios
      .put(url, truck)
      .then((response) => {
        notify(ENotifyType.success, 'Данные обновлены');
        dispatch(getTrucksAction());
      })
      .catch((reason) => {
        notify(ENotifyType.error, 'Не удалось обновить данные');
        failedRequest('FAILED PUT /carriers/trucks', reason.response.data);
        dispatch(getTrucksAction());
        // dispatch(failOrderCreation(reason.response.data));
      });
  };
};


// send DELETE request with truck data. Then dispatch getTrucksAction()
export const deleteTruckAction = (truckId: string) => {
  return (dispatch: any, getState: any) => {
    const url = getUrl() + `/carriers/trucks/` + truckId + '/';
    return axios
      .delete(url)
      .then((response) => {
        notify(ENotifyType.success, 'Машина успешно удалена');
        dispatch(getTrucksAction());
      })
      .catch((reason) => {
        notify(ENotifyType.error, 'Не удалось удалить машину');
        failedRequest('FAILED DELETE /carriers/trucks', reason.response.data);
        dispatch(getTrucksAction());
        // dispatch(failOrderCreation(reason.response.data));
      });
  };
};

// sets trucks list
export const setTrucksAction = (trucks: ITruckInfo[]) => {
  return {
    type: SET_TRUCKS,
    payload: trucks,
  };
};



const serializeRequest = (truck: ITruckInfo) => {
  return truck;
};

// log failed req
const failedRequest = (req, errors: any) => {
  logger.warn(req, errors);
};
