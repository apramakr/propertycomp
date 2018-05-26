import React from 'react';

const history = () => {
    return (
        <div className="container">
            <p>
                You previously searched for:
            </p>
            <p>
                {localStorage.getItem('address')}
            </p>
            <p>
                The rental zestimate was found to be in the range of
                ${localStorage.getItem('rentZestimateLow')} to ${localStorage.getItem('rentZestimateHigh')}
            </p>

            {localStorage.getItem('expectedRent') ?
                <p>
                    You expected a monthly rent of ${localStorage.getItem('expectedRent')}
                </p>
                : ''
            }
        </div>
    )
}

export default history;