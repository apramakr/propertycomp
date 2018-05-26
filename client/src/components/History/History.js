import React from 'react';

const history = () => {
    return (
        <div className="container">
            <h3>
                You previously searched for :
            </h3>
            <div>
                <p>
                    {localStorage.getItem('address')}
                </p>

                {
                    localStorage.getItem('rentZestimateLow') ?
                        <p>
                            The rental zestimate was found to be in the range of
                        ${localStorage.getItem('rentZestimateLow')} to ${localStorage.getItem('rentZestimateHigh')}
                        </p>
                        : ''
                }

                {localStorage.getItem('expectedRent') ?
                    <p>
                        You expected a monthly rent of ${localStorage.getItem('expectedRent')}
                    </p>
                    : ''
                }
            </div>
        </div>
    )
}

export default history;