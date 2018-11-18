import * as React from 'react';
import IComponent, {IOptionValue} from '../IComponent';
import { IFieldChange } from '../IFieldChange';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';
import {PropTypes} from "@material-ui/core";
import FormHelperText from '@material-ui/core/FormHelperText';

interface IProps {
  component: IComponent;
  onChange: IFieldChange;
  disabled?: boolean;
  width?: string;
  margin?: PropTypes.Margin;
  className?: string;
}

export default ({ component, onChange }: IProps) => {
  const setValue = (event: any) => {
    component.value = event.target.value;
    onChange(component);
  };

  const renderItems = (items:  IOptionValue[]) => {
    return items.map((item: IOptionValue) => {
      return <MenuItem key={item.label} value={item.value}>{item.label}</MenuItem>;
    });
  };

  const fullWidth = component.width ? (component.width === 'full') : true;

  return (
    <FormControl fullWidth={fullWidth}
                 style={{'minWidth' : '10em'}}
                 disabled={component.disabled}
                 className={component.className}>
      <InputLabel shrink htmlFor="age-helper">{component.label}</InputLabel>
      <Select
        value={component.value}
        onChange={setValue}
        input={<Input name="age" id="age-helper" />}
        error={!component.pristine && !component.valid}
      >
        {renderItems(component.valueList || [])}
      </Select>
    </FormControl>
  );
};
