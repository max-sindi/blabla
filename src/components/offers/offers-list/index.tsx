import * as React from 'react';
import ErrorBoundary from "../../UI/ErrorBoundary";
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import {connect} from 'react-redux';
import Grid from '@material-ui/core/Grid';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete';
import {push} from 'connected-react-router';
import {IOffer, getOffersAction, deleteOfferAction} from '../../../actions/offers';
import * as styles from './style.css';
import CreateOffer from '../create-offer';
import OffersFilter from '../offers-filter';
import {ITruckInfo} from "../../../actions/trucks";
import logger from '../../../utils/logger';


interface IOffersListProps {
  offers: IOffer[];
  getOffers: () => void;
  deleteOffer: (offerId: string) => void;
}

interface IOfferListState {
  offerModalVisible: boolean;
}


class OffersList extends React.Component<IOffersListProps> {
  props: IOffersListProps;
  state: IOfferListState = {
    offerModalVisible : false,
  };
  selectedOffer: IOffer;

  constructor(props: IOffersListProps) {
    super(props);
  }


  public componentDidMount() {
    this.props.getOffers();
  }



  public render() {
    return (
      <Grid>
        <Paper>
          <CardContent>
            <Grid container={true} direction="column">
              <Grid container={true} direction="row">
                <Grid item={true}>
                  <Typography variant="headline">Офферы</Typography>
                </Grid>
                <Grid container className={styles.iconContainerRight}>
                  <IconButton
                    color="primary"
                    aria-label="Add Offer"
                    onClick={this.onAddOffer}
                  >
                    <AddIcon/>
                  </IconButton>
                </Grid>
              </Grid>
              <Grid>
                <div>
                  <OffersFilter/>
                </div>

                {this. renderTable()}
              </Grid>
            </Grid>
          </CardContent>
        </Paper>

        <CreateOffer
          open={this.state.offerModalVisible}
          offer={this.selectedOffer}
          onClose={this.toggleCreateOfferModal}
        />


      </Grid>

    );
  }

  renderTable() {
    return (
      <ErrorBoundary>
        <table>
          <thead>
          <tr>
            <td>Тип оффера</td>
            <td>Регион</td>
            <td>Дата</td>
            <td>Водитель</td>
            <td>Тягач</td>
            <td>Прицеп</td>
            <td>Линия</td>
            <td>Тип контейнера</td>
            <td>Платформа</td>
          </tr>
          </thead>
          <tbody>
          { this.renderRows()}
          </tbody>
        </table>
      </ErrorBoundary>
    );
  }

  renderRows() {
    logger.debug(this.props);


    const rows = this.props.offers ?
        this.props.offers.map(offer => {
          return (<tr key={offer.id}>{this.renderOfferRow(offer)}</tr>);
        }) : [];

    return rows;
  }


  renderOfferRow(offer: IOffer) {
    const date = new Date(offer.date);
    const dateStr = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();

    const truckStr = offer.truck ? offer.truck.registration_number : '——';
    let trailerStr = '——', platformStr = '——';
    if (offer.truck && offer.truck.trailer) {
      trailerStr = offer.truck.trailer.registration_number;
      platformStr = offer.truck.trailer.type;
    }

    const rowData = [
      { key : 'offer_type', val :  'Стандартный'},
      { key : 'region', val :      offer.location.region},
      { key : 'date', val :        dateStr},
      { key : 'driver', val :       '——'},
      { key : 'truck', val :       truckStr},
      { key : 'trailer', val :     trailerStr},
      { key : 'line', val :        offer.container ? offer.container.line : '——'},
      { key : 'container', val :   offer.container ? offer.container.type : '——'},
      { key : 'platform', val :    platformStr},
    ];

    const row = rowData.map((tuple) => {
      return (<td key={tuple.key}> {tuple.val} </td>);
    });


    row.push(<td key='edit'>
      <IconButton
        onClick={this.onOfferEdit.bind(this, offer)}
        color="primary"
        aria-label="Edit"
      >
        <Edit/>
      </IconButton>
    </td>);

    row.push(<td key='delete'>
      <IconButton
        onClick={this.onOfferDelete.bind(this, offer)}
        color="primary"
        aria-label="Delete"
      >
        <Delete/>
      </IconButton>
    </td>);

    return row;
  }

  public onAddOffer = () => {
    this.selectedOffer = null;
    this.toggleCreateOfferModal();
  };


  public toggleCreateOfferModal = () => {
    logger.debug('toggleCreateOfferModal()');
    this.setState({
      offerModalVisible: !this.state.offerModalVisible,
    });
  }

  public onOfferDelete (offer: IOffer) {
    logger.debug('onOfferDelete ()', offer);

    if (confirm('Do you really want to delete offer?')) {
      this.props.deleteOffer(offer.id);
    }
  };

  public onOfferEdit = (offer:IOffer) => {
    logger.debug('onOfferEdit ()', offer);
    this.selectedOffer = offer;
    this.toggleCreateOfferModal();
  };


}

function mapStateToProps(state: any) {
  return {
    offers: state.offers.list,
  };
}

function mapDispatchToProps(dispatch: any) {
  return {
    getOffers: () => {
      dispatch(getOffersAction());
    },
    deleteOffer: (offerId) => {
      dispatch(deleteOfferAction(offerId));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(OffersList);
