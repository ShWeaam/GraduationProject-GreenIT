import React from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"

const MapLocation = withScriptjs(withGoogleMap((props) => {
    return (
        <GoogleMap
            defaultZoom={14}
            defaultCenter={props.mapLocation}
        >
            <Marker position={props.mapLocation} />
        </GoogleMap>
    )
}));

export default MapLocation;