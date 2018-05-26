import React from 'react';
import Aux from '../../../hoc/Aux';

const userInfo = (props) => {
    return (
            <Aux>
                <p className="form-group input-group-sm">
                    <label className="control-label" htmlFor="fname">First Name:</label>
                    <input className="form-control input-sm" type="text" name="fname" value={props.fname} onChange={(event) => props.onchange(event)} />
                </p>
                <p className="form-group input-group-sm">
                    <label htmlFor="lname">Last Name:</label>
                    <input className="form-control col-xs-4 input-sm" type="text" name="lname" value={props.lname} onChange={(event) => props.onchange(event)} />
                </p>
                <p className="form-group input-group-sm">
                    <label htmlFor="email">Email address:</label>
                    <input className="form-control col-xs-4 input-sm" type="email" name="email" value={props.email} onChange={(event) => props.onchange(event)} />
                </p>
                <p className="form-group input-group-sm">
                    <label htmlFor="phone">Phone number:</label>
                    <input className="form-control col-xs-4 input-sm" type="text" name="phone" value={props.phone} onChange={(event) => props.onchange(event)} />
                </p>
            </Aux>
        );
};

export default userInfo;