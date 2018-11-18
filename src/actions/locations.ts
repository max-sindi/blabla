export const LOCATION_ADD_NEW = 'LOCATION_ADD_NEW';
export const LOCATION_MOVE_LOCATION_IN_LIST = 'LOCATION_MOVE_LOCATION_IN_LIST';
export const LOCATION_SELECT_LOCATION = 'LOCATION_SELECT_LOCATION';
export const LOCATION_DELETE_LOCATION = 'LOCATION_DELETE_LOCATION';
export const LOCATION_CHANGE_FIELD = 'LOCATION_CHANGE_FIELD';
export const LOCATION_CHANGE_TYPE = 'LOCATION_CHANGE_TYPE';

export const addNewLocation = () => ({ type: LOCATION_ADD_NEW });
export const deleteLocation = index => ({ type: LOCATION_DELETE_LOCATION, index });

export const moveLocationInList = ({ direction, index }) => ({
  type: LOCATION_MOVE_LOCATION_IN_LIST,
  direction,
  index,
})

export const selectLocation = ({ value, index }) => ({
  type: LOCATION_SELECT_LOCATION,
  value,
  index,
})

export const changeLocationType = (params) => ({
  type: LOCATION_CHANGE_TYPE,
  ...params
})

export const changeLocationField = (params) => ({
  type: LOCATION_CHANGE_FIELD,
  ...params,
})
