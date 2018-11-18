import * as React from 'react';
import {getNotificationsAction, INotification} from '../../../actions/notifications';
import {push} from 'connected-react-router';
import {connect} from 'react-redux';

interface ITemplateNotficationProps {
    notification: INotification
}

class TestTemplateNotification extends React.Component<ITemplateNotficationProps, any> {
    constructor(props: ITemplateNotficationProps) {
        super(props);
    }

    public render() {
        const {notification} = this.props;

        return (
            <div style={{cursor: 'pointer'}}>
                <div>
                    Тестовое сообщение
                </div>
                <div>
                    {notification.date}
                </div>
                <div>
                    {notification.data.user.first_name} {notification.data.user.last_name}
                </div>
                <br/>
            </div>
        );
    }
}

function mapStateToProps(state: any) {
    return {
    };
}

function mapDispatchToProps(dispatch: any) {
    return {

        navigateTo: (link: string) => {
            dispatch(push(link));
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(TestTemplateNotification);
