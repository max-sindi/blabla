import * as React from 'react';
import { compose, withProps, lifecycle } from 'recompose';
import {
  // withScriptjs,
  withGoogleMap,
  GoogleMap,
  DirectionsRenderer
} from 'react-google-maps';
import Paper from '@material-ui/core/Paper';
import logger from '../../../utils/logger';

interface IDirectionMapContentProps {
  locations: any;
  directions?: any;
}

const setWaypoints = (waypoints: any) => {
  return waypoints
    .map((item: any) => {
      const { latLng } = item;

      return {
        stopover: true,
        location: new google.maps.LatLng(latLng.lat, latLng.lng)
      };
    });
};

class DirectionMapContent extends React.Component<IDirectionMapContentProps> {
  public render() {
    return (
      <Paper>
        <GoogleMap
          defaultZoom={7}
          defaultCenter={new google.maps.LatLng(46.484583, 30.732600000000048)}
        >
          {this.props.directions && (
            <DirectionsRenderer directions={this.props.directions} />
          )}
        </GoogleMap>
      </Paper>
    );
  }
}

const DirectionMap = compose<
  IDirectionMapContentProps,
  IDirectionMapContentProps
>(
  withProps((props: IDirectionMapContentProps) => {
    return {
      // googleMapURL:'https://maps.googleapis.com/maps/api/js?key=AIzaSyC4R6AN7SmujjPUIGKdyao2Kqitzr1kiRg&v=3.exp&libraries=geometry,drawing,places',
      // loadingElement: <div style={{ height: `100%` }} />,
      containerElement: <div style={{ height: `400px` }} />,
      mapElement: <div style={{ height: `100%` }} />,
      locations: props.locations,
    };
  }),
  // withScriptjs,
  withGoogleMap,
  lifecycle({
    componentWillReceiveProps(props: IDirectionMapContentProps) {
      const allLocations = props.locations.allLocations.filter( item => item.latLng);

      if(allLocations.length === 0) {
        return;
      }

      const locationsPointsCount = allLocations.length;
      const from = allLocations[0].latLng;
      const to = allLocations[locationsPointsCount - 1].latLng;

      const DirectionsService = new google.maps.DirectionsService();
      const waypoints = (locationsPointsCount > 2 && allLocations.slice(1, locationsPointsCount - 1)) || [];

      DirectionsService.route(
        {
          origin: new google.maps.LatLng(from.lat, from.lng),
          destination: new google.maps.LatLng(to.lat, to.lng),
          waypoints: setWaypoints(waypoints),
          travelMode: google.maps.TravelMode.DRIVING
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            this.setState({
              directions: result
            });
          } else {
            logger.warn(`error fetching directions ${result}`);
          }
        }
      );
    }
  })
)(DirectionMapContent);

export default DirectionMap;
