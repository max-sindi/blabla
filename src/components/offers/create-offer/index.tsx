import * as React from 'react';
import ErrorBoundary from "../../UI/ErrorBoundary";
import {connect} from 'react-redux';

import Paper from '@material-ui/core/Paper';
import Modal from "@material-ui/core/Modal";
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {IOffer, createOfferAction, IOfferCreation, updateOfferAction} from '../../../actions/offers';
import * as styles from './style.css';

import Button from "@material-ui/core/Button";
import Form from "../../UI/form/index";

import {
  containerFieldsNames, convertFieldsToOfferInfo, convertOfferInfoToFields, offerFormFields,
  truckFieldsNames
} from './offerFormFields';
import IComponent from "../../UI/form/IComponent";

import {getTrucksAction, ITruckInfo} from "../../../actions/trucks";
import {findProperty, updateProperty} from "../../../utils/field-list";
import logger from '../../../utils/logger';

/**
 * If offer is set, then dialog edits&updates offer.
 * If no - creates new offer
 */
interface ICreateOfferProps {
  offer?: IOffer,
  onClose: () => void,
  open: boolean,

  containerTypeList: any[],
  containerLineList: any[],
  trucksList: ITruckInfo[],

  getTrucksList: () => void,
  createOffer: (IOffer) => void,
  updateOffer: (IOffer) => void,
};

interface ICreateOfferState {
  offer: IOffer,
  fields: IComponent[],
  readyForSave: boolean,
};


class CreateOffer extends React.Component<ICreateOfferProps> {

  public state: ICreateOfferState = {
    offer: null, // to track if props.offer changed
    fields: offerFormFields,
    readyForSave: false,
  };

  constructor(props: ICreateOfferProps) {
    super(props);
    this.state.offer = this.props.offer;
  }


  public componentDidMount() {
    this.props.getTrucksList();
  }

  /**
   * Fills state.offer and state.fields from props, but only if
   */
  public fillOfferStateFromProps() {
    if (this.props.offer && (this.state.offer != this.props.offer)) {
      // copy props.offer to state and reset fields
      this.setState({
        offer : this.props.offer,
        fields : convertOfferInfoToFields(this.props.offer),
      });
    }
  }

  /**
   * Sets new state with updated data.
   * Upates controls state.
   * @param {IComponent[]} newFormState
   */
  public onFormChanged = (newFormState: IComponent[]) => {
    logger.debug('onFormChanged():', newFormState);

    this.updateControls(newFormState);
    this.setState({
      fields: newFormState,
      readyForSave: this.validateForm(newFormState),
    });
  };


  /**
   * Update controls behavior, depending on form state.
   * @param newState
   */
  public updateControls = (newState: any) => {
    const hasTruck = findProperty('has_truck', newState).value;

    // show/hide truck select field
    const truckIdField = findProperty('truck', newState);
    truckIdField.visible = !!hasTruck;

    // truck&trailer fields are visible only if truck checkbox is unset
    truckFieldsNames.map(fieldName => {
      updateProperty(fieldName, newState, data => {
        data.visible = !hasTruck;
        return data;
      });

    });

    // containers fields are disabled if checkbox is unset
    const hasContainer = findProperty('has_container', newState).value;
    containerFieldsNames.map(fieldName => {
      updateProperty(fieldName, newState, data => {
        data.disabled = !hasContainer;
        return data;
      });
    });
  };

  /**
   * Validation.
   * @param {IComponent[]} newFormState
   * @returns {boolean}
   */
  public validateForm(newFormState: IComponent[]): boolean {
    let result = true;

    for (const field of newFormState) {
      if (field.hasOwnProperty('valid') && field.valid === false) {
        result = false;
      }
    }
    return result;
  }


  public render() {
    this.setupSelectLists();
    this.fillOfferStateFromProps();

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
                  style={{'marginTop' : '3em', width: '21.5em'}}
            >
              <Paper className='createOfferForm__paper'
                     style={{'padding' : '1em'}}>
                <Typography variant="title"
                            gutterBottom={true}
                            align='center'>
                  {this.props.offer ? 'Редактировать Оффер' : 'Разместить Оффер'}
                </Typography>
                <Grid
                  container={true}
                  justify="center"
                  alignItems="center"
                  direction="column"
                  spacing={16}
                >
                  <Grid item={true} sm={10}>
                    { this.renderForm() }
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

          </Grid>
        </Modal>
      </ErrorBoundary>
    );
  }


  public renderForm() {
    this.setupSelectLists();

    return (
      <Grid className=''>
          <Form
            formFields={this.state.fields}
            onFormChange={this.onFormChanged}
          />
          <Button
            variant="contained"
            component="span"
            onClick={this.onSubmit.bind(this)}
            disabled={!this.state.readyForSave}
          >
            {this.props.offer ? 'Обновить' : 'Разместить'}
        </Button>
      </Grid>
    );
  };

  /**
   * Fill in lists for trucks, containers, etc
   */
  private setupSelectLists() {
    // trucks
    if (this.props.trucksList) {
      const truckField = this.state.fields.find((val, key) => (val.sysname === 'truck') );
      truckField.valueList = this.props.trucksList.map(truck => {
        return {label: truck.color + ' ' + truck.brand + ' ' + truck.registration_number, value: truck.id};
      });
    }

    // container type
    if (this.props.containerTypeList) {
      const containerField = this.state.fields.find((val, key) => (val.sysname === 'container') );
      containerField.valueList = this.props.containerTypeList.map(container => {
        return {label: container.name, value: container.id};
      });
    }

    // contanier line
    if (this.props.containerLineList) {
      const lineField = this.state.fields.find((val, key) => (val.sysname === 'container_line') );
      lineField.valueList = this.props.containerLineList.map(line => {
        return {label: line.name, value: line.id};
      });
    }
  }

  /**
   * On submit - create or update offer.
   */
  private onSubmit() {
    logger.debug('onSubmit() data=', this.state);

    if (this.state.readyForSave) {
      const offerData: IOfferCreation = convertFieldsToOfferInfo(this.state.fields, this.state.offer);

      if(this.props.offer) {
        logger.debug('onSubmit() update offer:', offerData);
        this.props.updateOffer(offerData);
      } else {
        logger.debug('onSubmit() create offer:', offerData);
        this.props.createOffer(offerData);
      }

      this.props.onClose();
    }
  }

}


function mapStateToProps(state: any) {
  return {
    containerTypeList: state.commonEnums.containerTypeList,
    containerLineList: state.commonEnums.containerLineList,
    trucksList: state.trucks.list,
  };
}


function mapDispatchToProps(dispatch: any) {
  return {
    getTrucksList: () => {
      dispatch(getTrucksAction());
    },
    createOffer: (offerData) => {
      dispatch(createOfferAction(offerData));
    },
    updateOffer: (offerData) => {
      dispatch(updateOfferAction(offerData));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateOffer);
