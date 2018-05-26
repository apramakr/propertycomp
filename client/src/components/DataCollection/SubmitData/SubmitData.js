import React from 'react';

const submitData = (props) => {
    return <button className="btn btn-primary" onClick={props.setLocalStorage} disabled={props.disabled}>Sign me up!</button>
};

export default submitData;