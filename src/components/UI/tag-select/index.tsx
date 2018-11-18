import * as React from 'react';
import AsyncSelect from 'react-select/lib/Async';
import axios from 'axios';
import getUrl from "../../../actions/url";
import Add from '@material-ui/icons/Add';

const searchTags = (input: string) => {

}

class TagSearch extends React.Component {
  constructor(public props: any) {
    super(props);
  }

  public render() {
    const styles = {
      control: current => {
        return {
          ...current,
          padding: '15px 20px 5px 10px',
          border: '1px solid #dae7ff',
          borderRadius: 6,
          pointer: 'text',
          '&:hover': {
            borderColor: '#dae7ff',
          }
        }
      },
      controlIsFocused: current =>{
        return {
          ...current,
          borderColor: 'red'
        }
      },
      valueContainer: current => {
        return {
          ...current,
          minHeight: 60,
          padding: 0,
          borderRadius: 4,
          fontFamily: 'Roboto'
        }
      },
      multiValue: current => {
        return {
          ...current,
          backgroundColor: '#dae7ff',
          padding: '15px 23px',
          borderRadius: 25,
          border: 'none',
          margin: '0 10px 10px 0',
        }
      },
      multiValueLabel: current => {
        return {
          ...current,
          fontSize: 14,
          fontWeight: 500,
          color: '#4786ff',
          textTransform: 'uppercase',
        }
      },
      multiValueRemove: current => {
        return {
          ...current,
          color: 'rgba(0, 0, 0, 0.38)',
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: 'transparent',
            color: 'rgba(0, 0, 0, 0.38)',
          }
        }
      },
      indicatorSeparator: () => {
        return {
          display: 'none',
        }
      },
      clearIndicator: () => {
        return {
          display: 'none',
        }
      },
      placeholder: current =>{
        return {
          ...current,
          margin: 0,
          paddingBottom: 10,
        }
      }
    }

    const DropdownIndicator = props => {
      return <Add style={{ color: '#4786ff'}}/>
    }

    return (
      <div>
        <AsyncSelect
          isMulti
          cacheOptions
          defaultOptions
          loadOptions={this.promiseOptions}
          onChange={this.props.updateTags}
          value={this.props.value}
          styles={styles}
          classNamePrefix='select'
          components={{ DropdownIndicator, }}
        />
      </div>
    );
  }

  public promiseOptions = inputValue =>
    new Promise(resolve => {
      const url = getUrl() + `/customers/orders/tags/?${inputValue}`;
      axios.get(url)
        .then(({data}) => {
          const isInside = data.some(tag => tag.name.includes(inputValue));
          let tags;
          if(isInside){
            tags = this.serializeResponse(data);
          } else {
            tags = this.serializeResponse([{name: inputValue}]);
          }

          resolve(tags);
        });
    });

  public serializeResponse(raw) {
    return raw.map(rawTag => ({
      value: rawTag.name,
      label: rawTag.name
    }));
  }
}

export default TagSearch;
