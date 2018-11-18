import {
    SET_ORDERS,
    SET_PROFILE,
    LOCATIONS_VALIDATION_FAILED,
    SET_REGIONS_FOR_ORDERS,
    SET_TRUCKS_FOR_ORDER_PROFILE,
    RESET_ORDER_PAGE
} from '../actions/orders';

import {ENotifyType, default as notify} from "../utils/notify";

interface IOrder {
    id : string,
    type: string,
    customer: any,
    locations: any,
}

interface IRegion {
    region: string
}

interface IState {
    list : IOrder[],
    locationsError?: null,
    regions: IRegion[],
    currentProfile: {},
    trucksForCurrentProfile: []
}


const defaultState: IState = {
    list: [],
    locationsError: null,
    regions: [],
    currentProfile: {},
    trucksForCurrentProfile: []
};

export default (state: IState = defaultState, action: { type: string, payload: any }) => {
    switch(action.type){
      case  SET_ORDERS:
        return { ...state,  list: action.payload};

        case  SET_PROFILE:
            return {...state, currentProfile: action.payload};

        case LOCATIONS_VALIDATION_FAILED: {
          notify(ENotifyType.error, action.payload);
          return state;
        }

        case  SET_REGIONS_FOR_ORDERS:
          return {...state, regions: action.payload};

        case  SET_TRUCKS_FOR_ORDER_PROFILE:
            return {...state, trucksForCurrentProfile: action.payload};

        case RESET_ORDER_PAGE: {
          return defaultState;
        }

        default: return state;
    }
}
