import React from 'react';
import Aux from '../../../../hoc/Aux';
import Autocomplete from 'react-google-autocomplete';

const address = (props) => {
    return (
        (props.mapsAPILoaded) ?
            <Aux>
                <label>Address:</label>
                <Autocomplete className="autocomplete form-control input-sm"
                    placeholder="Enter your address"
                    onPlaceSelected={(place) => props.onchange(place)}
                    types={['geocode']}
                    componentRestrictions={{ country: "us" }}
                />
            </Aux>
            : ''
    )
}

export default address;