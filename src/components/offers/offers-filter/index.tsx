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
import {push} from 'connected-react-router';
import {IOffer, getOffersAction} from '../../../actions/offers';
import {getTrucksAction, ITruckInfo} from "../../../actions/trucks";
import TableFilter, {ITableFilter} from "../../UI/table-filter/index";
import { format } from 'date-fns';
import logger from '../../../utils/logger';




interface IOffersFilterProps {
  containerTypeList: any[],
  containerLineList: any[],
  trucksList: ITruckInfo[],

  offers: IOffer[];

  getTrucksList: () => void,
  getOffers: (options:any) => void;
}


interface IOfferFilterState {
  filters: any[];
}

const offerFilters : ITableFilter[] = [
  {
    sysname: 'region',
    label: 'Регион',
    type: 'select',
    apiOptionName: 'region',
    valueList : [],
    width: 'md',
    inline: true,
  },
  {
    sysname: 'driver',
    label: 'Водитель',
    type: 'select',
    apiOptionName: 'driver_id',
    valueList : [],
    width: 'md',
    inline: true,
  },
  {
    sysname: 'date_from',
    label: 'Доступен после',
    type: 'datetime',
    apiOptionName: 'date__gte',
    margin: 'normal',
    width: 'sm',
    inputProps : {
      min : format(new Date, 'YYYY-MM-DD[T00:00]'),
      defaultValue : format(new Date, 'YYYY-MM-DD[T]HH:mm'),
      step: '1',
    },
    inline: true,
  },
  {
    sysname: 'date_to',
    label: 'Доступен до',
    type: 'datetime',
    apiOptionName: 'date__lt',
    margin: 'normal',
    width: 'sm',
    inputProps : {
      min : format(new Date, 'YYYY-MM-DD[T00:00]'),
    },
    inline: true,
  },
  {
    sysname: 'truck',
    label: 'Тягач',
    type: 'select',
    apiOptionName: 'truck_id',
    valueList : [],
    width: 'md',
    inline: true,
  },
  {
    sysname: 'container',
    label: 'Контейнер',
    type: 'select',
    apiOptionName: 'container__type__name',
    valueList : [],
    margin: 'normal',
    width: 'md',
    inline: true,
  },
  {
    sysname: 'container_line',
    label: 'Линия',
    type: 'select',
    apiOptionName: 'container__line__name',
    valueList : [],
    margin: 'normal',
    width: 'md',
    inline: true,
  },

];


class OffersFilter extends React.Component<IOffersFilterProps> {
  props: IOffersFilterProps;
  state: IOfferFilterState = {
    filters : [],
  };

  constructor(props: IOffersFilterProps) {
    super(props);
  }


  public componentDidMount() {
    this.props.getTrucksList();
  }


  public render() {
    this.setupSelectLists();

    return (
      <ErrorBoundary>
        <Grid>
          <Paper>
            <CardContent>
              <Grid container={true} direction="column">
                <Grid container={true} direction="row">
                  {this.renderFilters()}
                </Grid>
              </Grid>
            </CardContent>
          </Paper>
        </Grid>
      </ErrorBoundary>
    );
  }

  public renderFilters() {
    return (
      <TableFilter filters={offerFilters}
                   onFilter={this.onFilter}>

      </TableFilter>
    );
  }

  public onFilter = (data) => {
    logger.debug('onFilter()', data);

    this.props.getOffers(data.requestData);
  };

  private setupSelectLists() {
    // fill trucks select
    if (this.props.trucksList) {
      const truckField = offerFilters.find((val, key) => (val.sysname === 'truck'));
      truckField.valueList = this.props.trucksList.map(truck => {
        return {label: truck.color + ' ' + truck.brand + ' ' + truck.registration_number, value: truck.id};
      });

    }

    // fill regions and drivers select
    if (this.props.offers) {
      const regionField = offerFilters.find((val, key) => (val.sysname === 'region'));

      // regions must be unique
      // Obj[] => string[] => filter unique => Obj{label:, value:}[]
      regionField.valueList = this.props.offers.map(offer => {
                                return offer.location.region;
                              })
                              .filter((elem, idx, arr) => {
                                return (arr.indexOf(elem) === idx);
                              })
                              .map((regionStr) => {
                                return {label: regionStr, value : regionStr};
                              });


      const driverField = offerFilters.find((val, key) => (val.sysname === 'driver'));

      // drivers in list must be unique
      // Obj[] => string[] => filter unique => Obj{label:, value:}[]
      // driverField.valueList = this.props.offers.map(offer => {
      //                             return { label: offer.driver.first_name + ' ' + offer.driver.last_name, value: offer.driver.id};
      //                         })
      //                           .filter((elem, idx, arr) => {
      //                             const indexOfElem = arr.findIndex(item => (item.value === elem.value));
      //                             return (indexOfElem === idx);
      //                         });

    }

    // fill containerType select
    if (this.props.containerTypeList) {
      const containerField = offerFilters.find((val, key) => (val.sysname === 'container') );
      containerField.valueList = this.props.containerTypeList.map(container => {
        return {label: container.name, value: container.name};
      });

    }

    // fill containerLine select
    if (this.props.containerLineList) {
      const lineField = offerFilters.find((val, key) => (val.sysname === 'container_line') );
      lineField.valueList = this.props.containerLineList.map(line => {
        return {label: line.name, value: line.name};
      });
    }

  }


}

function mapStateToProps(state: any) {
  return {
    containerTypeList: state.commonEnums.containerTypeList,
    containerLineList: state.commonEnums.containerLineList,
    trucksList: state.trucks.list,
    offers: state.offers.list,
  };
}

function mapDispatchToProps(dispatch: any) {
  return {
    getTrucksList: () => {
      dispatch(getTrucksAction());
    },
    getOffers: (options = {}) => {
      dispatch(getOffersAction(options));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(OffersFilter);
