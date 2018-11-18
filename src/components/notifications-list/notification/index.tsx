import * as React from 'react';
import {INotification} from '../../../actions/notifications';
import TestTemplateNotification from '../test-temlate';
import config from '../config';

interface ITemplateNotificationProps {
    notification: INotification
}

class Notification extends React.Component<ITemplateNotificationProps, any> {
    constructor(props: ITemplateNotificationProps) {
        super(props);
    }

    public render() {
        const {notification} = this.props;
        let NotificationTemplate;

        switch(notification.name) {
            case config.customer_make_offer:
                NotificationTemplate = TestTemplateNotification;
                break;
            case config.customer_accept_offer:
                NotificationTemplate = TestTemplateNotification;
                break;
            case config.carrier_accept_offer:
                NotificationTemplate = TestTemplateNotification;
                break;
        }

        return (
            <NotificationTemplate notification={notification}/>
        );
    }
}

export default Notification;