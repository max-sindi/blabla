import * as React from 'react';
import * as styles from './style.css';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import OfferLowInfo from './OfferLowInfo';
import OfferMoreInfo from './OfferMoreInfo';
import { connect } from 'react-redux';
import config from './config';
import {acceptOffer, cancelOrderOffer} from '../../../actions/offers-for-order-profile';

class ReviewingOffers extends React.Component<any, {}> {

  offeredClickHandlerAccept = (item: any) => {
    const { order_id, container_id, acceptOffer,  currentUser } = this.props;
    acceptOffer(order_id, container_id, item.id, currentUser.type);
  };

    offeredClickHandlerCancel = (item: any) => {
        const { order_id, container_id, cancelOrderOffer, currentUser } = this.props;
        cancelOrderOffer(order_id, container_id, item.id, currentUser.type);
    };

  render() {
    const { item, data, acceptOffer } = this.props;
    const isAccepted = item.state === config.accepted;
    const isAllowAccept  = item.is_allow_accept;
    const Header = isAccepted ? ExpansionPanelSummary : React.Fragment;
    const Wrapper = isAccepted ? ExpansionPanel : React.Fragment;
    const isHasAccepted = data.offers[0].state === config.accepted;
    const isFirstItem = isHasAccepted && data.offers[0] === item;

    return (
      <div className={`${styles.newOffers__item} ${isAccepted ? styles.newOffers__itemExpanding : ''}`}>
        <Wrapper>
          <Header>
            <OfferLowInfo
              item={item.offer}
              data={data}
              button={isAllowAccept ? 'Подвердить' : 'Отменить'}
              clickHandler={isAllowAccept ? this.offeredClickHandlerAccept : this.offeredClickHandlerCancel }
              isButtonDisabled={!isFirstItem && isHasAccepted}
              isFirstItem={isFirstItem}
              uniqueButton={isFirstItem && 'Отменить'}
            />
          </Header>
          {isAccepted && (
            <ExpansionPanelDetails>
              <OfferMoreInfo item={item.offer}  acceptOffer={acceptOffer} onOpenCurrentLocation={this.props.onOpenCurrentLocation}/>
            </ExpansionPanelDetails>
          )}
        </Wrapper>
      </div>
    )
  }

}

function mapStateToProps(state: any) {
    return {
        order_id: state.orders.currentProfile.id,
        container_id: state.newOffersForOrderProfile.container_id,
        container: state.orders.currentProfile,
        currentUser: state.bootstrap.user
    };
}

function mapDispatchToProps(dispatch: any) {
    return {
        acceptOffer: (order_id: string, container_id: string, id: any, user_type: string) => {
            dispatch(acceptOffer(order_id, container_id, id, user_type));
        },
        cancelOrderOffer: (order_id: string, container_id: string, id: any, user_type: string) => {
            dispatch(cancelOrderOffer(order_id, container_id, id, user_type));
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ReviewingOffers);
