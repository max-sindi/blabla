import * as React from "react"
import Radio from '@material-ui/core/Radio';
import * as styles from './styles.css';

class RadioCustom extends React.Component<any, any> {
  render() {
    const { props } = this;

    const config = {
      ...props,
      classes: {
        root: !props.disabled ? styles.checkboxBorder : styles.checkbox__disabled,
        colorSecondary: styles.checkbox,
        checked: styles.checkbox__checked,
        disabled: styles.checkbox__disabled,
      }
    }


    return (
      <Radio {...config} />
    )
  }
}

export default RadioCustom
