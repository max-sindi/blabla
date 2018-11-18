import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import * as styles from './style.css';
import IComponent from '../../UI/form/IComponent';
import { getFields, fieldsBehaviour } from './formContent';
import Form from '../../UI/form';
import logger from '../../../utils/logger';

interface IContainerForm {
  addContainers: (container: any) => void;
  updateContainer?: (container:any) => void;
  open: boolean;
  containerLineList: any;
  containerTypeList: any;
  onClose: () => void;
  id?: number;
  fields?: IComponent[];
}

interface IContainerState {
  fields: IComponent[];
  readyForSave: boolean;
}

export default class ContainerForm extends React.Component<
  IContainerForm,
  IContainerState
> {
  constructor(props: any) {
    super(props);
    logger.debug(props);
  }

  public state = {
    fields: this.setDefaultState(),
    readyForSave: false
  };

  public setDefaultState() {
    return [
      ...getFields(this.props.containerTypeList, this.props.containerLineList, this.props.id ? this.props.id : 1 )
    ];
  }

  public shouldComponentUpdate(nextProps: any, nextState: any) {
    if (nextProps.open !== this.props.open) {
      if (nextProps.fields && nextProps.fields.length > 0) {
        this.setState({
          fields: nextProps.fields
        });
      } else {
        this.setState({
          fields: this.setDefaultState()
        });
      }
    }
    return true;
  }

  public addContainer = () => {
    this.props.addContainers([this.state.fields]);
  };

  public updateContainer = () => {
    this.props.updateContainer(this.state.fields);
  };

  public isReadyForSave(newState: IComponent[]) {
    let result = true;
    for (const field of newState) {
      if (field.hasOwnProperty('valid') && field.valid === false && field.visible !== false) {
          result = false;
      }
    }
    return result;
  }

  public onFormChanged = (newState: IComponent[]) => {
    checkFieldForVisibility();

    this.setState({
      fields: fieldsBehaviour(newState),
      readyForSave: this.isReadyForSave(newState)
    });

    function checkFieldForVisibility() {
      const trailerType = newState.find(item => item.sysname === "trailerType");
      // const temperature = newState.find(item => item.sysname === 'genset_temperature');

      // if trailerType was not been selected yet, its value === '', so it will cause error;
      if(!trailerType.value) {
        return;
      }

      const trailerTypeValue = trailerType.valueList[trailerType.value-1].label;
      const protection = newState.find(item => item.sysname === 'platfroProtection');
      const length = newState.find(item => item.sysname === 'platfroLength');

        const unNumber = newState.find(item => item.sysname === 'unNumber');
        const adr = newState.find(item => item.sysname === 'adr');

        if(adr.value) {
            unNumber.visible = true;
        }

      // hide protection and length if 40'FT and vice versa
      if(trailerTypeValue === "40'FT") {
        protection.disabled = true;
        length.disabled = true;
        delete protection.value;
        delete length.value;
      } else {
        protection.disabled = false;
        length.disabled = false;
      }
    }
  };

  public renderSubmitButton() {
    return this.props.fields && this.props.fields.length > 0 ? ( <Button
      variant="contained"
      component="span"
      onClick={this.updateContainer}
      disabled={!this.state.readyForSave}
    >
      Обновить
    </Button>) : ( <Button
      variant="contained"
      component="span"
      onClick={this.addContainer}
      disabled={!this.state.readyForSave}
    >
      Добавить
    </Button>);
  }

  public render() {
    return (
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={this.props.open}
        className={styles.modalForm}
        onClose={this.props.onClose}
      >
        <Paper className={styles.formContainer}>
          <Typography variant="title" gutterBottom={true}>
            Контейнер
          </Typography>
          <Grid
            container={true}
            justify="center"
            alignItems="center"
            direction="column"
            spacing={16}
          >
            <Grid item={true} sm={10}>
              <Grid container={true} wrap='nowrap' className={styles.containersFormInner}>
                <Form
                  formFields={this.state.fields}
                  onFormChange={this.onFormChanged}
                  nextColumnsStart={[0, 9]}
                />
              </Grid>
              <Grid className={styles.fieldsMargin}>
                {this.renderSubmitButton()}
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Modal>
    );
  }
}
