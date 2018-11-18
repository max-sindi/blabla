import axios from 'axios';
import getUrl from './url';
import notify, {ENotifyType}  from '../utils/notify';
import {ITruckInfo} from "./trucks";
import logger from '../utils/logger';


// data interfaces
export interface IOfferContainer {
  id?:   string,
  line:  string,
  type:  string,
}

export interface IOfferCarrier{
  id:    string,
  name:  string,
}

export interface IOfferLocation{
  country: string,
  region: string,
  city: string,
  address: string,
  point: {
    type: string,
    coordinates: number[],
  },
}

// offer data interface
export interface IOffer {
  id: string,
  truck: ITruckInfo,
  location: IOfferLocation,
  radius: number,
  date: string,
  container: IOfferContainer,
  carrier: IOfferCarrier,
}

// interface for offee creation
export interface IOfferCreation {
  id?: string,
  truck?: string,
  location: IOfferLocation,
  radius: number,
  date: string,
  container: IOfferContainer,
  axles?: number,
  load_capacity?: number,
  trailerAxles?: number,
  type?: string,
  is_protected?: boolean,
  is_telescopic?: boolean,
}


export const GET_OFFERS = 'GET_OFFERS';
export const SET_OFFERS = 'SET_OFFERS';
export const CREATE_OFFER  = 'CREATE_OFFER';
export const UPDATE_OFFER  = 'UPDATE_OFFER';
export const DELETE_OFFER  = 'DELETE_OFFER';

// get relevant offers, by sending GET request to server
export const getOffersAction = (params = null) => {
  const options = params ? {'params' : params} : null;
  return (dispatch: any, getState: any) => {
    const url = getUrl() + `/carriers/offers/`;
    return axios.get(url, options)
      .then((response) => {
        dispatch(setOffersAction(response.data.results));
      })
      .catch((reason) => {
        failedRequest('FAILED GET /carriers/offers', reason.response.data);
      });
  };
};


// sets offers list
export const setOffersAction = (offers: IOffer[]) => {
  return {
    type: SET_OFFERS,
    payload: offers,
  };
};

// add offer: send POST request with offer data. Then redirect to offers
export const createOfferAction = (offer: IOfferCreation) => {
  return (dispatch: any, getState: any) => {
    const url = getUrl() + `/carriers/offers/`;
    return axios
      .post(url, offer)
      .then((response) => {
        notify(ENotifyType.success, 'Оффер успешно создан');
        dispatch(getOffersAction());
    })
      .catch((reason) => {
        notify(ENotifyType.error, 'Не удалось создать оффер');
        failedRequest('FAILED POST /carriers/offers', reason.response.data);
        // dispatch(failOrderCreation(reason.response.data));
      });
  };
};


// delete offer: send DELETE request, Then dispatch getOffersAction()
export const deleteOfferAction = (offerId: string) => {
  return (dispatch: any, getState: any) => {
    const url = getUrl() + `/carriers/offers/` + offerId + '/';
    return axios
      .delete(url)
      .then((response) => {
        notify(ENotifyType.success, 'Оффер успешно удалён');
        dispatch(getOffersAction());
      })
      .catch((reason) => {
        notify(ENotifyType.error, 'Не удалось удалить оффер');
        failedRequest('FAILED DELETE /carriers/offers', reason.response.data);
        dispatch(getOffersAction());
        // dispatch(failOrderCreation(reason.response.data));
      });
  };
};


// update offer: send PUT request, Then dispatch getOffersAction()
export const updateOfferAction = (offer:IOffer) => {
  return (dispatch: any, getState: any) => {
    const url = getUrl() + `/carriers/offers/` + offer.id + '/';
    return axios
      .put(url, offer)
      .then((response) => {
        notify(ENotifyType.success, 'Оффер успешно обновлен');
        dispatch(getOffersAction());
      })
      .catch((reason) => {
        notify(ENotifyType.error, 'Не удалось обновить оффер');
        failedRequest('FAILED PUT /carriers/offers', reason.response.data);
        dispatch(getOffersAction());
        // dispatch(failOrderCreation(reason.response.data));
      });
  };
};


// serialize data from API
const serializeRequest = (offer: IOffer) => {
  return offer;
};


// log failed req
const failedRequest = (req, errors: any) => {
  logger.info(req, errors);
};
