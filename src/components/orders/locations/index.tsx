import * as React from 'react';
import Add from '@material-ui/icons/Add';

import Grid from '@material-ui/core/Grid';
import DirectionMap from '../../UI/direction-map';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormLabel from '@material-ui/core/FormLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Divider from '@material-ui/core/Divider';
import Radio from '../../UI/form/formElements/Radio';
import Button from '../../UI/form/formElements/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Select from '@material-ui/core/Select';
import AddressInput, { IAddressInputProps } from '../../UI/address-input';
import MenuItem from '@material-ui/core/MenuItem';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import { connect } from 'react-redux';
import {
  addNewLocation,
  moveLocationInList,
  selectLocation,
  deleteLocation ,
  changeLocationField,
  changeLocationType,
} from '../../../actions/locations';

import * as styles from './style.css';
import * as globalStyles from '../../../index.css'
import AddressSelect from "../../UI/address-select";
import ErrorBoundary from "../../UI/ErrorBoundary";

const g = globalStyles;

class Locations extends React.Component<any, {}> {

  componentDidUpdate = (prevProps) => {
    const { editableData } = this.props;

    if(!prevProps.editableData && editableData) {
      this.setState(state => {
        return {
          ...state,
          loading: editableData.loading,
          type: editableData.exportation,
        }
      })
    }
  }

  public render() {
    const { locations } = this.props;
    const wrapperClasses = `${styles.locationPointWrap} ${globalStyles.blueBorder} ${globalStyles.shadowNone} ` +
                           `${globalStyles.p10}`
    const Tags = this.props.tagsComponent;

    const res = (
      <Grid container={true} direction="row">
        <Grid
          container={true}
          spacing={8}
          sm={6}
          item={true}
          className={styles.tableContainer}
          direction="column"
        >
          <Grid>
            {locations.allLocations.map( (location, index, arr) => (
              <Paper className={wrapperClasses} key={location.id}>
                <AddressSelect
                  location={location}
                  index={index}
                  locationsLength={arr.length}
                  isEdit={!!this.props.editableData}
                  {...this.props}
                />
              </Paper>
            ))}
          </Grid>
          <Grid container={true} direction="column" className={g.mb30}>
            <Button onClick={this.props.addNewLocation}>
              Добавить локацию <Add className={globalStyles.ml20}/>
            </Button>
          </Grid>
          <div className="">
            <div className={styles.tagsTitle}>
              Дополнительные условия
            </div>
            <Tags {...this.props.tagParams} />
          </div>
        </Grid>
        <Grid sm={6} item={true}>
          <DirectionMap
            locations={locations}
          />
        </Grid>
      </Grid>
    );

    return (
      <ErrorBoundary>
        {res}
      </ErrorBoundary>
      );
  }


}

function mapStateToProps(state: any) {
  return {
    locations: state.locations,
  };
}

function mapDispatchToProps(dispatch: any) {
  return {
    addNewLocation: () => {
      dispatch( addNewLocation() );
    },
    moveLocationInList: (params) => {
      dispatch( moveLocationInList(params) );
    },
    selectLocation: (params) => {
      dispatch( selectLocation(params) );
    },
    deleteLocation: (index) => {
      dispatch( deleteLocation(index) );
    },
    changeLocationField: (params) => {
      dispatch( changeLocationField(params) );
    },
    changeLocationType: (params) => {
      dispatch( changeLocationType(params) );
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Locations);


  // <FormControl component="fieldset" className={styles.formControl}>
  //   <FormLabel component="legend">Тип Перевозки</FormLabel>
  //   <RadioGroup
  //     aria-label="Gender"
  //     name="gender2"
  //     className={styles.group}
  //     value={this.props.transportationType}
  //     onChange={e => {
  //       // TS compiler strange behavior
  //       const value = e.target['value']
  //       this.props.updateParentState({ transportationType: value})}
  //     }
  //   >
  //     <FormControlLabel
  //       value="importation"
  //       control={<Radio />}
  //       label="Импорт"
  //     />
  //     <FormControlLabel
  //       value="exportation"
  //       control={<Radio />}
  //       label="Экспорт"
  //     />
  //   </RadioGroup>
  // </FormControl>


    // <FormControl component="fieldset" className={styles.formControl}>
    //   <FormLabel component="legend">Тип Подачи</FormLabel>
    //   <RadioGroup
    //     aria-label="Gender"
    //     name="gender2"
    //     className={styles.group}
    //     value={this.props.loadingType}
    //     onChange={e => {
    //       // TS compiler strange behavior
    //       const value = e.target['value']
    //       this.props.updateParentState({ loadingType: value })}
    //     }
    //   >
    //     <FormControlLabel
    //       value="directloading"
    //       control={<Radio disabled={this.props.transportationType === 'importation'} />}
    //       label="Прямая Подача"
    //     />
    //     <FormControlLabel
    //       value="backloading"
    //       control={<Radio disabled={this.props.transportationType === 'importation'} />}
    //       label="Обратка"
    //     />
    //   </RadioGroup>
    // </FormControl>
