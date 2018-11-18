import axios from 'axios';
import getUrl from './url';
import { push } from 'connected-react-router';

import { serialize } from '../utils/serialize';
import {ENotifyType, default as notify} from "../utils/notify";

export const START_SAVE_USER = 'START_SAVE_USER';
export const SUCCESS_REGISTRATION_RESPONSE = 'SUCCESS_REGISTRATION_RESPONSE';
export const FAIL_REGISTRATION_RESPONSE = 'FAIL_REGISTRATION_RESPONSE';

type FieldsError = string[];

const failRegistration = (errors: any) => {
  return {
    type: FAIL_REGISTRATION_RESPONSE,
    payload: errors
  };
};

const serializeTemplate = {
  first_name: 'userName',
  last_name: 'userSurname',
  phone_number: 'phoneNumber',
  password: 'password',
  email: 'email',
  type: 'userType',
  carrier_name : 'carrierName'
};

const deserialize = (serializeTemplate: any, fields: any) => {
  const result: { notFormRelatedErrors?: FieldsError[] } = {};
  for (const item of Object.keys(fields)) {
    if (serializeTemplate[item]) {
      result[serializeTemplate[item]] = fields[item];
    } else {
      result.notFormRelatedErrors = [...fields[item]];
    }
  }
  return result;
};

export const sendRegistrationRequest = (userData: any) => {
  return (dispatch: any) => {
    axios
      .post(
        getUrl() + '/users/registration/password/',
        serialize(serializeTemplate, userData)
      )
      .then((response) => {
        notify(ENotifyType.error, 'Регистрация прошла успешно');
        dispatch(push('/succcess-registration'));
      })
      .catch((reason) => {
        notify(ENotifyType.error, 'Не удалось зарегистрироваться');
        dispatch(
          failRegistration(deserialize(serializeTemplate, reason.response.data))
        );
      });
  };
};


