import * as React from "react"
import AsyncSelect from 'react-select/lib/Async';
import * as styles from './styles.css';

class AsyncSelectCustom extends React.Component<any, any> {
  render() {
    const { props } = this;

    const config = {
      ...props,
      className: styles.asyncSelectContainer,
      classNamePrefix: 'asyncSelect',
      styles: {
        valueContainer: current => {
          return {
            ...current,
            height: 60,
            padding: 0,
            paddingLeft: 36,
            paddingRight: 52,
            borderRadius: 4,
          }
        },
        control: current => {
          return {
            ...current,
            border: 'solid 1px #e4e8ee',
            cursor: 'text',
            '&:hover': {
              borderColor: '#4786ff',
              borderWidth: 1,
            }
          }
        },
        indicatorSeparator: () => {
          return {
            display: 'none',
          }
        }
      }
    }

    return (
      <AsyncSelect {...config} />
    )
  }
}

export default AsyncSelectCustom
