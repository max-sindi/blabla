import {
  LOCATION_ADD_NEW,
  LOCATION_MOVE_LOCATION_IN_LIST,
  LOCATION_SELECT_LOCATION,
  LOCATION_DELETE_LOCATION,
  LOCATION_CHANGE_TYPE,
  LOCATION_CHANGE_FIELD,
 } from '../actions/locations';

import { SET_PROFILE, RESET_ORDER_PAGE } from '../actions/orders';
import { locationTypes } from '../components/orders/locations/locationConfig';

interface ILocation {
  lat: number;
  lng: number;
}

interface ILocationItem {
  latLng?: ILocation;
  id: string|number;
  // value is a number in locationTypes array in '../components/orders/locations/locationConfig'
  value?: number;
  county?: string;
  region?: string;
  city?: string;
  address?: string;
  point?: number[];
  type?: string;
  date?: string;
  name?: string;
  phone_number?: string;
  fromDatabase: boolean;
}

interface ILocationsReducerState {
  allLocations: ILocationItem[];
}

const defaultState:ILocationsReducerState = {
  allLocations: [
    {
      // loading
      value: 0,
      id: '1',
      fromDatabase: false,
    },
    {
      // unloading
      value: 1,
      id: '2',
      fromDatabase: false,
    },
  ],
}

const locationFromServerToRedux = (locations) => {

    return locations.map(loc => {
        return {
            id: loc.id,
            value: locationTypes.findIndex( item => item.sysname === loc.type),
            country: loc.country,
            region: loc.region,
            city: loc.city,
            address: loc.address,
            date: loc.date && loc.date.split(' ')[0],
            phone_number: loc.contact_info.phone_number,
            name: loc.contact_info.name,
            latLng: {
                lat: loc.point.coordinates[0],
                lng: loc.point.coordinates[1],
            },
            fromDatabase: true,
        }
    })
};

export default (state = defaultState, action) => {
  switch(action.type) {
    case LOCATION_ADD_NEW: {
      const allLocations = state.allLocations.concat();
      allLocations.push({ id: Date.now(), fromDatabase: false });

      return {
        ...state,
        allLocations,
      }
    }

    case LOCATION_MOVE_LOCATION_IN_LIST: {
      const { direction, index } = action;
      const allLocations = state.allLocations.concat();
      allLocations[index] = state.allLocations[index + direction];
      allLocations[index + direction] = state.allLocations[index];

      return {
        ...state,
        allLocations,
      }
    }

    case LOCATION_SELECT_LOCATION: {
      const { value, index } = action;
      const allLocations = state.allLocations.concat();
      allLocations[index].latLng = value;

      return {
        ...state,
        allLocations,
      }
    }

    case LOCATION_DELETE_LOCATION: {
      const { index } = action;
      const allLocations = state.allLocations.concat();
      allLocations.splice(index, 1);

      return {
        ...state,
        allLocations,
      }
    }

    case LOCATION_CHANGE_FIELD: {
      const { field, changes, index, isDeep } = action;
      const allLocations = state.allLocations.concat();
      let locationToChange = Object.assign({}, allLocations[index]);

      if(!isDeep) {
        locationToChange = Object.assign({}, locationToChange, changes);
      } else {
        locationToChange[field] = changes;
      }

      allLocations[index] = locationToChange;

      return {
        ...state,
        allLocations
      }
    }

    case LOCATION_CHANGE_TYPE: {
      const { value, index } = action;
      const allLocations = state.allLocations.concat();
      allLocations[index].value = value;

      return {
        ...state,
        allLocations,
      }
    }

    case SET_PROFILE: {
      return {
        ...state,
        allLocations: locationFromServerToRedux(action.payload.locations)
      }
    }

    case RESET_ORDER_PAGE: {
      return defaultState;
    }

    default:
      return state;
  }
}
