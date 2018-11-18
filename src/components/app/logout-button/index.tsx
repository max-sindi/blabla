import * as React from 'react';
import { connect } from 'react-redux';
import { logoutAndRedirectAction } from '../../../actions/auth';
import { logoutAction } from '../../../actions/auth';
import {push} from 'connected-react-router';
import logger from '../../../utils/logger';

import * as styles from './style.css';
import AddAlert from '@material-ui/icons/AddAlert';
import {
  IconButton,
  Button,
} from '@material-ui/core';


interface IPropsLogout {
  logout: any;
}


class LogoutButton extends React.Component<any, any> {

  public render() {
    return (
      <div className='logoutBtn'>
          <Button variant="outlined"
                  color="secondary"
                  size="small"
                  onClick={this.onLogoutBtn}
          >
                Logout
           </Button>
      </div>);
  }

  private onLogoutBtn = () => {
    logger.debug('onLogoutBtn()', this);
    this.props.logout();
  }
};


function mapStateToProps(state: any) {
  return {
  };
}

function mapDispatchToProps(dispatch: any) {
  return {
    logout: () => {
      // dispatch(logoutAndRedirectAction());

      dispatch(logoutAction());
      dispatch(push('/login'));
    }
  };

}

export default connect(mapStateToProps, mapDispatchToProps)(LogoutButton);
