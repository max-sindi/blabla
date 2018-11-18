import AsyncSelect from '../form/formElements/AsyncSelect';
import * as React from "react";
import {getParsedPlaceDetails, googlePlacesAutocomplete} from "./place-autocomplete";
import Button from '../form/formElements/Button';
import Select from '../form/formElements/Select';
import InputLabel from '../form/formElements/InputLabel';
import TextField from '../form/formElements/Input';
import Grid from '@material-ui/core/Grid';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import Close from '@material-ui/icons/Close';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import { locationTypes } from '../../orders/locations/locationConfig';
import * as globalStyles from '../../../index.css';
import * as styles from './style.css';
import LocationIcon from './assets/LocationIcon';
import DateIcon from './assets/DateIcon';
import NameIcon from './assets/NameIcon';
import PhoneIcon from './assets/PhoneIcon';
const g = globalStyles;

export default class AddressSelect extends React.Component<any, {}> {
  public serializePlaces = (suggestions: any[]): { value: string, label: string, place: any }[] => {
    if (suggestions) {
      return suggestions.map(place => ({value: place.description, label: place.description, place}));
    }
    return [];
  };

  private loadOptions = (inputValue: string, callback: (returnData: any[]) => any[]) => {
    if (inputValue) {
      googlePlacesAutocomplete(inputValue, (data) => {
        callback(this.serializePlaces(data));
      });
    }
  };

  private onChange = (data): void => {
    if (data && data.place) {
      getParsedPlaceDetails(data.place.place_id, (parsed) => {
        const { index } = this.props;
        const completeAddress = this.serializeAddress(parsed, data.value);
        const { country, region, city, street: address } = completeAddress;
        const changes = { country, region, city, address };
        this.props.selectLocation({ value: completeAddress.latLng, index });
        this.props.changeLocationField({ changes, index });
      });
    }
  };

  private serializeAddress = (data: any, place: any): any => {
    return {
      country: data.countryLong,
      region: data.county ? data.county : data.stateLong ? data.stateLong : data.city,
      city: data.city,
      street: data.streetName,
      number: data.streetNumber,
      latLng: {lat: data.lat, lng: data.lng},
      place,
    };
  }

  moveLocationInList = (direction: number) => {
    const { index } = this.props;
    this.props.moveLocationInList({ index, direction });
  }

  render() {
    const { props } = this;
    const { index, locationsLength, location } = props;

    return (
      <div className={styles.body}>
        <div className={`${g.mb20}`}>
          <Grid container>
            <Grid item>
              <div className={`${g.flex} ${g.aic}`}>
                <div className={styles.movingButtonsWrap}>
                  <Grid container direction='column'>
                    <Button
                      disabled={index === 0}
                      onClick={() => this.moveLocationInList(-1)}
                      className={styles.movingButton}
                      data-buttontype='lightBlue'
                    >
                      <KeyboardArrowUp />
                    </Button>
                    <Button
                      disabled={locationsLength === index + 1}
                      onClick={() => this.moveLocationInList(1)}
                      className={styles.movingButton}
                      data-buttontype='lightBlue'
                    >
                      <KeyboardArrowDown />
                    </Button>
                  </Grid>
                </div>
                <div className={styles.pointHeader}>
                  Пункт {index + 1}
                </div>
              </div>
            </Grid>
            <div className={`${g.flex} ${g.jcsb} ${g.fg1} ${g.aic}`}>
              <FormControl>
                <Select
                  value={locationTypes[location.value] ? location.value : 'placeholder'}
                  onChange={ e => props.changeLocationField({ changes: {value: e.target.value}, index })}
                >
                  {/* placeholder */}
                  <MenuItem value="placeholder" disabled children="Тип загрузки" className={`${g.dn}`} />
                  {/* selectable options */}
                  {locationTypes.map( (item, index) => {
                    return (
                      <MenuItem
                        key={item.sysname}
                        value={index}
                        children={item.label}
                      />
                    )
                  })}
                </Select>
              </FormControl>
              <Button
                onClick={() => this.props.deleteLocation(index)}
                className={styles.closeButton}
                data-buttontype={'transparent'}
              >
                <Close />
              </Button>
            </div>
          </Grid>
        </div>

        {/* Location search and control buttons */}
        <Grid container direction="column" alignItems='center'>
          <div className={`${g.mb7} ${g.w100p} ${styles.locationSelect}`}>
            <div className={styles.locationSelectIcon}>
              <LocationIcon/>
            </div>
            <AsyncSelect
              cacheOptions
              loadOptions={this.loadOptions}
              onChange={this.onChange}
              icon={ <LocationIcon /> }
              defaultInputValue={
                  (this.props.isEdit && location.fromDatabase  &&
                `${ location.address && `${location.address}, `}` +
                `${ location.region && `${location.region}, `}` +
                `${ location.country && `${location.country}`}`)
                    || ''
              }
            />
          </div>

          {/* contacts and date */}
          <div className={styles.inputWrap}>
            <TextField
              placeholder="Дата:"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={e => props.changeLocationField({ changes: {date: e.target.value}, index })}
              value={location.date || ''}
              className={`${g.w100p} ${g.mb7}`}
              InputProps={{
                startAdornment: <DateIcon />,
                'data-added-class': styles.inputInner,
              }}
            />
          </div>
          <div className={styles.inputWrap}>
            <TextField
              placeholder="Имя"
              onChange={ e => props.changeLocationField({ changes: { name: e.target.value }, index })}
              value={props.location.name || ''}
              className={`${g.w100p} ${g.mb7}`}
              InputProps={{
                startAdornment: <NameIcon />,
                'data-added-class': styles.inputInner,
              }}
            />
          </div>
          <div className={styles.inputWrap}>
            <TextField
              placeholder="Номер телефона"
              onChange={ e => props.changeLocationField({ changes: { phone_number: e.target.value }, index })}
              value={props.location.phone_number || ''}
              className={`${g.w100p} ${g.mb7}`}
              InputProps={{
                startAdornment: <PhoneIcon />,
                'data-added-class': styles.inputInner,
              }}
            />
          </div>
        </Grid>
      </div>
    );
  }
}
