import * as React from 'react';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '../formElements/InputLabel';
import Input from '../formElements/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Visibility from '@material-ui/icons/Visibility';
import { PropTypes, FormHelperText } from '@material-ui/core';
import * as styles from '../formElements/styles.css';

interface IPasswordInputProps {
  margin: PropTypes.Margin;
  key?: string;
  label?: string;
  value?: string;
  disabled?: boolean;
  helperText?: string;
  InputLabelProps: any;
  onChange: (event: any) => void;
  error: boolean;
  fullWidth: boolean;
}

interface IPasswordInputState {
  showPassword: boolean;
  value: string | undefined;
}

export default class PasswordInput extends React.Component<
  IPasswordInputProps,
  IPasswordInputState
> {
  constructor(props: IPasswordInputProps) {
    super(props);
    this.state = {
      showPassword: false,
      value: this.props.value
    };
  }

  public handleMouseDownPassword = (event: any) => {
    event.preventDefault();
  };

  public handleClickShowPassword = () => {
    this.setState((state) => ({ showPassword: !state.showPassword }));
  };

  public helperText() {
    if (this.props.helperText) {
      return (
        <FormHelperText error={this.props.error} >
          {this.props.helperText}
        </FormHelperText>
      );
    }
    return null;
  }

  public render() {
    return (
      <FormControl
        disabled={this.props.disabled}
        fullWidth={this.props.fullWidth}
        margin={this.props.margin}
      >
        <Input
          label={this.props.label}
          type={this.state.showPassword ? 'text' : 'password'}
          value={this.props.value}
          onChange={this.props.onChange}
          error={this.props.error}
          InputLabelProps={{
              shrink: true
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment
                position="end"
                classes={{
                  root: styles.input__iconWrap
                }}
              >
                <IconButton
                aria-label="Toggle password visibility"
                onClick={this.handleClickShowPassword}
                onMouseDown={this.handleMouseDownPassword}
                >
                {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        {this.helperText()}
      </FormControl>
    );
  }
}
