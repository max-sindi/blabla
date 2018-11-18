import * as React from "react"
import TextField from '@material-ui/core/TextField';
import * as styles from './styles.css';

class TextFieldCustom extends React.Component<any, any> {
  render() {
    const { props } = this;

    const labelClasses = {
      root: styles.label,
    }

    const inputClasses = {
      root: `${styles.input}${props.valid ? styles.input__valid : ''} ${( props.InputProps && props.InputProps['data-added-class']) || ''}`,
      focused: styles.input__focus,
      error: styles.input__error,
      disabled: styles.input__disabled,
    }

    const InputProps = {
      ...props.InputProps,
      disableUnderline: true,
      classes: inputClasses,
    }

    const InputLabelProps = {
      ...props.InputLabelProps,
      classes: labelClasses,
    }

    const config = {
      ...props,
      InputProps,
      InputLabelProps,
      classes: {
        root: styles.input__root
      },
    }

    return (
      <TextField {...config} />
    )
  }
}

export default TextFieldCustom
