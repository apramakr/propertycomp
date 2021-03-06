import React from 'react';
import ProgressBar from 'react-progressbar';

const progressBarStyle = {
    border: '1px solid'
};

const progress = (props) => {
    return (
        <ProgressBar
            completed={props.completed}
            color="green"
            style={progressBarStyle} />
    )
}

export default progress;
