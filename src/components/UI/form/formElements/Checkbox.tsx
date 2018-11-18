import * as React from "react"
import Checkbox from '@material-ui/core/Checkbox';
import * as styles from './styles.css';

class CheckboxCustom extends React.Component<any, any> {
  render() {
    const { props } = this;

    const config = {
      ...props,
      classes: {
        ...props.classes,
        root: styles.checkboxBorder,
        colorSecondary: styles.checkbox,
        checked: styles.checkbox__checked,
        disabled: styles.checkbox__disabled,
      }
    }

    return (
      <Checkbox {...config} />
    )
  }
}

export default CheckboxCustom
