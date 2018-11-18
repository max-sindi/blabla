import * as React from 'react';
import { Route, Redirect } from 'react-router';
import { connect } from 'react-redux';

interface IPermitedRoute {
  isPermited: any;
  permissions: string[];
  component: any;
  exact?: boolean;
  path?: any 
}

const PermitedRoute = ({
  component: Component,
  isPermited,
  permissions,
  ...rest
}: IPermitedRoute) => {
  const render = (props: any) =>
    isPermited(permissions) ? (
      <Component {...props} />
    ) : (
      <Redirect
        to={{
          pathname: '/forbidden'
        }}
      />
    );
  return <Route {...rest} render={render} />;
};

function mapStateToProps(state: any) {
  const isPermited = (requiredPermissions: string[]) => {
    for (const permission of requiredPermissions) {
      if (
        state.bootstrap.permissions &&
        state.bootstrap.permissions.indexOf(permission) === -1
      ) {
        return false;
      }
    }
    return true;
  };
  return { isPermited };
}

export default connect(mapStateToProps)(PermitedRoute);
