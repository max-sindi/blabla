import * as React from "react"
import Select from '@material-ui/core/Select';
import * as styles from './styles.css';

class SelectCustom extends React.Component<any, any> {
  render() {
    const { props } = this;

    const config = {
      ...props,
      classes: {
        ...props.classes,
        root: `${styles.select} ${styles[`select__${props['data-select-type'] || 'blue'}`]}`,
        disabled: styles.checkbox__disabled,
      }
    }

    return (
      <Select {...config} />
    )
  }
}

export default SelectCustom
