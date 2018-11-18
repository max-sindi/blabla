import axios from 'axios';
import getUrl from './url';
import * as moment from 'moment';
import {push} from 'connected-react-router';
import {serialize} from '../utils/serialize';
import { locationTypes } from '../components/orders/locations/locationConfig';
import {debug} from 'util';
import {ENotifyType, default as notify} from "../utils/notify";
import logger from '../utils/logger';

export const LOCATIONS_VALIDATION_FAILED = 'LOCATIONS_VALIDATION_FAILED';

const generateLocationObject = (location: any) => {
  return {
    date: moment().format('YYYY-MM-DD[T]HH:mm'),
    type: location.sysname,
    country: location.value.country,
    region: location.value.region,
    city: location.value.city,
    address: `${location.value.street} ${location.value.number}`,
    description: '',
    point: {
      type: 'Point',
      coordinates: [location.value.latLng.lat, location.value.latLng.lng]
    }
  };
};

const containersTemplate = {
  line: 'trailerLine',
  type: 'trailerType',
  is_adr: 'adr',
  is_genset: 'genset',
  cargo_description: 'cargoName',
  cargo_weight: 'cargoWeight',
  cargo_package: 'packageType',
  trailer_type: 'platfroLength',
  is_trailer_protected: 'platfroProtection',
  is_trailer_telescopic: 'isTelescopic',
  truck_axles: 'truckAxels',
  trailer_axles: 'trailerAxels',
  genset_temperature: 'genset_temperature',
  price: 'price',
  id: 'uniqueId',
};

const getContainers = (order: any) => {
  return order.containers.map((container: any, index: any) => {
    return serialize(containersTemplate, container);
  });
};

const getLocations = (locations: any, isEdit?: boolean) => {
  let loading;

  // check if both loading and unloading types exist, otherwise throw validation error
  const hasntRequiredTypes = [0, 1].some( itemNumber => {
    const item = locations.find( item => +item.value === +itemNumber);
    if(!item) {
      return true;
    } else {
      if(item.value === 0 && !loading) {
        loading = item;
      }
      return false;
    }
  })

  if(hasntRequiredTypes) {

    throw 'В локациях отсутствует точка загрузки или выгрузки';
  } else if(!loading.date) {
    throw 'Точка загрузки должна содержать дату';
  }

  const locationsToSend = locations.map( (loc, index) => {
    const { address, city, region, country, latLng, value, date, phone_number, name, fromDatabase } = loc;
    let id;

    if(!latLng) {
      throw `Точка номер ${index + 1} не имеет локации`;
    } else if(!locationTypes[value]) {
      throw `Точка номер ${index + 1} не имеет типа`;
    }

    const { lat, lng } = latLng;

    if(fromDatabase) {
      id = loc.id;
    }

    return {
      id,
      address,
      city,
      country,
      region,
      contact_info: {
        phone_number,
        name
      },
      date: date && moment(date).format('YYYY-MM-DD[T]HH:mm'),
      point: {
        type: 'Point',
        coordinates: [lat, lng],
      },
      type: locationTypes[value].sysname,
    }
  })

  return locationsToSend;
};

const failOrderCreation = (errors: any) => {
  console.log(errors);
};

const serializeRequest = (order: any, isEdit?: boolean) => {
  try {
    return {
      loading: order.loadingType,
      type: order.transportationType,
      locations: getLocations(order.locations, isEdit),
      containers: getContainers(order),
      tags: order.tags.map(item => item.value)
    };
  } catch (error) {
    return { error };
  }

};

export const sendOrderRequest = (order: any) => {

  return (dispatch: any, getState: any) => {
    const serializedData = serializeRequest(order);

    if(serializedData.error) {
      return dispatch({type: LOCATIONS_VALIDATION_FAILED, payload: serializedData.error});
    }

    const url = getUrl() + `/customers/orders/`;
    return axios
      .post(url, serializedData)
      .then((response) => {
        notify(ENotifyType.success, 'Заявка успешно создана');
        dispatch(push('/app/orders'));
      })
      .catch((reason) => {
        notify(ENotifyType.error, 'Не удалось создать заявку',
            'Список контейнеров не может быть пустым');
        dispatch(failOrderCreation(reason.response.data));
      });
  };
};

