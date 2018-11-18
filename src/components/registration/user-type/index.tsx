import * as React from 'react';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import * as styles from './style.css';
import { clientType } from '../enums';
import Button from '../../UI/form/formElements/Button';

interface IUserTypePops {
  onChoosen: any;
}

export default class UserType extends React.Component<IUserTypePops, {}> {
  constructor(props: IUserTypePops) {
    super(props);
  }

  public render() {
    const setCustomer = () => {
      this.props.onChoosen(clientType.CUSTOMER);
    };

    const setDispatcher = () => {
      this.props.onChoosen(clientType.CARRIER);
    };

    const button = (label, clickHanlder) => (
      <Button
        onClick={clickHanlder}
        children={label}
        className={styles.button}
        data-buttontype="whiteTab"
      />
    )

    return (
      <Grid container={true} justify="center">
        <Chip
          className={styles.clientTypeItem}
          clickable={true}
          component={() => button("Заказчик", setCustomer)}
        />
        <Chip
          className={styles.clientTypeItem}
          clickable={true}
          component={() => button("Перевозчик", setDispatcher)}
        />
      </Grid>
    );
  }
}
