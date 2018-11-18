import * as Sentry from '@sentry/browser';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { persistReducer, persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web and AsyncStorage for react-native

import App from './components/app';
import Bootstrap from './components/bootstrap';
import ForbiddenPage from './components/frobidenPage';
import LoginRoute from './components/login-route';
import ProtectedRoute from './components/protected-route';
import Registration from './components/registration';
import SuccessRegistration from './components/success-registration';
import CarrierModule from "./components/trucks/index";

import { Provider } from 'react-redux';
import {applyMiddleware, compose, createStore} from 'redux';
import thunk from 'redux-thunk';

import Alert from 'react-s-alert';
// import 'react-s-alert/dist/s-alert-default.css';


import {
  ConnectedRouter,
  connectRouter,
  routerMiddleware,
} from 'connected-react-router';
import createBrowserHistory from 'history/createBrowserHistory';
import { Redirect, Route, Switch } from 'react-router';

import rootReducer from './reducers';
import registerServiceWorker from './registerServiceWorker';

import './index.css';

import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faBomb,
  faBox,
  faBoxes,
  faBoxOpen,
  faClipboardCheck,
  faClipboardList,
  faDollarSign,
  faDolly,
  faHandshake,
  faPallet,
  faPlane,
  faSnowflake,
  faSun,
  faTruck,
  faWeight,
  faWheelchair,
  faShoppingBasket,
} from '@fortawesome/free-solid-svg-icons';
import {Setup} from './setup';
import OffersModule from "./components/offers/index";

library.add(
  faDolly,
  faPallet,
  faClipboardCheck,
  faClipboardList,
  faBox,
  faBoxes,
  faHandshake,
  faTruck,
  faDollarSign,
  faWeight,
  faPlane,
  faSun,
  faBomb,
  faBoxOpen,
  faSnowflake,
  faWheelchair,
  faShoppingBasket,
);

import './utils/axiosMiddleware';
import './utils/logger'

console.log('process', process);

if (process.env.SENTRY_DSN) {
  console.log('SENTRY INIT');
  Sentry.init({ dsn: process.env.SENTRY_DSN});
}


const history = createBrowserHistory();
const middleware = routerMiddleware(history);

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // FOR REDUX DEVTOOLS

const store = createStore(
  connectRouter(history)(persistedReducer),
  composeEnhancers(
    applyMiddleware(middleware, thunk),
  ),
);

export { store };

const setup = new Setup(store);
const persistor = persistStore(store, null, setup.rehydrated);




const ErrorPage = () => {
  return (
    <div>
      <h1>404 Error</h1>
    </div>
  );
};

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Bootstrap>
        <ConnectedRouter history={history}>
          <Switch>
            <Route path='/registration' component={Registration} />
            <Route
              path='/succcess-registration'
              component={SuccessRegistration}
            />
            <Route exact={true} path='/login' component={LoginRoute} />
            <Route exact={true} path='/forbidden' component={ForbiddenPage} />
            <ProtectedRoute
              permissions={['user.order.create']}
              path='/app'
              component={App}
            />
            {/*<ProtectedRoute*/}
              {/*permissions={['user.offers.create']}*/}
              {/*path='/offers'*/}
              {/*component={OffersModule}*/}
            {/*/>*/}
            {/*<Route*/}
              {/*path='/offers'*/}
              {/*component={OffersModule}*/}
            {/*/>*/}
            <Route
              exact
              path='/'
              render={() => <Redirect to='/app/orders' />}
            />
            <Route
              path='/carrier'
              component = {CarrierModule}
            />
            <Route component={ErrorPage} />
          </Switch>
        </ConnectedRouter>
        <Alert stack={{limit: 3, spacing: 50}} />
      </Bootstrap>
    </PersistGate>
  </Provider>,
  document.getElementById('root'),
);

registerServiceWorker();
