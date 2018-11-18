import * as React from 'react';
import ErrorBoundary from '../../UI/ErrorBoundary';

import {
    AppBar,
    IconButton,
    Tab,
    Tabs,
    Popper
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import * as styles from './style.css';
import {push} from 'connected-react-router';
import {connect} from 'react-redux';
import LogoutButton from '../logout-button';
import {UserRoles} from '../../../utils/userRoles';

import NotificationsListContainer from '../../notifications-list/notifications-main/index';

class MenuBar extends React.Component<any, any> {
    state = {
        tabIndex: 1,
        anchorEl: null,
    };

    handleChange = (event, tabIndex) => {
        this.setState({tabIndex});
    };

    handleClick = event => {
        const {currentTarget} = event;
        this.setState(state => ({
            anchorEl: state.anchorEl ? null : currentTarget,
        }));
    };

    public navigate = (link) => {
        return () => this.props.navigate(link);
    };

    public render() {
        const {anchorEl} = this.state;
        const open = Boolean(anchorEl);
        const id = open ? 'no-transition-popper' : null;

        return (
            <ErrorBoundary>
                <AppBar position="static">
                    <div className={styles.header}>
                        <div className={styles.leftPart}>
                            <IconButton aria-describedby={id} color="inherit" onClick={this.handleClick}>
                                <MenuIcon/>
                            </IconButton>
                            <Popper id={id} open={open} anchorEl={anchorEl} placement='bottom-start'>
                                {() => <NotificationsListContainer/>}
                            </Popper>
                        </div>
                        <div className={styles.rightPart}>
                            {this.renderTabs()}
                        </div>
                        <div style={{paddingTop: '0.4em', paddingRight: '0.5em'}}>
                            <LogoutButton/>
                        </div>

                    </div>
                </AppBar>
            </ErrorBoundary>
        );
    }


    private renderTabs = () => {
        let tabs;
        switch (this.props.user.type) {
            case UserRoles.customer :
                tabs = [
                    (<Tab key='openOrders' label="Открытые заявки" onClick={this.navigate('/app/orders')}/>),
                    (<Tab key='createOrders' label="Создвать заявку" onClick={this.navigate('/app/orders/create')}/>),
                    (<Tab key='inWork' label="В работе" disabled/>),
                    (<Tab key='map' label="Map View" disabled/>),
                    (<Tab key='profile' label="Личный кабинет" disabled/>),
                ];
                break;
            case UserRoles.carrier :
                tabs = [
                    (<Tab key='offers' label="Офферы" onClick={this.navigate('/app/offers')}/>),
                    (<Tab key='orders' label="Заявки" onClick={this.navigate('/app/orders')}/>),
                    (<Tab key='trucks' label="Автопарк" onClick={this.navigate('/app/trucks')}/>),
                    (<Tab key='profile' label="Личный кабинет" disabled/>),
                ];
                break;
            case UserRoles.driver :
                tabs = [
                    (<Tab key='map' label="Map View" disabled/>),
                    (<Tab key='profile' label="Личный кабинет" disabled/>),
                ];
                break;
            default :
                tabs = [];
        }

        return (
            <Tabs value={this.state.tabIndex} onChange={this.handleChange}>
                {tabs}
            </Tabs>

        );
    };

}


function mapStateToProps(state: any) {
    return {
        user: state.bootstrap.user,
        permissions: state.bootstrap.permissions,
    };
}

function mapDispatchToProps(dispatch: any) {
    return {
        navigate: (link) => {
            dispatch(push(link));
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuBar);