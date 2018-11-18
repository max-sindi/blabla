import * as React from 'react';
import {compose, withProps} from 'recompose';
import {withGoogleMap, GoogleMap, Marker} from 'react-google-maps';
import Paper from '@material-ui/core/Paper';

interface IDirectionMapContentProps {
    location: any;
}

class MapContent extends React.Component<IDirectionMapContentProps> {
    public render() {
        return (
            <Paper>
                <GoogleMap
                    defaultZoom={7}
                    defaultCenter={new google.maps.LatLng(this.props.location.point.coordinates[0], this.props.location.point.coordinates[1])}
                >
                    <Marker position={{lat: this.props.location.point.coordinates[0], lng: this.props.location.point.coordinates[1]}}/>
                </GoogleMap>
            </Paper>
        );
    }
}

const PointMap = compose<IDirectionMapContentProps,
    IDirectionMapContentProps>(
    withProps({
            containerElement: <div style={{height: `100%`}}/>,
            mapElement: <div style={{height: `100%`}}/>,
    }),
    withGoogleMap
)(MapContent);

export default PointMap;