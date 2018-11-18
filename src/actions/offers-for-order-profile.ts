import axios from 'axios';
import getUrl from './url';
import {store} from '../';
import {ENotifyType, default as notify} from "../utils/notify";
import logger from '../utils/logger';


export const SET_NEW_OFFERS_FOR_ORDER_PROFILE = 'GET_NEW_OFFERS_FOR_ORDER_PROFILE';
export const SET_OFFERS_IN_CONSIDERATION_FOR_ORDER_PROFILE = 'SET_OFFERS_IN_CONSIDERATION_FOR_ORDER_PROFILE';
export const CLEAR_NEW_OFFERS_FOR_ORDER_PROFILE = 'CLEAR_NEW_OFFERS_FOR_ORDER_PROFILE';
export const CLEAR_OFFERS_IN_CONSIDERATION_FOR_ORDER_PROFILE = 'CLEAR_OFFERS_IN_CONSIDERATION_FOR_ORDER_PROFILE';
export const SHOW_LOADING_ICON_NEW_OFFERS = 'SHOW_LOADING_ICON_NEW_OFFERS';
export const SHOW_LOADING_ICON_OFFERS_IN_CONSIDERATION = 'SHOW_LOADING_ICON_OFFERS_IN_CONSIDERATION';

export const getNewOffersForOrderProfile = (
    container_id: string
) => {
    return (dispatch: any) => {
        const url = getUrl() + `/carriers/offers/?container_id=${container_id}`;
        dispatch(showLoadingIconNewOffers(true));
        return axios({
            method: 'GET',
            url: url
        })
            .then((response) => {
                dispatch(showLoadingIconNewOffers(false));
                dispatch(setNewOffersForOrderProfile(response.data.results, container_id));
            })
            .catch((reason) => {
                notify(ENotifyType.error, 'Не удалось получить список офферов для заявки');
                dispatch(showLoadingIconNewOffers(false));
                failedRequest('FAILED GET /carriers/offers/?container_id', reason);
            });
    };
};

export const getOffersInConsiderationForOrderProfile = (
    container_id: string
) => {
    return (dispatch: any) => {
        const url = getUrl() + `/customers/orders/container/${container_id}/offers/`;
        dispatch(showLoadingIconOffersInConsideration(true));
        return axios({
            method: 'GET',
            url: url
        })
            .then((response) => {
                dispatch(showLoadingIconOffersInConsideration(false));
                dispatch(setOffersInConsiderationForOrderProfile(response.data, container_id));
            })
            .catch((reason) => {
                notify(ENotifyType.error, 'Не удалось получить список офферов для заявки');
                dispatch(showLoadingIconOffersInConsideration(false));
                failedRequest('/customers/orders/container/${container_id}/offers/', reason);
            });
    };
};

export const showLoadingIconNewOffers = (mode: boolean) => {
    return {
        type: SHOW_LOADING_ICON_NEW_OFFERS,
        payload: mode
    };
};

export const showLoadingIconOffersInConsideration = (mode: boolean) => {
    return {
        type: SHOW_LOADING_ICON_OFFERS_IN_CONSIDERATION,
        payload: mode
    };
};


export const setNewOffersForOrderProfile = (
    offers: any,
    container_id: string
) => {
    return {
        type: SET_NEW_OFFERS_FOR_ORDER_PROFILE,
        offers: offers,
        container_id: container_id
    };
};

export const setOffersInConsiderationForOrderProfile = (
    offers: any,
    container_id: string
) => {
    return {
        type: SET_OFFERS_IN_CONSIDERATION_FOR_ORDER_PROFILE,
        offers: offers,
        container_id: container_id
    };
};

export const clearNewOffersForOrderProfile = () => {
    return {
        type: CLEAR_NEW_OFFERS_FOR_ORDER_PROFILE
    };
};

export const clearOffersInConsiderationForOrderProfile = () => {
    return {
        type: CLEAR_OFFERS_IN_CONSIDERATION_FOR_ORDER_PROFILE
    };
};


export const acceptOffer = (
    order_id: string,
    container_id: string,
    offer_id: string,
    user_type: string
) => {
    const state = 'accept_offer';
    const url = getUrl() + `/customers/orders/${order_id}/container/`;
    return (dispatch: any) => {
        return axios({
            method: 'PATCH',
            url: url,
            data: {
                'state': state,
                'container': container_id,
                'offer': offer_id
            }
        })
            .then((response) => {
                logger.info(response);
                if (response.status === 200) {
                    notify(ENotifyType.success, 'Оффер успешно принят');
                    dispatch(getOffersInConsiderationForOrderProfile(
                        container_id,
                    ));
                }
                const message = user_type === 'customer' ? 'Вы успешно приняли оффер на заявку' : 'Вы успешно приняли заявку на оффер';
                notify(ENotifyType.success, message);
            })
            .catch((reason) => {
                failedRequest('PATCH http://api.goltruck.com/customers/orders/order_id/container/', reason);
            });
    };

};



export const proposeOrderOffer = (
    order_id: string,
    container_id: string,
    offer_id: string,
    user_type: string
) => {
    const state = 'make_offer';
    const url = getUrl() + `/customers/orders/${order_id}/container/`;
    console.log('proposeOrderForOffer');
    return (dispatch: any) => {
        return axios({
            method: 'PATCH',
            url: url,
            data: {
                'state': state,
                'container': container_id,
                'offer': offer_id
            }
        })
            .then((response) => {
                if (response.status === 200) {
                    dispatch(getNewOffersForOrderProfile(
                        container_id,
                    ));
                    dispatch(getOffersInConsiderationForOrderProfile(
                        container_id,
                    ));
                    const message = user_type === 'customer' ? 'Вы успешно подали заявку на оффер' : 'Вы успешно подали оффер на заявку';
                    notify(ENotifyType.success, message);
                }
            })
            .catch((reason) => {
                notify(ENotifyType.error, 'Не удалось подать заявку', 'Уже есть принятые офферы');
                failedRequest('PATCH http://api.goltruck.com/customers/orders/order_id/container/', reason);
            });
    };
};

export const cancelOrderOffer = (
    order_id: string,
    container_id: string,
    offer_id: string,
    user_type: string
) => {
    const state = 'cancel_offer';
    const url = getUrl() + `/customers/orders/${order_id}/container/`;
    console.log('proposeOrderForOffer');
    return (dispatch: any) => {
        return axios({
            method: 'PATCH',
            url: url,
            data: {
                'state': state,
                'container': container_id,
                'offer': offer_id
            }
        })
            .then((response) => {
                if (response.status === 200) {
                    dispatch(getNewOffersForOrderProfile(
                        container_id,
                    ));
                    dispatch(getOffersInConsiderationForOrderProfile(
                        container_id,
                    ));
                    const message = user_type === 'customer' ? 'Вы успешно отменили заявку на оффер' : 'Вы успешно отменили оффер на заявку';
                    notify(ENotifyType.success, message);
                }
            })
            .catch((reason) => {
                failedRequest('PATCH http://api.goltruck.com/customers/orders/order_id/container/', reason);
            });
    };
};



const failedRequest = (req, errors: any) => {
    logger.warn(req, errors);
};
