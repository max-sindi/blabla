import * as React from 'react';
import { connect } from 'react-redux';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '../UI/form/formElements/Button';
import Typography from '@material-ui/core/Typography';
import FocusContainer from '../UI/focus-container';
import RegistrationStepper from './stepper';
import * as styles from '../login/style.css';
import IComponent from '../UI/form/IComponent';
import { sendRegistrationRequest } from '../../actions/registration';
import { IClientType } from './enums';
import { formFields } from './formFileds';
import {BasePageComponent} from "../base/basePageComponent";
import { Link } from 'react-router-dom';

interface IPropsRegistration {
  saveUser: any;
  errors: any[];
}

interface IStateRegistration {
  fields: IComponent[];
  userType: IClientType;
  readyForSave: boolean;
}

class Registration extends BasePageComponent<
  IPropsRegistration,
  IStateRegistration
> {
  pageMeta = {
    title : 'Registration',
  }


  constructor(props: IPropsRegistration, state: IStateRegistration) {
    super(props, state);
  }

  public componentDidUpdate(
    props: IPropsRegistration,
    state: IStateRegistration
  ) {
    if (props.errors !== this.props.errors) {
      this.setState({
        fields: this.updateServerMessages(this.state.fields)
      });
    }
    return this.state;
  }

  public state:IStateRegistration = {
    fields: formFields,
    userType: null,
    readyForSave: false
  };

  public updateServerMessages = (fields: IComponent[]) => {
    return fields.map((element) => {
      return this.updateField(element);
    });
  };

  public isReadyForSave(newState: IComponent[]) {
    let result = true;
    for (const field of newState) {
      if (field.hasOwnProperty('valid') && field.valid === false) {
        result = false;
      }
    }
    if (Object.keys(this.props.errors).length > 0) {
      return true;
    }
    return result;
  }

  public serverError(changedComponet: IComponent, errors: any) {
    if (errors[changedComponet.sysname]) {
      return true;
    }
    return false;
  }

  public setInvalidComponent(changedComponet: IComponent, message: string) {
    changedComponet.valid = false;
    changedComponet.helperText = message;
    return changedComponet;
  }

  public updateField = (component: IComponent) => {
    if (this.serverError(component, this.props.errors)) {
      if (component.valid) {
        let message = '';
        this.props.errors[component.sysname].forEach((element: string) => {
          message += element + ' ';
        });
        return this.setInvalidComponent(component, message);
      }
    }
    return component;
  };

  public onFormChange = (newState: IComponent[]) => {
    this.setState({
      fields: this.updateServerMessages(newState),
      readyForSave: this.isReadyForSave(newState)
    });
  };

  public render() {
    const setUserType = (type: string) => {
      this.setState({ userType: type });
    };

    const save = () => {
      const userType = {sysname: 'userType', value: this.state.userType};
      const fields = [...this.state.fields, userType];
      this.props.saveUser(fields);
    };

    return (
      <FocusContainer>
        <Card classes={{ root: styles.window }}>
          <CardContent className={styles.root}>
            <Typography variant="headline" component="h2" classes={{ headline: styles.title }}>
              Регистрация
            </Typography>
            <RegistrationStepper
              step={0}
              formFields={this.state.fields}
              onFormChange={this.onFormChange}
              onChangeUserType={setUserType}
              userType={this.state.userType}
            />
          </CardContent>
          <CardActions className={styles.root}>
            <Button
              variant="contained"
              color="primary"
              onClick={save}
              disabled={!this.state.readyForSave}
              className={styles.button}
            >
              Зарегистрировать
            </Button>
          </CardActions>
          <Typography variant="caption" component="p" align="center" classes={{
            root: `${styles.fz14} ${styles.mt20} ${styles.grey} ${styles.mb10minus}`
          }}>
            Уже есть аккаунт? <Link to="/login" className={styles.registrationLink}>Войти</Link>
          </Typography>
        </Card>
      </FocusContainer>
    );
  }
}

function mapStateToProps(state: any) {
  return { errors: state.registration.errors };
}

function mapDispatchToProps(dispatch: any) {
  return {
    saveUser: (userData?: any) => {
      dispatch(sendRegistrationRequest(userData));
    }
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Registration);
