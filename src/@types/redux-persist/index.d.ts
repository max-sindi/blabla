declare module "redux-persist/es/integration/react" {

import * as React from 'react'; // eslint-disable-line import/no-unresolved
// import type { Node } from 'react' // eslint-disable-line import/no-unresolved
// import type { Persistor } from '../types'

type Props = {
  onBeforeLift?: Function,
  children?: Node | Function,
  loading?: Node,
  persistor: any,
};

type State = {
  bootstrapped: boolean,
};

export class PersistGate extends React.PureComponent<Props, State> {}

}