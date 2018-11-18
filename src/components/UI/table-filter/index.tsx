import * as React from 'react';
import ErrorBoundary from "../../UI/ErrorBoundary";

import Form from '../../UI/form/index';
import IComponent, {IOptionValue} from '../form/IComponent';
import Button from '@material-ui/core/Button';
import {PropTypes} from '@material-ui/core';
import {findProperty} from '../../../utils/field-list';
import * as styles from './style.css';
import logger from '../../../utils/logger';

export interface ITableFilter {
    sysname: string;
    type: string;
    label: string;
    apiOptionName: string;
    valueList?: IOptionValue[];
    value?: any;
    className?: string;
    inputProps?: any;
    margin?: PropTypes.Margin;
    width?: 'xs' | 'sm' | 'md' | 'xl' | 'xxl' | 'full';
    resetButton?: boolean;
    inline?: boolean;
    lineBreak?: boolean;
}


export interface ITableFilterProps {
  filters: ITableFilter[];
  onFilter: (any) => any,
  onChange?: any;
  autocompleteRequests?: object;
}

export default class TableFilter extends React.Component<ITableFilterProps, {}> {
  public state = {
    fields: [],
  };

  constructor(props: ITableFilterProps) {
    super(props);
  }

  public componentDidMount() {
    this.state.fields = this.generateFieldsData();
  }

  public render() {
    this.updateSelectsValueLists();

    return (
      <ErrorBoundary>
        <div className={styles.tableFilter}>
          <Form formFields={this.state.fields}
                onFormChange={this.onFormChanged}
                autocompleteRequests={this.props.autocompleteRequests}
          />

          {/*<Button*/}
          {/*variant="contained"*/}
          {/*component="span"*/}
          {/*onClick={this.onFilterBtn}*/}
          {/*style={{marginLeft : '2em'}}*/}
          {/*>*/}
          {/*Фильтр*/}
          {/*</Button>*/}

          <Button
            variant="contained"
            component="span"
            onClick={this.onResetBtn}
            style={{marginLeft : '2em'}}
          >
            Сбросить
          </Button>
        </div>
      </ErrorBoundary>
    );
  }


  public onFormChanged = (data: IComponent[]) => {
          logger.debug('onFormChanged():', data);

          this.setState(prevState => {
              return {
                  ...prevState,
                  fields: data
              };
          }, this.onFilterBtn);
      };


  public onFilterBtn = () => {
        this.props.onFilter({
            fields: this.state.fields,
            requestData: this.convertFieldsToRequest(),
        });
    };



    public onResetBtn = () => {
        const newFieldsState = this.state.fields.map(field => {
            field.value = (field.type === 'date' ||  field.type === 'searchable-input' || field.type === 'text') ? '' : null;
            return field;
        });

        this.setState(prevState => {
            return {
                ...prevState,
                fields: newFieldsState
            };
        }, this.onFilterBtn);
    };



  public updateSelectsValueLists() {
    this.props.filters.forEach(filter => {
      if (filter.type == 'select' && filter.valueList && filter.valueList.length > 0) {
        let formField = findProperty(filter.sysname, this.state.fields);
        if (formField) {
          formField.valueList = filter.valueList;
        }
      }
    });

  }


  // generate form fields data drom filter data
  private generateFieldsData() : IComponent[]{
    return this.props.filters.map(filter => {
      return {
        sysname : filter.sysname,
        apiOptionName : filter.apiOptionName,
        label: filter.label,
        type: filter.type,
        valueList: filter.valueList,
        pristine: true,
        valid: true,
        inputProps: filter.inputProps,
        row: true,
        width : filter.width,
        margin : filter.margin,
        className: 'field ' + filter.width,
        resetButton: (filter.resetButton === undefined) ? true : filter.resetButton,
        inline: filter.inline,
        lineBreak: filter.lineBreak,
      }
    });
  }

  private convertFieldsToRequest = () => {
    const params:any = {};

    this.state.fields.forEach(field => {
      if (field.value) {
        let val;
        if (field.type == 'datetime') {
          val = field.value.toString().replace('T', ' ');
        } else {
          val = field.value;
        }

        params[field.apiOptionName] = val;
      }
    });

    return params;
  };

}
