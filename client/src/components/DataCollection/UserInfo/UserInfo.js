import React from 'react';
import Aux from '../../../hoc/Aux';

const userInfo = (props) => {
    return (
        <Aux>
            <p className="form-group input-group-sm">
                <label htmlFor="fname">First Name:</label>
                <input className="form-control input-sm"
                    type="text"
                    name="fname"
                    onChange={(event) => props.onchange(event)}
                    onBlur={(event) => props.onblur(event)}
                />
            </p>
            <p className="form-group input-group-sm">
                <label htmlFor="lname">Last Name:</label>
                <input className="form-control input-sm"
                    type="text"
                    name="lname"
                    onChange={(event) => props.onchange(event)}
                    onBlur={(event) => props.onblur(event)}
                />
            </p>
            <p className="form-group input-group-sm">
                <label htmlFor="email">Email address:</label>
                <input className="form-control input-sm"
                    type="email"
                    name="email"
                    onChange={(event) => props.onchange(event)}
                    onBlur={(event) => props.onblur(event)}
                />
            </p>
            <p className="form-group input-group-sm">
                <label htmlFor="phone">Phone number:</label>
                <input className="form-control input-sm"
                    type="text"
                    name="phone"
                    onChange={(event) => props.onchange(event)}
                    onBlur={(event) => props.onblur(event)}
                />
            </p>
        </Aux>
    );
};

export default userInfo;