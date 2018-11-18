import * as React from 'react';
import * as styles from './style.css';
import Select from 'react-select';

export default class SearchableInput extends React.Component<any, {}> {
  state = {
    value: '',
    valueIndex: null,
    isMenuOpen: true,
  }

  componentDidUpdate = () => {
    if(this.state.value && this.props.value === '') {
      this.setState({ value: '' })
    }
  };

  componentDidMount() {
    const { props, state } = this;
    const funcForRequest = props.autocompleteRequests[props.apiOptionName].funcForRequest;
    funcForRequest && funcForRequest(state.value);
  }

  render() {
    const { state, props } = this;
    const autocompleteConfig = props.autocompleteRequests[props.apiOptionName];
    const autocompletes = autocompleteConfig.resultStore;

    const selectConfig = {
      options: autocompletes && autocompletes.map( ({ region }) => ({ value: region, label: region })),
      placeholder: this.state.value,
      value: !state.value && '',
      onChange: e => {
        const { value } = e;
        this.setState(
          { value, isMenuOpen: false },
          this.props.onChange({ target: { value } }),
        );
      },
      styles: {
        control: base => ({
          ...base,
          border: 'none',
          borderBottom: '1px solid hsl(0,0%,80%)',
        }),
        placeholder: base => ({
          ...base,
          color: 'rgba(0, 0, 0, 0.87)',
        })
      }
    };

    return (
      <div className={this.props.className}>
        <label className={styles.label}>{props.label}</label>
        <div className={styles.selectWrap}>
          <Select {...selectConfig} />
        </div>
      </div>
    )
  }
}
