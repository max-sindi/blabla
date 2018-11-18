import * as React from "react"
import Button from '@material-ui/core/Button';
import * as styles from './styles.css';

class ButtonCustom extends React.Component<any, any> {
  render() {
    const { props } = this;

    const config = {
      ...props,
      classes: {
        root: `${styles.button} ${styles[`button__${props['data-buttontype']}`] || styles.button__blue}`,
        disabled: styles.button__disabled,
      }
    }

    return (
      <Button {...config} />
    )
  }
}

export default (ButtonCustom);
