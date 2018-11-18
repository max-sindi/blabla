import * as React from 'react';
import {push} from 'connected-react-router';
import {connect} from 'react-redux';
import {Route, Switch} from 'react-router';
import {Redirect} from 'react-router';

import Orders from '../orders';
import MenuBar from './menuBar';
import OffersModule from '../offers/index';
import CarrierModule from '../trucks/index';
import NotificationsListContainer from '../notifications-list/notifications-main/index';

import * as styles from './style.css';
import Grid from '@material-ui/core/Grid';
import Popper from '@material-ui/core/Popper';

class App extends React.Component<any, any> {
    state = {
        tabIndex: 1,
        anchorEl: null,
        open: false
    };

    handleChange = (event, tabIndex) => {
        this.setState({tabIndex});
    };

    handleClickOnUpdates = event => {
        this.setState({anchorEl: event.currentTarget});
    };

    handleClose = () => {
        this.setState({anchorEl: null});
    };

    public navigate = (link) => {
        return () => this.props.navigate(link);
    };

    public render() {
        const {anchorEl} = this.state;
        if (this.props.user && this.props.auth.token) {
            return (
                <div>
                    <MenuBar/>

                    <Grid container={true}
                          direction='row'
                          alignItems='flex-start'
                    >
                        <Grid item={true}
                              xs={12}>
                            <div className="mainArea">
                                <Switch>
                                    <Route path="/app/orders" component={Orders}/>
                                    <Route path="/app/offers" component={OffersModule}/>
                                    <Route path="/app/trucks" component={CarrierModule}/>
                                </Switch>
                            </div>
                        </Grid>
                    </Grid>
                </div>
            );
        } else {
            return <Redirect to='/login'/>;
        }
    }
}


function mapStateToProps(state: any) {
    return {
        auth: state.auth,
        user: state.bootstrap.user
    };
}

function mapDispatchToProps(dispatch: any) {
    return {
        navigate: (link) => {
            dispatch(push(link));
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);