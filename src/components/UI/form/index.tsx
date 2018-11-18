import * as React from 'react';
import ErrorBoundary from "../../UI/ErrorBoundary";

import Field from './Field';
import IComponent from './IComponent';
import Grid from '@material-ui/core/Grid';
import { validate, getMessage } from '../../../utils/validation';

interface IFormProps {
  formFields: any[];
  onFormChange: any;
  onInputChange?: (changedComponent: IComponent) => void;
  className?: string;
  nextColumnsStart?: number[];
  autocompleteRequests?: object;
}

export default class Form extends React.Component<IFormProps, {}> {
  constructor(props: IFormProps) {
    super(props);
  }

  public validateComponent(changedComponet: IComponent) {
    changedComponet.pristine = false;
    const validateResult = validate(
        changedComponet.value,
        changedComponet.validationRules,
        this.props.formFields
    );
    if (
      changedComponet.validationRules &&
      !validateResult.valid
    ) {
      return this.setInvalidComponent(
        changedComponet,
        getMessage(changedComponet.validationRules, validateResult.rule)
      );
    }
    return this.setValidComponent(changedComponet);
  }

  public setInvalidComponent(changedComponet: IComponent, message: string) {
    changedComponet.valid = false;
    changedComponet.helperText = message;
    return changedComponet;
  }

  public setValidComponent(changedComponet: IComponent) {
    changedComponet.valid = true;
    changedComponet.helperText = changedComponet.defaultHelperText
      ? changedComponet.defaultHelperText
      : '';
    return changedComponet;
  }

  public changeFieldSet = (changedComponet: IComponent) => {
    const newState = this.props.formFields.map((component) => {
      if (changedComponet.sysname === component.sysname) {
        const updatedComponent = this.validateComponent(changedComponet);
        if (this.props.onInputChange) {
          this.props.onInputChange(updatedComponent);
        }
        return updatedComponent;
      }
      return component;
    });
    this.props.onFormChange(newState);
  };

  public resetField = (changedComponet: IComponent) => {
    const newState = this.props.formFields.map((component) => {
      if (changedComponet.sysname === component.sysname) {
        changedComponet.value = null;
        changedComponet.pristine = true;

        if (this.props.onInputChange) {
          this.props.onInputChange(changedComponet);
        }

        return changedComponet;
      } else {
        return component;
      }
    });

    this.props.onFormChange(newState);
  };


  public render() {
    const { props } = this;

    /*
      You can pass this prop to form component if you want a form in two or more columns.
      It must be an array which consist of numbers.
      First number need to be 0, and next numbers are indexes of formField array and that
      each number will be a start of new column.
    */
    if(props.nextColumnsStart) {
      return props.nextColumnsStart.map( (columnStart, columnArrIndex, columnArr) => {
        return (
          <ErrorBoundary>
            <Grid item key={columnStart}>
              {
                props.formFields.map( (value, i, arr) => {
                  const columnsNextItem = columnArr[columnArrIndex + 1];

                  if( (i >= columnStart && i < columnsNextItem) || (!columnsNextItem && i >= columnStart)) {
                    return (
                      <Field
                        key={value.sysname}
                        onChange={this.changeFieldSet}
                        component={value}
                      />
                    )
                  } else {
                    return null;
                  }
                })
              }
            </Grid>
          </ErrorBoundary>
        )
      })
    }

    const fields = props.formFields.map((value) => {
                    return (
                      <Field
                        key={value.sysname}
                        onChange={this.changeFieldSet}
                        onReset={this.resetField}
                        component={value}
                        autocompleteRequests={this.props.autocompleteRequests}
                      />
                    );
                  });

    return (
      <ErrorBoundary>
        {fields}
      </ErrorBoundary>

      );
  }
}
