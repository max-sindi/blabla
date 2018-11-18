import * as React from "react"
import InputLabel from '@material-ui/core/InputLabel';
import * as styles from './styles.css';

class InputLabelCustom extends React.Component<any, any> {
  render() {
    const { props } = this;

    const config = {
      ...props,
      classes: {
        root: styles.labelTypography,
      }
    }


    return (
      <InputLabel {...config} />
    )
  }
}

export default InputLabelCustom
