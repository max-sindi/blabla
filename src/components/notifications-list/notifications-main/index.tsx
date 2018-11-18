import * as React from 'react';
import ErrorBoundary from '../../UI/ErrorBoundary';

import {getNotificationsAction, INotification} from '../../../actions/notifications';
import {connect} from 'react-redux';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import RefreshIcon from '@material-ui/icons/Refresh';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import {push} from 'connected-react-router';

import Notification from '../notification/index';

export interface INotificationsListContainerProps {
    getNotifications: () => any;
    notifications: INotification[];
}


class NotificationsListContainer extends React.Component<INotificationsListContainerProps, any> {
    constructor(props: INotificationsListContainerProps) {
        super(props);
    }

    public componentDidMount = () => {
        this.props.getNotifications();
    };

    private onRefresh = () => {
        this.props.getNotifications();
    };

    private renderList = () => {
        return this.props.notifications.map(notification => <Notification key={notification.id} notification={notification}/>);
    };

    public render() {
        return (
            <ErrorBoundary>
                <Paper
                    style={{height: '850px', padding: '1em', width: '21em'}}
                >
                    <Grid className="notifications-list-container"
                          container
                          justify="center"
                          alignItems="flex-start"
                          direction="column"
                          spacing={16}
                    >
                        <Grid container
                              direction="row"
                              alignContent="center"
                        >
                            <Grid item xs={10}>
                                <Typography variant='title'>
                                    Уведомления
                                </Typography>
                                <br/>
                                <br/>
                            </Grid>
                            <Grid item xs={1}>
                                <IconButton>
                                    <RefreshIcon onClick={this.onRefresh}></RefreshIcon>
                                </IconButton>
                            </Grid>
                        </Grid>

                        <Grid className="notifications-list"
                              container={true}
                              direction="column"
                        >
                            {this.renderList()}
                        </Grid>
                    </Grid>
                </Paper>
            </ErrorBoundary>
        );
    }
}


function mapStateToProps(state: any) {
    return {
        notifications: state.notifications.list,
    };
}

function mapDispatchToProps(dispatch: any) {
    return {
        getNotifications: () => {
            dispatch(getNotificationsAction());
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsListContainer);
