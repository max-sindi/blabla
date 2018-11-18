import * as React from 'react';
import * as styles from './style.css';
import CircularProgress from '@material-ui/core/CircularProgress';
import NewOffers from './NewOffers';
import ReviewingOffers from './ReviewingOffers';

class Offers extends React.Component<any, {}> {

  render() {
    const { offersType, data, acceptOffer, isLoading } = this.props;
    let OffersComponent;

    if(isLoading) {
      return <CircularProgress size={50} classes={{root: styles.offers__loaderWrap}}/>
    }

    switch(offersType) {
      case 'new':
        OffersComponent = NewOffers;
        break;
      case 'reviewing':
        OffersComponent = ReviewingOffers;
        break;
    }

    return (
      <div className={styles.offers_wrap}>
        {data.offers.map( item => {
          return (
            <OffersComponent
              {...this.props}
              item={item}
              // was noticed items with same ids
              key={item.date + (item.id || item.offer.id)}
            />
          )
        })}
      </div>
    )
  }
}

export default Offers;
