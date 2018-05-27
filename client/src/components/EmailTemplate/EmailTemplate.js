import React from 'react';

const emailTemplate = (props) => {
    return (
        <div>
            <form onSubmit={props.onsubmit} method="POST">
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input type="text" className="form-control" name="name" value={props.firstname} />
                </div>
                <div className="form-group">
                    <label htmlFor="emailaddress">Email address</label>
                    <input type="email" className="form-control" name="emailaddress" aria-describedby="emailHelp" value={props.email} />
                </div>
                <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea className="form-control" rows="5" id="message" name="message" value={props.message}></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default emailTemplate;