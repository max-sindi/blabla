import * as React from 'react';
import FocusContainer from '../UI/focus-container';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Button from '../UI/form/formElements/Button';
import Typography from '@material-ui/core/Typography';
import Form from '../UI/form';
import IComponent from '../UI/form/IComponent';
import { connect } from 'react-redux';
import { sendLoginRequestAction, redirectToReferAction } from '../../actions/auth';
import * as styles from './style.css';
import { Link } from 'react-router-dom';
import {BasePageComponent} from "../base/basePageComponent";

interface IPropsLogin {
  login: any;
  loginError?: any;
  redirectToReffer: any;
  from?: any;
}

interface IStateLogin {
  fields: IComponent[];
  readyForSave: boolean;
}

class Login extends BasePageComponent<IPropsLogin, IStateLogin> {
  pageMeta = {
    title : 'Login',
  }

  constructor(props: IPropsLogin, state: IStateLogin) {
    super(props, state);
    this.props.redirectToReffer(this.props.from);
  }

  public state = {
    fields: [
      {
        sysname: 'phone',
        label: 'Мобильный телефон',
        value: '',
        type: 'text',
        valid: false,
        pristine: true,
        className: styles.inputWrap,
        validationRules: {
          required: true
        }
      },
      {
        sysname: 'password',
        label: 'Пароль',
        type: 'password',
        value: '',
        valid: false,
        pristine: true,
        className: styles.inputWrap,
        validationRules: {
          required: true
        }
      }
    ],
    readyForSave: false
  };

  public isReadyForSave(newState: IComponent[]) {
    for (const field of newState) {
      if (field.hasOwnProperty('valid') && field.valid === false) {
        return false;
      }
    }
    return true;
  }

  public errors() {
    if (this.props.loginError) {
      return <SnackbarContent message={this.props.loginError} />;
    }
    return null;
  }

  public onFormChange(newState: IComponent[]) {
    this.setState({
      fields: newState,
      readyForSave: this.isReadyForSave(newState)
    });
  }

  public render() {
    const login = () => {
      this.props.login(this.state.fields);
    };

    const fromChange = (newState: IComponent[]) => {
      this.onFormChange(newState);
    };

    return (
      <FocusContainer>
        {this.errors()}
        <Card classes={{ root: styles.window }}>
          <CardContent classes={{ root: styles.inputs }}>
            <Typography variant="headline" component="h2" classes={{ headline: styles.title }}>
              Вход в аккаунт
            </Typography>
            <Typography variant="caption" component="p" align="left" classes={{ caption: styles.help }}>
              Нет аккаунта? <Link to="/registration" className={styles.registrationLink}>Зарегистрируйтесь</Link>
            </Typography>
            <Form onFormChange={fromChange} formFields={this.state.fields} />
          </CardContent>
          <CardActions className={styles.loginAction}>
            <Button
              variant="contained"
              color="primary"
              onClick={login}
              disabled={!this.state.readyForSave}
              className={styles.button}
            >
              Войти
            </Button>
          </CardActions>
        </Card>
      </FocusContainer>
    );
  }
}

const getLoginError = (errors: any) => {
  let txt = '';

  errors.forEach((element: string) => {
    txt += element + ' ';
  });

  return txt;
};

function mapStateToProps(state: any) {
  return {
    loginError: getLoginError(
      state.auth.errors.non_field_errors
        ? state.auth.errors.non_field_errors
        : []
    ),
  };
}

function mapDispatchToProps(dispatch: any) {
  return {
    redirectToReffer: (from: any) => {
      dispatch(redirectToReferAction(from));
    },
    login: (userData?: any) => {
      dispatch(sendLoginRequestAction(userData));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
