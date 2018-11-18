import * as React from 'react';
import ErrorBoundary from "../../UI/ErrorBoundary";
import {connect} from 'react-redux';

import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import Grid from '@material-ui/core/Grid';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete';
import {ITruckInfo, getTrucksAction, deleteTruckAction} from '../../../actions/trucks';

import CreateTruck from '../create-truck';
import * as styles from './style.css';
import logger from '../../../utils/logger';


interface ICarrierTruckProps {
  trucks: ITruckInfo[];
  getTrucks: () => void;
  deleteTruck: (truckId:string) => void;
}

interface ITrucksListState {
  createTruckModalOpened: boolean;
}


class TrucksList extends React.Component<ICarrierTruckProps> {
  props: ICarrierTruckProps;
  state : ITrucksListState =  {
    createTruckModalOpened: false,
  };
  selectedTruck: ITruckInfo = null;

  constructor(props: ICarrierTruckProps) {
    super(props);
  }


  public componentDidMount() {
    this.props.getTrucks();
  }



  public render() {
    return (
      <ErrorBoundary>
        <Grid>
          <Paper>
            <CardContent>
              <Grid container={true} direction="column">
                <Grid container={true} direction="row">
                  <Grid item={true}>
                    <Typography variant="headline">Машины</Typography>
                  </Grid>
                  <Grid container className={styles.iconContainerRight}>
                    <IconButton
                      color="primary"
                      aria-label="Add Truck"
                      onClick={this.onAddTruck}
                    >
                      <AddIcon/>
                    </IconButton>
                  </Grid>
                </Grid>

                <Grid>


                  <table>
                    <thead>
                    <tr>
                      <td>Номер</td>
                      <td>Пасспорт</td>
                      <td>Цвет</td>
                      <td>Бренд</td>
                      <td>Количество осей</td>
                      <td>Прицеп: Номер</td>
                      <td>Прицеп: Пасспорт</td>
                      <td>Прицеп: Цвет</td>
                      <td>Прицеп: Бренд</td>
                      <td>Прицеп: Количество осей</td>
                      <td>Прицеп: Грузоподъёмность, кг</td>
                      <td>Прицеп: Тип</td>
                      <td>Прицеп: Зашит</td>
                      <td>Прицеп: Телескопический</td>
                      <td></td>
                    </tr>
                    </thead>
                    <tbody>
                    { this.renderRows()}
                    </tbody>
                  </table>

                  <CreateTruck
                    open={this.state.createTruckModalOpened}
                    truck={this.selectedTruck}
                    onClose={this.toggleCreateTruckModal}
                  />


                </Grid>
              </Grid>
            </CardContent>
          </Paper>
        </Grid>
      </ErrorBoundary>
    );
  }

  renderRows() {
    logger.debug(this.props);

    const rows = this.props.trucks ?
        this.props.trucks.map(truck => {
          return (<tr key={truck.registration_number}>{this.renderTruckRow(truck)}</tr>);
    }) : [];

    return rows;
  }


  renderTruckRow(truck) {
    logger.debug('renderTruckRow()', truck);

    let infoProcessor = {
      date: 'date',
      is_protected: 'bool',
    };

    const fields1 = [
      'registration_number',
      'technical_passport',
      'color',
      'brand',
      'axles',
    ];

    const fields2 = [
      'registration_number',
      'technical_passport',
      'color',
      'brand',
      'axles',
      'load_capacity',
      'type',
      'is_protected',
      'is_telescopic',
    ];

    let res1 = fields1.map((field) => {
      return { key : field, val: truck[field]};
    });

    let res2 = fields2.map((field) => {
      return {key: 'trailer_' + field, val : truck.trailer[field]};
    });

    let res = res1.concat(res2);

    const row =  res.map((tuple) => {
      let v = tuple.val;
      if( typeof v == 'boolean')  {
        v = v ? 'Да' : 'Нет';
      }
      return (<td key={tuple.key}>
        {v}
        </td>);
    });


    row.push(<td key='edit'>
      <IconButton
        onClick={this.onTruckEdit.bind(this, truck)}
        color="primary"
        aria-label="Edit"
      >
        <Edit/>
      </IconButton>
    </td>);

    row.push(<td key='delete'>
      <IconButton
        onClick={this.onTruckDelete.bind(this, truck)}
        color="primary"
        aria-label="Delete"
      >
        <Delete/>
      </IconButton>
    </td>);

    return row;
  }

  public handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    });
  };


  public onAddTruck = () => {
    this.selectedTruck = null;
    this.toggleCreateTruckModal();
  };


  toggleCreateTruckModal = () => {
    this.setState({
      createTruckModalOpened: !this.state.createTruckModalOpened,
    });
  };


  public onTruckDelete (truck: ITruckInfo) {
    logger.debug('onTruckDelete ()', truck);

    if (confirm('Do you really want to delete truck?')) {
      this.props.deleteTruck(truck.id);
    }
  };

  public onTruckEdit = (truck:ITruckInfo) => {
    logger.debug('onTruckEdit ()', truck);
    this.selectedTruck = truck;
    this.toggleCreateTruckModal();
  };

}

function mapStateToProps(state: any) {
  return {
    trucks: state.trucks.list,
  };
}

function mapDispatchToProps(dispatch: any) {
  return {
    getTrucks: () => {
      dispatch(getTrucksAction());
    },
    deleteTruck: (truckId) => {
      dispatch(deleteTruckAction(truckId));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TrucksList);
