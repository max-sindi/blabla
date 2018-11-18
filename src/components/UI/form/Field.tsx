import * as React from 'react';
import TextField from './formElements/Input';
import Checkbox from './formElements/Checkbox';
import Button from './formElements/Button';
import FormControlLabel from './formElements/FormControlLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import Email from '@material-ui/icons/Email';
import Phone from '@material-ui/icons/Phone';
import PasswordInput from './password-input';
import IComponent from './IComponent';
import { IFieldChange } from './IFieldChange';
import RadioGroupField from './radio-group';
import SelectField from './select';
import AddressInput from '../address-input/index';
import * as styles from './style.css';
import SearchableInput from './searchableInput';
import logger from '../../../utils/logger';


interface IFieldProps {
    component: IComponent;
    onChange: IFieldChange;
    onReset?: IFieldChange;
    autocompleteRequests?: object;
}

export default ({component, onChange, autocompleteRequests}: IFieldProps) => {

    const setValue = (component: IComponent) => {
        return (event: any) => {
            const changedComponent = Object.assign({}, component);
            changedComponent.value = event.target.value;
            onChange(changedComponent);
        };
    };

    const setCheckboxBooleanValue = (component: IComponent) => {
        return (event: any) => {
            component.value = !component.value;
            onChange(component);
        };
    };

    const setAddressValue = (component: IComponent) => {
        return (event: any) => {
            logger.debug('setAddressValue()', component, event);
            const updatedComponent = Object.assign({}, component);
            updatedComponent.value = event;
            onChange(updatedComponent);
        };
    };


    const onResetBtnClick = (component) => {
        if (component) {
            component.value = '';
            onChange(component);
        }
    };


    const renderReset = (component) => {
        if (!component.resetButton) {
            return null;
        }

        return (
            <Button
                onClick={onResetBtnClick.bind(null, component)}
                size="small"
                mini={true}
                className="resetBtn"
            >
                ❌
            </Button>);
    };


    const renderComponent = (component: IComponent) => {

        if (typeof component.visible === 'boolean' && !component.visible) {
            return null;
        }

        const margin = component.margin ? component.margin : 'dense';
        const fullWidth = component.width ? (component.width === 'full') : true;
        const widthCss = component.width ? styles[component.width] : '';
        const inline = component.inline ? styles.inline : '';

        const containerClass = [styles.formField, widthCss, inline, component.className].join(' ');
        const style = {};

        const lineBreak = component.lineBreak ? <br/> : null;

        switch (component.type) {
            case 'text':
            case 'number':
                return (
                    <div className={containerClass}
                         style={style}
                    >
                        <TextField
                            type={component.type}
                            key={component.sysname}
                            label={component.label}
                            disabled={component.disabled}
                            value={component.value}
                            onChange={setValue(component)}
                            helperText={
                                component.helperText
                                    ? component.helperText
                                    : component.defaultHelperText
                            }
                            InputLabelProps={{
                                shrink: true
                            }}
                            error={!component.valid && !component.pristine}
                            margin={margin}
                            fullWidth={fullWidth}
                        />
                        {renderReset(component)}
                        {lineBreak}
                    </div>
                );

            case 'email':
                return (
                    <div className={containerClass}
                         style={style}>
                        <TextField
                            key={component.sysname}
                            label={component.label}
                            value={component.value}
                            disabled={component.disabled}
                            onChange={setValue(component)}
                            helperText={
                                component.helperText
                                    ? component.helperText
                                    : component.defaultHelperText
                            }
                            error={!component.valid && !component.pristine}
                            margin={margin}
                            fullWidth={fullWidth}
                            className={component.className}
                            InputLabelProps={{
                                shrink: true
                            }}
                            InputProps={{
                                startAdornment: !component.disableIcon && (
                                    <InputAdornment position="start">
                                        <Email/>
                                    </InputAdornment>
                                )
                            }}
                        />
                        {renderReset(component)}
                        {lineBreak}
                    </div>
                );

            case 'password':
                return (
                    <div className={containerClass}
                         style={style}>
                        <PasswordInput
                            key={component.sysname}
                            label={component.label}
                            value={component.value}
                            disabled={component.disabled}
                            InputLabelProps={{
                                shrink: true
                            }}
                            helperText={
                                component.helperText
                                    ? component.helperText
                                    : component.defaultHelperText
                            }
                            onChange={setValue(component)}
                            error={!component.valid && !component.pristine}
                            margin={margin}
                            fullWidth={fullWidth}
                        />
                        {renderReset(component)}
                        {lineBreak}
                    </div>
                );

            case 'phone':
                return (
                    <div className={containerClass}
                         style={style}>
                        <TextField
                            key={component.sysname}
                            label={component.label}
                            value={component.value}
                            disabled={component.disabled}
                            onChange={setValue(component)}
                            error={!component.valid && !component.pristine}
                            helperText={
                                component.helperText
                                    ? component.helperText
                                    : component.defaultHelperText
                            }
                            InputLabelProps={{
                                shrink: true
                            }}
                            margin={margin}
                            fullWidth={fullWidth}
                            className={component.className}
                            InputProps={{
                                startAdornment: !component.disableIcon && (
                                    <InputAdornment position="start">
                                        <Phone/>
                                    </InputAdornment>
                                )
                            }}
                        />
                        {renderReset(component)}
                        {lineBreak}
                    </div>
                );

            case 'date':
                return (
                    <div className={containerClass}
                         style={style}>
                        <TextField
                            type="date"
                            key={component.sysname}
                            label={component.label}
                            value={component.value}
                            disabled={component.disabled}
                            onChange={setValue(component)}
                            helperText={
                                component.helperText
                                    ? component.helperText
                                    : component.defaultHelperText
                            }
                            InputLabelProps={{
                                shrink: true
                            }}
                            error={!component.valid && !component.pristine}
                            margin={margin}
                            fullWidth={fullWidth}
                            className={component.className}
                        />
                        {renderReset(component)}
                        {lineBreak}
                    </div>
                );

      case 'time':
        return (
          <div className={containerClass}
               style={style}>
            <TextField
              type='time'
              key={component.sysname}
              label={component.label}
              value={component.value}
              disabled={component.disabled}
              onChange={setValue(component)}
              helperText={
                component.helperText
                  ? component.helperText
                  : component.defaultHelperText
              }
              inputProps={component.inputProps}
              InputLabelProps={{
                shrink: true
              }}
              error={!component.valid && !component.pristine}
              margin={margin}
              fullWidth={fullWidth}
              className={component.className}
              style={{marginRight: '1em'}}
            />
            { renderReset(component) }
            { lineBreak}
          </div>
        );

        case 'datetime':
        return (
          <div className={containerClass}
               style={style}>
            <TextField
              type="datetime-local"
              key={component.sysname}
              label={component.label}
              value={component.value}
              disabled={component.disabled}
              onChange={setValue(component)}
              helperText={
                component.helperText
                  ? component.helperText
                  : component.defaultHelperText
              }
              inputProps={component.inputProps}
              InputLabelProps={{
                shrink: true
              }}
              error={!component.valid && !component.pristine}
              margin={margin}
              fullWidth={fullWidth}
              className={component.className}
              style={{marginRight: '1em'}}
            />
            { renderReset(component) }
            { lineBreak}
          </div>
        );

            case 'checkboxBoolean': // TODO set valid/invalid state, error message
                return (
                    <div className={containerClass}
                         style={style}>
                        <FormControlLabel
                            key={component.sysname}
                            control={
                                <Checkbox
                                    checked={component.value}
                                    disabled={component.disabled}
                                    onChange={setCheckboxBooleanValue(component)}
                                    className={component.className}
                                />
                            }
                            label={component.label}
                        />
                        {renderReset(component)}
                        {lineBreak}
                    </div>
                );

            case 'radio': // TODO set valid/invalid state, error message
                return (
                    <div className={containerClass}
                         style={style}>
                        <RadioGroupField
                            component={component}
                            disabled={component.disabled}
                            onChange={onChange}
                            row={component.row}
                        />
                        {renderReset(component)}
                        {lineBreak}
                    </div>
                );

            case 'select': // TODO set valid/invalid state, error message
                return (
                    <div className={containerClass}
                         style={style}>
                        <SelectField
                            component={component}
                            className={component.className}
                            disabled={component.disabled}
                            onChange={onChange}
                        />
                        {renderReset(component)}
                        {lineBreak}
                    </div>
                );

            case 'address-input':
                return (
                    <div className={containerClass}
                         style={style}>
                        <AddressInput
                            key={component.sysname}
                            sysname={component.sysname}
                            label={component.label}
                            value={component.value}
                            disabled={component.disabled}
                            onChange={setAddressValue(component)}
                            margin={margin}
                            fullWidth={fullWidth}
                            className={component.className}
                        />
                        {renderReset(component)}
                        {lineBreak}
                    </div>
                );

            case 'searchable-input':
              return (

                <div className={containerClass}>
                  <SearchableInput
                    {...component}
                    component={component}
                    className={containerClass}
                    autocompleteRequests={autocompleteRequests}
                    onChange={setValue(component)}
                  />

                  { renderReset(component) }
                </div>
              );

            default:
                return (
                    <div className={containerClass}
                         style={style}>
                        <TextField
                            key={component.sysname}
                            label={component.label}
                            value={component.value}
                            disabled={component.disabled}
                            helperText={
                                component.helperText
                                    ? component.helperText
                                    : component.defaultHelperText
                            }
                            onChange={setValue(component)}
                            InputLabelProps={{
                                shrink: true
                            }}
                            error={!component.valid && !component.pristine}
                            margin={margin}
                            fullWidth={fullWidth}
                            className={component.className}
                        />
                        {renderReset(component)}
                        {lineBreak}
                    </div>
                );
        }
    };

    return renderComponent(component);
};
