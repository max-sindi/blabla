import {push} from 'connected-react-router';
import axios from 'axios';

export class Setup {
  public token = null;
  constructor(private store) {
    this.store.subscribe(() => {
      const token = this.store.getState().auth.token;
      this.token = token;
    });
  }

  public rehydrated = () => {
      this.checkIfTokenExist();
      this.addAuthToken();
  }

  private checkIfTokenExist = () => {
    const initialState = this.store.getState();
    this.token = initialState.auth.token;
    if (!this.token) {
      this.store.dispatch(push('/login'));
    }
  };

  private addAuthToken = () => {
    axios.interceptors.request.use((config) => {
      if(this.token) {
        config.headers.Authorization = `JWT ${this.token}`;
      }
      return config;
    }, (error) => {
      // @todo do we need this empty catcher func?
      // Do something with request error
      // return Promise.reject(error);
    });
  }
}
