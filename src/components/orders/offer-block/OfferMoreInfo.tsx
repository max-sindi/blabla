import * as React from 'react';
import * as styles from './style.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Button from '@material-ui/core/Button';
import {connect} from 'react-redux';

class OfferMoreInfo extends React.Component<any, {}> {

    acceptOffer = () => {
        const {order_id, container_id} = this.props;
        const {id} = this.props.item;
        this.props.acceptOffer(order_id, container_id, id);
    };

    render() {
        // const { item, item: { location }, container_line, container_type } = this.props;
        const {item, currentProfile, currentUser} = this.props;

        return (
            <div className={styles.offers__innerRow}>
                {/* <OfferLowInfo {...this.props} /> */}
                Данные по машинам
                <div className={styles.offers__flex}>
                    <div className={styles.newOffers__trucks}>
                        1x
                        <FontAwesomeIcon icon='truck' size='2x'/>
                    </div>
                    {item.driver && (
                        <div className={styles.newOffers__someName}>{item.driver.name}</div>
                    )}

                    {item.driver && (
                        <div className={styles.newOffers__someName}>{item.driver.contact_phone}</div>
                    )}

                    <div className={styles.newOffers__innerItem}>
                        <Button
                            onClick={() => this.props.onOpenCurrentLocation(item.location)}
                        >
                            Текущее местоположение
                        </Button>
                    </div>

                </div>

                <div className={styles.offers__flex}>
                    <div className={styles.newOffers__innerItem}>
                        Предлагается на :
                        1x{item.container.type}
                    </div>

                    {this.props.currentProfile.containers.find(container => container.id === this.props.container_id) &&
                    <div className={styles.newOffers__innerItem}>
                        <FontAwesomeIcon icon='shopping-basket' size='2x'/>
                        {this.props.currentProfile.containers.find(container => container.id === this.props.container_id).cargo_description}
                    </div>}

                    {this.props.currentProfile.containers.find(container => container.id === this.props.container_id) &&
                    <div className={styles.newOffers__innerItem}>
                        <FontAwesomeIcon icon='dollar-sign' size='2x'/>
                        {this.props.currentProfile.containers.find(container => container.id === this.props.container_id).price}USD
                    </div>}


                    <div className={styles.newOffers__innerItem}>
                        {item.truck && item.truck.registration_number}
                    </div>

                    <div className={styles.newOffers__innerItem}>
                        {item.truck && item.truck.trailer.registration_number}
                    </div>

                </div>
            </div>
        );
    }

}

export default connect(
    (state: any) => ({
        order_id: state.orders.currentProfile.id,
        container_id: state.newOffersForOrderProfile.container_id,
        currentProfile: state.orders.currentProfile,
        currentUser: state.bootstrap.user
    }),
)(OfferMoreInfo);
