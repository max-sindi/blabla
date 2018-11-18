import * as React from 'react';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from 'react-places-autocomplete';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Place from '@material-ui/icons/Place';
import GeocoderResult = google.maps.GeocoderResult;
import {PropTypes} from "@material-ui/core";
import logger from '../../../utils/logger';

interface IAddressInputState {
  address: string;
}

export interface IPlaceData {
  address: string;
  country?: string;
  region?: string;
  city?: string;
  latLng: any;
  geoData?: GeocoderResult;
}

export interface IAddressInputProps  {
  sysname: string;
  label?: string;
  value?: IPlaceData | null;
  disabled?: boolean;
  onChange?: (location: IPlaceData) => void;
  fullWidth?: boolean;
  margin?: PropTypes.Margin;
  className?: string;
}

interface ISearchInput {
  getInputProps: any;
  suggestions: any;
  getSuggestionItemProps: any;
  loading: any;
}


export function convertGeoDataToPlace(geoData: GeocoderResult): IPlaceData {
  const place: IPlaceData = {
    country: '',
    region: '',
    city: '',
    address: geoData.formatted_address,
    latLng: geoData.geometry.location.lat() + ',' + geoData.geometry.location.lng(),
    geoData: geoData,
  };

  let areaLevel1, areaLevel2, areaLevel3;
  geoData.address_components.forEach(addr =>  {
    if (addr.types.indexOf('country') !== -1) {
      place.country = addr.long_name;
    } else if(addr.types.indexOf('administrative_area_level_1') !== -1) {
      areaLevel1 = addr.long_name;
    } else if(addr.types.indexOf('administrative_area_level_2') !== -1) {
      areaLevel2 = addr.long_name;
    } else if(addr.types.indexOf('administrative_area_level_3') !== -1) {
      areaLevel3 = addr.long_name;
    } else if(addr.types.indexOf('locality') !== -1) {
      place.city = addr.long_name;
    }
  });

  if (areaLevel1) {
    place.region = areaLevel1;
  } else if (areaLevel2) {
    place.region = areaLevel2;
  } else if (areaLevel3) {
    place.region = areaLevel3;
  }

  return place;
}


export default class AddressInput extends React.Component<IAddressInputProps,IAddressInputState> {
  constructor(props: any) {
    super(props);
    this.state = { address: this.props.value && this.props.value.address ? this.props.value.address : ''  };
  }


  public handleChange = (address: any) => {
    this.setState({ address });
    if (this.props.onChange) {
      this.props.onChange({
        address: address,
        latLng: '',
      });
    }
  };

  public handleSelect = (address: any) => {

    if(this.state.address !== address){
      this.handleChange(address);
    }

    geocodeByAddress(address)
      .then((results) => {
        logger.debug('geocodeByAddress() results', results);
        this.props.onChange(convertGeoDataToPlace(results[0]));
      });
  };

  public render() {
    return (
      <PlacesAutocomplete
        value={this.state.address}
        onChange={this.handleChange}
        onSelect={this.handleSelect}
        disabled={this.props.disabled}
        >
        {({
          getInputProps,
          suggestions,
          getSuggestionItemProps,
          loading
        }: ISearchInput) => (
          <div>
            <TextField
              {...getInputProps({
                placeholder: 'Search Places ...',
                className: 'location-search-input',
              })}
              margin="dense"
              label={this.props.label}
              disabled={this.props.disabled}
              fullWidth={true}
              InputLabelProps={{
                shrink: true
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Place />
                  </InputAdornment>
                )
              }}
            />
            <div className="autocomplete-dropdown-container">
              {loading && <div>Loading...</div>}
              {suggestions.map((suggestion: any) => {
                const className = suggestion.active
                  ? 'suggestion-item--active'
                  : 'suggestion-item';
                // inline style for demonstration purpose
                const style = suggestion.active
                  ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                  : { backgroundColor: '#ffffff', cursor: 'pointer' };
                return (
                  <div
                    key={suggestion.description}
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style
                    })}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
    );
  }
}
