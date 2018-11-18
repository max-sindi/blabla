import * as React from "react"
import FormControlLabel from '@material-ui/core/FormControlLabel';
import * as styles from './styles.css';

class FormControlLabelCustom extends React.Component<any, any> {
  render() {
    const { props } = this;

    const config = {
      ...props,
      control: props.control,
      label: props.label,
      classes: {
        label: styles.formLabel,
        // focused: styles.labelFocused,
      }
    }


    return (
      <FormControlLabel {...config} />
    )
  }
}

export default FormControlLabelCustom
