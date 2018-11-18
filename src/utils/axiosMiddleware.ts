import axios from 'axios';
import { Service } from 'axios-middleware';
import { store } from '../';
import { logoutAction } from '../actions/auth';

const service = new Service(axios);

service.register({
    onResponseError(error) {
      const { response } = error;
      let status;

      if(!response || !store) {
        return error;
      }

      status = response.status;

      switch(status) {
        case 401: {
          store.dispatch( logoutAction() );
          break;
        }

        case 403: {
          alert('Нет доступа к этому действию');
          break;
        }
      }

      throw error;
    }
});
