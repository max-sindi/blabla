import { combineReducers } from 'redux';

import registration from './registration';
import auth from './auth';
import bootstrap from './bootstrap';
import orders from './orders';
import offers from './offers';
import trucks from "./trucks";
import locations from './locations';
import notifications from "./notifications";
import commonEnums from './common-enums';
import {newOffersForOrderProfile, offersInConsiderationForOrderProfile} from './offeres-for-order-profile';


// combine all reducers we have
export default combineReducers({
    registration,
    auth,
    bootstrap,
    orders,
    offers,
    trucks,
    commonEnums,
    locations,
    notifications,
    newOffersForOrderProfile,
    offersInConsiderationForOrderProfile
});
