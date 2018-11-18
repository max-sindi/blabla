import * as React from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepContent from '@material-ui/core/StepContent';
import StepButton from '@material-ui/core/StepButton';
import UserType from '../user-type';
import Form from '../../UI/form';
import Typography from '@material-ui/core/Typography';
import * as styles from './style.css';
import * as loginStyles from '../../login/style.css';

const s = styles

type IChangeHandler = (value:any)=>void;

interface IRegistrationStepper {
  step: number;
  formFields: any[];
  onChangeUserType: any;
  onFormChange: IChangeHandler;
  onInputChange?: IChangeHandler;
  userType?: any;
}

interface IState {
  step?: number;
}

export default class RegistrationStepper extends React.Component<
  IRegistrationStepper,
  IState
> {
  constructor(props: IRegistrationStepper) {
    super(props);
    this.state = {
      step: this.props.step
    };
  }

  public render() {
    const { userType } = this.props;
    const setFirstStep = () => {
      this.setState({ step: 0 });
    };

    const setSecondStep = (userType: string) => {
      this.setState({ step: 1 });
      this.props.onChangeUserType(userType);
    }

    const typography = text => {
      return (
          <Typography
            variant="headline"
            component="h3"
            classes={{ headline: `${styles.stepTitle} ${styles.ml8minus}` }}
            children={text}
          />
      )
    }

    const findUserType = (userType) => {
      const types = {
        'customer': 'Заказчик',
        'carrier': 'Перевозчик',
      }

      return types[userType];
    }

    return (
      <Stepper
        activeStep={this.state.step}
        orientation="vertical"
        classes={{ root: styles.stepperRoot}}
        nonLinear={true}
        connector={null}
      >
        <Step>
          <StepButton
            onClick={setFirstStep}
            classes={{
              root: s.stepperButton
            }}
          >
          {(!userType || this.state.step === 0)
            ? typography('Выберите Тип Пользователя')
            : (
                <Typography
                variant="headline"
                component="h3"
                classes={{ headline: `${s.stepTitle} ${s.ml8minus} ${s.userSelected}` }}
                >
                  Тип пользователя <span className={`${s.blueColor} ${s.bold} ${s.ml5}`}>{findUserType(userType)}</span>
                </Typography>
              )
          }
          </StepButton>
          <StepContent classes={{
            root: `${styles.stepContentRoot}`,
          }}>
            <UserType
              onChoosen={setSecondStep}
            />
          </StepContent>
        </Step>
        <Step>
          <StepContent classes={{
            root: `${styles.resetSidePaddings} ${styles.formRoot}`,
          }}>
            <Typography
              variant="headline"
              component="h3"
              classes={{ headline: `${styles.stepTitle} ${styles.mb20}` }}
              children={'Заполните Данные Пользователя'}
            />
            <Form
              onInputChange={this.props.onInputChange}
              onFormChange={this.props.onFormChange}
              formFields={this.props.formFields}
            />
          </StepContent>
        </Step>
      </Stepper>
    );
  }
}
