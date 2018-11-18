import * as React from 'react';
import ErrorBoundary from "../../UI/ErrorBoundary";
import {connect} from 'react-redux';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {ITruckInfo, getTrucksAction, addTruckAction, updateTruckAction} from '../../../actions/trucks';
import {
  convertFieldsToTruckInfo, truckFormFields, trailerFormFields,
  convertTruckInfoToFields
} from './truckFormContent';

import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button";
import Form from "../../UI/form/index";

import IComponent from "../../UI/form/IComponent";

import * as styles from './style.css';
import logger from '../../../utils/logger';


interface ICreateTruckProps {
  truck?: ITruckInfo;
  open: boolean,
  onClose: () => void,

  updateTruck: (ITruckInfo) => void;
  createTruck: (ITruckInfo) => void;
}

interface ICreateTruckState {
  fields: IComponent[][],
  readyForSave: boolean,
  currentScreen: number,
  truck: ITruckInfo; // to track if props truck changed
};


class CreateTruck extends React.Component<ICreateTruckProps> {
  private maxScreensNum = 1;

  public state: ICreateTruckState = {
    fields : [
      truckFormFields, // screen 0
      trailerFormFields, // screen 1
    ],
    readyForSave: false,
    currentScreen: 0,
    truck: null,
  };


  constructor(props: ICreateTruckProps) {
    super(props);
    this.setState({
      truck : this.props.truck
    });
    // this.state.truck = this.props.truck;
  }


  public componentDidMount() {
  }

  /**
   * Fills state.truck and state.fields from props, but only if
   */
  public fillTruckStateFromProps() {
    if (this.props.truck && (this.state.truck != this.props.truck)) {
      // copy props.truck to state and reset fields
      this.setState({
        truck : this.props.truck,
        fields : convertTruckInfoToFields(this.props.truck),
        readyForSave: true,
      });
    }
  }


  public onFormChanged = (formFields: any) => {

    const newFields = [
      this.state.fields[0],
      this.state.fields[1],
    ];

    newFields[this.state.currentScreen] = formFields;

    this.setState({
      fields: newFields,
      readyForSave: this.isReadyForSave(formFields),
    });
  };


  public isReadyForSave(newState: IComponent[]) {
    let result = true;
    for (const field of newState) {
      if (field.hasOwnProperty('valid') && field.valid === false) {
        result = false;
      }
    }
    return result;
  }



  public renderButtons() {
    const prevButton = this.state.currentScreen > 0 ?
      (
        <Button
          variant="contained"
          component="span"
          onClick={this.onPrevScreen}
        >
          Назад
        </Button>
      ) : null;

    const nextButtons: any = [
      {
        callback : this.onNextScreen,
        text: 'Далее',
      },
      {
        callback : this.onSubmit,
        text: 'Добавить',
      },
    ];


    const nb = nextButtons[this.state.currentScreen] || {callback : (any) => any, text: ''};
    const nextButton = (
      <Button
        variant="contained"
        component="span"
        onClick={nb.callback}
        disabled={!this.state.readyForSave}
      >
        {nb.text}
      </Button>
      );

    return (
      <div>
        {prevButton}
        {nextButton}
      </div>
    );
  }



  public render() {
    // this.setupSelectLists();
    this.fillTruckStateFromProps();


    return (
      <ErrorBoundary>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.props.open}
          className=''
          onClose={this.props.onClose}
        >
          <Grid
            container={true}
            justify="center"
            alignItems="center"
            direction="column"
            spacing={16}
          >
            <Grid xs={6}
                  className='createOfferForm__grid'
                  style={{'marginTop' : '3em', width: '26em',
                    paddingLeft: '1em', paddingRight: '1em' }}
            >
              <Paper className='createOfferForm__paper'
                     style={{'padding' : '1em'}}>
                <Typography variant="title"
                            gutterBottom={true}
                            align='center'>
                  {this.props.truck ? 'Редактировать Машину' : 'Добавить Машину'}
                </Typography>
                <Grid
                  container={true}
                  justify="center"
                  alignItems="center"
                  direction="column"
                  spacing={16}
                  xs={10}
                >
                  { this.renderForm() }
                </Grid>
              </Paper>
            </Grid>

          </Grid>
        </Modal>
      </ErrorBoundary>
    );
  }


  private renderForm() {
    const currentFormFields = this.state.fields[this.state.currentScreen] || [];

    return (
      <Grid
        container={true}
        justify="center"
        alignItems="center"
        direction="column"
        spacing={16}
      >
        <Grid item={true}>
          <Form
            formFields={currentFormFields}
            onFormChange={this.onFormChanged}
          />
          <Grid className=''>
            {this.renderButtons()}
          </Grid>
        </Grid>
      </Grid>
    );
  }


  private onPrevScreen = (ev) => {
    if (this.state.currentScreen > 0) {
      this.setState({
        currentScreen : this.state.currentScreen - 1,
      });
    }
  };

  private onNextScreen = (ev) => {
    if (this.state.currentScreen < this.maxScreensNum) {
      this.setState({
        currentScreen : this.state.currentScreen + 1,
      });
    }
  };

  /**
   * On submit - create or update truck.
   */
  private onSubmit = () => {
    logger.debug('onSubmit() data=', this.state);

    if (this.state.readyForSave) {
      const truckData: ITruckInfo = convertFieldsToTruckInfo(
        this.state.fields[0],
        this.state.fields[1],
        this.state.truck,
      );

      if(this.props.truck) {
        logger.debug('onSubmit() update truck:', truckData);
        this.props.updateTruck(truckData);
      } else {
        logger.debug('onSubmit() create truck:', truckData);
        this.props.createTruck(truckData);
      }

      this.setState({
        currentScreen: 0,
      });

      this.props.onClose();
    }
  }

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
    createTruck: (truckData: ITruckInfo) => {
      dispatch(addTruckAction(truckData));
    },
    updateTruck: (truckData: ITruckInfo) => {
      dispatch(updateTruckAction(truckData));
    },

  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateTruck);
