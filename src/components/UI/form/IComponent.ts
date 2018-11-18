import IValidationRules from './IValidationRules';
import {PropTypes} from '@material-ui/core';


export interface IOptionValue {
    label: string,
    value: string | undefined
}


export default interface IComponent {
  sysname: string;
  label?: string;
  disabled?: boolean;
  value?:  any;
  type?: string;
  valid?: boolean;
  valueList?: IOptionValue[];
  pristine?: boolean;
  visible?: boolean;
  validationRules?: IValidationRules;
  defaultHelperText?: string;
  helperText?: string;
  row?: boolean;
  apiOptionName?: string;
  inputProps?: any;
  className?: string;
  width?: 'xs' | 'sm' | 'md' | 'xl' | 'xxl' | 'full';
  inline?: boolean;
  lineBreak?: boolean;
  margin?: PropTypes.Margin;
  resetButton?: boolean;
  disableIcon?: boolean;
};