export const editOrder = (params: any) => {
  return (dispatch: any) => {
    const serializedData = serializeRequest(params.order, true);

    if(serializedData.error) {
      return dispatch({type: LOCATIONS_VALIDATION_FAILED, payload: serializedData.error});
    }

    const url = getUrl() + `/customers/orders/${params.orderId}/`;
    return axios
      .put(url, serializedData)
      .then(response => {
        dispatch(push('/app/orders'));
      })
      .catch(reason => {
        dispatch(failOrderCreation(reason.response.data));
      })
  }
};

export const SET_ORDERS = 'SET_ORDERS';

const setOrders = (orders: any) => {
  return {
    type: SET_ORDERS,
    payload: orders
  };
};

export const getOrders = (params = null) => {
    const options = params ? {'params' : params} : null;
    return (dispatch: any, getState: any) => {
        const url = getUrl() + `/customers/orders/`;
        return axios.get(url, options)
            .then((response) => {
                dispatch(setOrders(response.data.results ? response.data.results : []));
            })
            .catch((reason) => {
                notify(ENotifyType.error, 'Не удалось получить список заявок');
                dispatch(failOrderCreation(reason.response.data));
            });
    };
};


export const getRegionsForOrders = (attributes = '') => {
    return (dispatch: any) => {
        const url = getUrl() + `/customers/orders/regions/?=${attributes}`;
        return axios.get(url)
            .then((response) => {
                dispatch(setRegionsForOrders(response.data));
            })
            .catch((reason) => {
                dispatch(failOrderCreation(reason.response.data));
            });
    };
};

export const SET_REGIONS_FOR_ORDERS = 'SET_REGIONS_FOR_ORDERS';

const setRegionsForOrders = (regions: any) => {
    return {
        type: SET_REGIONS_FOR_ORDERS,
        payload: regions
    };
};

export const SET_PROFILE = 'SET_PROFILE';

const setCurrentProfile = (profile: any) => {
  return {
    type: SET_PROFILE,
    payload: profile
  };
};

export const getProfile = (id: any) => {
  return (dispatch: any, getState: any) => {
    const {auth} = getState();
    const url = getUrl() + `/customers/orders/${id}/`;
    return axios.get(url)
      .then((response) => {
        dispatch(setCurrentProfile(response.data));
      })
      .catch((reason) => {
        logger.warn(reason.response);
      });
  };
};

export const RESET_ORDER_PAGE = 'RESET_ORDER_PAGE';

export const resetOrderPage = () => {
  return (dispatch: any) => dispatch({type: RESET_ORDER_PAGE})
};

export const deleteOrder = (
    order_id: string,
    fromOrdersMain?: boolean
) => {
    const url = getUrl() + `/customers/orders/${order_id}/`;
    return (dispatch: any) => {
        return axios({
            method: 'DELETE',
            url: url
        })
            .then((response) => {
                logger.info(response);
                if (response.status === 200) {
                    notify(ENotifyType.success, 'Вы успешно удалили заявку');
                    if (fromOrdersMain) {
                      dispatch(getOrders());
                    }
                    dispatch(push('/app/orders'));
                }
            })
            .catch((reason) => {
                notify(ENotifyType.error, 'Удалить заявку не удалось', reason.response.data.non_field_errors);
            });
    };
};

export const getTrucksForOrderProfile = (id: any) => {
    return (dispatch: any) => {
        const url = getUrl() + `/customers/orders/${id}/routes/`;
        return axios.get(url)
            .then((response) => {
                dispatch(setTrucksForOrderProfile(response.data));
            })
            .catch((reason) => {
                console.log(reason.response);
            });
    };
};

export const SET_TRUCKS_FOR_ORDER_PROFILE = 'SET_TRUCKS_FOR_ORDER_PROFILE';

const setTrucksForOrderProfile = (profile: any) => {
    return {
        type: SET_TRUCKS_FOR_ORDER_PROFILE,
        payload: profile
    };
};
