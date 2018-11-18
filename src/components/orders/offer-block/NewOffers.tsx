import * as React from 'react';
import * as styles from './style.css';
import OfferLowInfo from './OfferLowInfo';
import {connect} from 'react-redux';
import { proposeOrderOffer} from '../../../actions/offers-for-order-profile';
import logger from '../../../utils/logger';

class NewOffers extends React.Component<any, {}> {

    clickHandler = (item: any) => {
        const {order_id, container_id, proposeOrderOffer, currentUser} = this.props;
        proposeOrderOffer(order_id, container_id, item.id, currentUser.type);
    };

    render() {
        const {item, data, acceptOffer, currentUser} = this.props;

        return (
            <div className={styles.newOffers__item}>
                <OfferLowInfo
                    item={item}
                    data={data}
                    acceptOffer={acceptOffer}
                    button={currentUser.type === 'customer' ? 'Предложить заявку' : 'Предложить офер'}
                    clickHandler={this.clickHandler}
                />
            </div>
        );
    }

}

function mapStateToProps(state: any) {
    return {
        order_id: state.orders.currentProfile.id,
        container_id: state.newOffersForOrderProfile.container_id,
        currentUser: state.bootstrap.user
    };
}

function mapDispatchToProps(dispatch: any) {
    return {
        proposeOrderOffer: (order_id: string, container_id: string, id: any, user_type: string) => {
            dispatch(proposeOrderOffer(order_id, container_id, id, user_type));
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewOffers);