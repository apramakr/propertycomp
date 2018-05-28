import React, { Component } from 'react';
import Script from 'react-load-script';
import Xml2js from 'xml2js';
import Progress from './components/DataCollection/Progress/Progress';
import classes from './App.css';
import UserInfo from './components/DataCollection/UserInfo/UserInfo';
import FormErrors from './components/DataCollection/FormErrors/FormErrors';
import Address from './components/DataCollection/UserInfo/Address/Address';
import SubmitData from './components/DataCollection/SubmitData/SubmitData';
import RentZestimate from './components/DataCollection/RentZestimate/RentZestimate';
import Instructions from './components/Instructions/Instructions';
import History from './components/History/History';
import EmailTemplate from './components/EmailTemplate/EmailTemplate';

const MAPS_API_KEY = 'AIzaSyBff2IKobIbwrFZuYwtcz1KoPgeo4yzcJo';
const MAPS_URL = `https://maps.googleapis.com/maps/api/js?key=${MAPS_API_KEY}&libraries=places`;

const ZILLOW_KEY = 'X1-ZWz18l9cjdvuh7_8p8sy';
const ZILLOW_URL = `http://www.zillow.com/webservice/GetSearchResults.htm?zws-id=${ZILLOW_KEY}&`;

class App extends Component {
  state = {
    response: '',
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    address: '',
    rentZestimate: '',
    rentZestimateHigh: '',
    rentZestimateLow: '',
    expectedRent: '',
    formErrors: {
      email: '',
      phone: '',
      address: ''
    },
    emailValid: false,
    phoneValid: false,
    addressValid: false,
    formValid: false,
    completed: 0,
    progressLabel: '',
    mapsScriptLoaded: false,
    mapsScriptError: false,
    formSent: false
  };

  onChangeHandler(event) {
    this.handleUserInput(event);
  }

  handleUserInput(event) {
    let firstname = this.state.firstname;
    let lastname = this.state.lastname;
    let email = this.state.email;
    let phone = this.state.phone;
    let address = this.state.address;
    let expectedRent = this.state.expectedRent;
    let addressValid = this.state.addressValid;

    let name = (event.target) ? event.target.name : event;
    const value = (event.target) ? event.target.value : event;

    if (name === 'fname') firstname = value;
    if (name === 'lname') lastname = value;
    if (name === 'email') email = value;
    if (name === 'phone') phone = value;
    if (name === 'expectedRent') expectedRent = value;

    if (Object.keys(name)[0] === 'address_components') {
      address = name;
      addressValid = name;
    } else if (Object.keys(name)[0] === 'name') {
      addressValid = null;
      name = Object.keys(name)[0];
    }

    this.setState(
      {
        firstname: firstname,
        lastname: lastname,
        email: email,
        phone: phone,
        address: address,
        expectedRent: expectedRent,
        addressValid: addressValid
      },
      () => { this.validateField(name, value) }
    );

    this.state.addressValid ? this.zillowRequestHandler() : '';
  }

  validateField(fieldName, value) {
    let fieldValidationErrors = this.state.formErrors;
    let emailValid = this.state.emailValid;
    let phoneValid = this.state.phoneValid;
    let addressValid = this.state.addressValid;

    switch (fieldName) {
      case 'email':
        emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
        fieldValidationErrors.email = emailValid ? '' : 'Please enter a valid email address.';
        break;
      case 'phone':
        phoneValid = value.match(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/);
        fieldValidationErrors.phone = phoneValid ? '' : 'Please enter a valid phone number.';
        break;
      case 'name':
        fieldValidationErrors.address = addressValid ? '' : 'Please choose a valid address from the drop-down list.';
        break;
      default:
        fieldValidationErrors.address = '';

        break;
    }

    this.setState({
      formErrors: fieldValidationErrors,
      emailValid: emailValid,
      phoneValid: phoneValid,
      addressValid: addressValid
    }, this.validateForm);
  }

  validateForm() {
    this.setState({
      formValid: this.state.emailValid && this.state.phoneValid && this.state.addressValid
    });
    let formError = [];
    formError['fname'] = this.state.firstname ? true : false;
    formError['lname'] = this.state.lastname ? true : false;
    formError['email'] = this.state.emailValid ? true : false;
    formError['phone'] = this.state.phoneValid ? true : false;
    formError['address'] = this.state.addressValid ? true : false;
    formError['expectedRent'] = this.state.expectedRent ? true : false;

    this.setState({
      formError: formError
    });
  }

  zillowRequestHandler = async (event) => {
    const addressObj = this.state.address;
    const addressComponents = addressObj['address_components'];

    let location = {};
    for (let ac = 0; ac < addressComponents.length; ac++) {
      const component = addressComponents[ac];
      if (component.types.includes('sublocality') || component.types.includes('locality')) {
        location.city = component.long_name;
      } else if (component.types.includes('administrative_area_level_1')) {
        location.state = component.short_name;
      }
    }

    const address = encodeURIComponent(Object.values(addressObj)[6]);
    const cityStateZip = encodeURIComponent(`${location.city}, ${location.state}`);

    const zillowRequestURL = `${ZILLOW_URL}address=${address}&citystatezip=${cityStateZip}&rentzestimate=true`;

    const proxyUrl = `https://cors-anywhere.herokuapp.com/`;

    const parseString = Xml2js.parseString;

    await fetch(proxyUrl + zillowRequestURL, {
      headers: {
        origin: "all",
        Accept: "application/json",
      },
    },
    ).then(zillowResponse => {
      if (zillowResponse.ok) {
        zillowResponse.text()
          .then(res => {
            let self = this;
            parseString(res, function (err, result) {
              self.zillowResponseHandler(result);
            });
          });
      }
    });
  }

  zillowResponseHandler(result) {
    const zillowResponse = result['SearchResults:searchresults'];
    
    if (!zillowResponse['response']) {
      this.setState({
        formErrors: {
          address: "The zestimate for this address is not available. Try changing your address to something that is postal-approved."
        }
      });
      return;
    }

    if (!zillowResponse['response'][0]['results'][0]['result'][0]['rentzestimate']) {
      zillowResponse['response'][0]['results'][0]['result'][0]['zestimate']
        ? this.approxRentalZestimate(zillowResponse['response'][0]['results'][0]['result'][0]['zestimate'][0]['amount'][0]['_'])
        : this.setState({
          formErrors: {
            address: "A zestimate was not retrieved for the provided address. Try changing your address to something that is postal-approved."
          }
        });
    } else {
      const newRentZestimate = zillowResponse['response'][0]['results'][0]['result'][0]['rentzestimate'][0]['amount'][0]['_'];
      const rentZestimateHigh = zillowResponse['response'][0]['results'][0]['result'][0]['rentzestimate'][0]['valuationRange'][0]['high'][0]['_'];
      const rentZestimateLow = zillowResponse['response'][0]['results'][0]['result'][0]['rentzestimate'][0]['valuationRange'][0]['low'][0]['_']

      this.setState({
        rentZestimate: newRentZestimate,
        rentZestimateHigh: rentZestimateHigh,
        rentZestimateLow: rentZestimateLow
      });
    }
  }

  approxRentalZestimate(zestimate) {
    const annualRentZestimate = 5 / 100 * zestimate;
    const monthlyRentZestimate = Math.floor(annualRentZestimate / 12);
    const rentLowZestimateRange = Math.floor(monthlyRentZestimate * .90);
    const rentHighZestimateRange = Math.floor(monthlyRentZestimate * 1.10);

    this.setState({
      rentZestimate: monthlyRentZestimate,
      rentZestimateLow: rentLowZestimateRange,
      rentZestimateHigh: rentHighZestimateRange
    });
  }

  setProgressBar(e) {
    this.setProgressLabel();

    let completed = this.state.completed;
    const formError = this.state.formError;
    completed = formError[e.target.name] ? completed + 16.67 : completed - 16.67;

    if (completed < 0) completed = 0;
    if (completed > 100) completed = 100;

    this.setState({
      completed: completed
    });
  }

  handleScriptCreate() {
    this.setState({
      mapsScriptLoaded: false
    })
  }

