import * as React from 'react';
import * as styles from './style.css';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

class OfferLowInfo extends React.Component<any, {}> {

  clickHandler = e => {
    e.stopPropagation();
    this.props.clickHandler(this.props.item);
  }

  render() {
    const {
      item,
        item: {
      location
        },
      button,
      isButtonDisabled,
      isFirstItem,
      uniqueButton,
     } = this.props;

    return (
      <React.Fragment>
        <Paper classes={{ root: styles.offer__date }}>
          {new Date(item.date).toLocaleDateString()}
        </Paper>

        {/* number of trucks and truck icon */}
        <div className={styles.newOffers__trucks}>
          <FontAwesomeIcon icon='truck' size='2x' />
        </div>

        {/* carrier name and icon */}
        <div className={styles.newOffers__carrierWrap}>
          <FontAwesomeIcon icon='wheelchair' size="2x"/>
          {item.carrier && (
            <div className={styles.newOffers__someName}>{item.carrier.name}</div>
          )}
        </div>

        {/* container */}
        <div className={styles.newOffers__containerWrap}>
          <FontAwesomeIcon icon="box-open" size="2x"/>
          <div className={styles.newOffers__someName}>
            { `${item.container.line} / ${item.container.type}` }
          </div>
        </div>

        {/* Location */}
        { location && location.city && (
          <div className={styles.newOffers__cityWrap}>
            {location.city}
          </div>
        )}

        {/* button */}
        {button &&  (
          <Button
            color="primary"
            variant="contained"
            onClick={this.clickHandler}
            disabled={isButtonDisabled && !isFirstItem}
          >
            {uniqueButton || button}
          </Button>
        )}
      </React.Fragment>
    )
  }

}

export default OfferLowInfo;
