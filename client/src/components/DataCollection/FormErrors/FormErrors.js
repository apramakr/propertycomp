import React from 'react';

const formErrors = ({ formErrors }) => {
    return (
        <div className="formErrors">
            {
                Object.keys(formErrors).map((fieldName, i) => {
                    if (formErrors[fieldName].length > 0) {
                        return <p key={i}>{formErrors[fieldName]}</p>
                    } else {
                        return '';
                    }
                })
            }
        </div>
    );
}

export default formErrors;