  handleScriptError() {
    this.setState({
      mapsScriptError: true
    })
  }

  handleScriptLoad() {
    this.setState({
      mapsScriptLoaded: true
    })
  }

  setProgressLabel() {
    let progressLabel = this.state.progressLabel;
    if (this.state.completed >= 0 && this.state.completed < 100) {
      progressLabel = "We're getting there!";
    } else {
      progressLabel = "Done!";
    }
    this.setState({
      progressLabel: progressLabel
    })
  }

  signUpButtonHandler(event) {
    const fname = this.state.firstname;
    const lname = this.state.lastname;
    const email = this.state.email;
    const phone = this.state.phone;
    const address = this.state.address;
    const highRange = this.state.rentZestimateHigh;
    const lowRange = this.state.rentZestimateLow;
    const expectedRent = this.state.expectedRent;

    localStorage.clear();

    localStorage.setItem('firstname', fname);
    localStorage.setItem('lastname', lname);
    localStorage.setItem('email', email);
    localStorage.setItem('phone', phone);
    localStorage.setItem('address', address['formatted_address']);
    localStorage.setItem('rentZestimateHigh', highRange);
    localStorage.setItem('rentZestimateLow', lowRange);
    localStorage.setItem('expectedRent', expectedRent);

    this.handleEmailSubmit(event);
    return alert("Please check your email to confirm registration with us!");

  }

  displayHistoryHandler() {
    const data = localStorage.getItem('fname');
    return data;
  }

  handleEmailSubmit = (e) => {
    e.preventDefault();

    const name = `${this.state.firstname} ${this.state.lastname}`;
    const email = this.state.email;
    const message =
      `Hi ${name},
       Thank you for signing up with PropertyCo!
        This is the information you provided us:
        Name: ${name}
        Email: ${email}
        Phone: ${this.state.phone}
        Address: ${this.state.address['formatted_address']}
        Expected Monthly Rent: $${this.state.expectedRent}
        Please stay tuned for our beta trial!`;

    const body = JSON.stringify({
      name: name,
      email: email,
      message: message
    });

    fetch('/sendEmail', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: `${name}`, email: `${email}`, message: `${message}` })
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.msg === 'success') {
          console.log('message sent');
        }
        else {
          console.log('message failed');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {

    return (
      <div className="App">
        <Script
          url={MAPS_URL}
          onError={() => this.handleScriptError()}
          onLoad={() => this.handleScriptLoad()}
        />

        <div className="instructions">
          <Instructions />
        </div>

        <div className="history">
          <History results={this.displayHistoryHandler} />
        </div>

        <span className="clear"></span>

        <div className="data container">
          <UserInfo
            className="userInfo"
            onchange={(event) => this.onChangeHandler(event)}
            onblur={(event) => this.setProgressBar(event)}
            fname={this.state.firstname}
            lname={this.state.lastname}
            email={this.state.email}
            phone={this.state.phone}
          />

          <Address
            mapsAPILoaded={this.state.mapsScriptLoaded}
            onblur={(event) => this.setProgressBar(event)}
            onchange={(place) => this.handleUserInput(place)}
            addressStyle={classes.App}
          />

          <RentZestimate
            onchange={(event) => this.handleUserInput(event)}
            onblur={(event) => this.setProgressBar(event)}
            rentZestimate={this.state.rentZestimate}
            rentZestimateHigh={this.state.rentZestimateHigh}
            rentZestimateLow={this.state.rentZestimateLow}
          />

          <SubmitData
            setLocalStorage={(e) => this.signUpButtonHandler(e)}
            disabled={!this.state.formValid} />

          {
            (this.state.formErrors['email'] || this.state.formErrors['phone'] || this.state.formErrors['address']) ?
              <FormErrors
                className="formErrors"
                formErrors={this.state.formErrors}
              /> : ''
          }
        </div>

        {
          (this.state.completed !== 0) ?
            <div className="progressBar">
              <p>{this.state.progressLabel}</p>
              <Progress completed={this.state.completed} />
            </div>
            : ''
        }
      </div>
    );
  }
}

export default App;
