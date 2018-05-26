import React from 'react';
import Aux from '../../../hoc/Aux';

const rentZestimate = (props) => {
    return (
        <Aux>
            {props.rentZestimate ?
                <p>
                    Your monthly rental zestimate falls in the range of
                ${props.rentZestimateLow} - ${props.rentZestimateHigh}
                </p>
                : ''}
            <p></p>
            <p>
                <label htmlFor="expectedRent">Expected Monthly Rent:</label>
                <input
                    className="form-control input-sm"
                    type="text"
                    name="expectedRent"
                    onChange={(event) => props.onchange(event)}
                    onBlur={(event) => props.onblur(event)}
                />
            </p>
        </Aux>
    );
}

export default rentZestimate;