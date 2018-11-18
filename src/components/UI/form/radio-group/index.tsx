import * as React from 'react';
import IComponent, {IOptionValue} from '../IComponent';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '../formElements/Radio';
import InputLabel from "../formElements/InputLabel";
import { IFieldChange } from '../IFieldChange';

interface IProps {
  component: IComponent;
  onChange?: IFieldChange;
  disabled?: boolean;
  row?: boolean
}

export default class RadioGroupField extends React.Component<IProps, {}> {
  constructor(props: IProps) {
    super(props);
  }

  public chageHandler = (event: any) => {
    if (this.props.onChange) {
      this.props.onChange({
        ...this.props.component,
        value: event.target.value
      });
    }
  };

  public renderRadio = (list: IOptionValue[] = [], currentValue : any)=>{

    return list.map((item: IOptionValue)=>{
        return ( <FormControlLabel
          key={item.label}
          value={item.value}
          checked={item.value == currentValue}
          control={<Radio color="primary" disabled={this.props.disabled}/> as React.ReactElement<any>}
          label={item.label}
        />)
    })
  }


  public render() {
    return (
      <div>
        <InputLabel htmlFor={this.props.component.sysname}>{this.props.component.label}</InputLabel>
        <RadioGroup
          // fullwidth={false}
          aria-label={this.props.component.label}
          name={this.props.component.sysname}
          className={this.props.component.className}
          value={this.props.component.value}
          onChange={this.chageHandler}
          row={this.props.component.row}
        >
        {this.renderRadio(this.props.component.valueList, this.props.component.value)}
      </RadioGroup>
    </div>
  );
  }

}
