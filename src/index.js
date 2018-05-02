import React from 'react';
import ReactDOM from 'react-dom';
var firebase = require('firebase/app');
require("firebase/database");
require("firebase/firestore");
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import './rsvp.css';

var config = {
    apiKey: process.env.REACT_APP_APIKEY,
    authDomain: "wedding-rsvp-40b8d.firebaseapp.com",
    databaseURL: process.env.REACT_APP_DB_URL,
    projectId: "wedding-rsvp-40b8d",
    storageBucket: "wedding-rsvp-40b8d.appspot.com",
    messagingSenderId: "545226112552"
};
var app = firebase.initializeApp(config);
var db = firebase.firestore(app);

class Heading extends React.Component{
    render() {
        return (
            <h1 id="heading">Kim & Cole</h1>
        );
    }
}

class Rsvp extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
          first: '',
          last: '',
          guest: '',
          attending: false,
          canSubmit: true,
          submitted: false
        };
        this.onChildUpdate = this.onChildUpdate.bind(this);
        this.submit = this.submit.bind(this);
    }
    
    onChildUpdate = (label, value) => {
        this.setState({
            [label]: value
        });
    }

    submit = () => {
        var guest  = db.collection("kimandcole");
        //var query = guest.where("first", "==", this.state.first.toLowerCase()).where("last", "==", this.state.last.toLowerCase());
        var query = guest.where('first.' + this.state.first.toLowerCase(),'==',true).where("last", "==", this.state.last.toLowerCase());
        var self = this;
        query.get().then((querySnapshot) => {
            if (querySnapshot.docs.length === 0) {
                alert("I'm sorry, I'm having a hard time finding your name. Make sure to enter it as it was printed on your invite. If you are still seeing this problem, just call Cole at 801-946-1136. Thank you!");
            }
            querySnapshot.forEach(function(doc) {
                var id = doc.id;
                var info = self.state;
                delete info.submitted;
                delete info.first;
                delete info.plusone;
                delete info.last
                info.rsvp = true;
                var guest_ref = db.collection('kimandcole').doc(id);
                self.setState({
                    submitted: true
                });
                self.render();
                //error handling
                return guest_ref.update(info);
            });
        });
    }

    render () {
        const form_view = 
            <div id='rsvp_form' key='rsvp_form'>
                <NameField onUpdate={this.onChildUpdate} />
                <Coming onUpdate={this.onChildUpdate} />
                <Button 
                onUpdate={this.onChildUpdate}
                canSubmit={this.state.canSubmit}
                submit={this.submit} />
            </div>

        const thanks_view =
            <div id='rsvp_thanks' key='rsvp_thanks'>
                <h2 id='thanks'> Thank You! </h2>
            </div>

        return (
            <div id='rsvp_container'>
                <ReactCSSTransitionGroup
                transitionName="thanks" 
                transitionEnterTimeout={600} 
                transitionLeaveTimeout={6}
                transitionAppear={true}
                transitionAppearTimeout={500}>
                    {this.state.submitted ? thanks_view : form_view}
                </ReactCSSTransitionGroup>
            </div>
        )
    }
}

class NameField extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            first: '',
            last: '',
            plus1: false
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.checkForPlusOne = this.checkForPlusOne.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;

        this.setState({
            [name]: value
        });

        this.props.onUpdate(name, value)
    }

    setPlusOne(plus1) {
        this.setState({
            plus1: plus1
        });
    }

    checkForPlusOne() {
        this.props.onUpdate('canSubmit', false);
        var guest  = db.collection("kimandcole");
        //var query = guest.where("first", "==", this.state.first.toLowerCase()).where("last", "==", this.state.last.toLowerCase());
        var query = guest.where('first.' + this.state.first.toLowerCase(),'==',true).where("last", "==", this.state.last.toLowerCase());
        var self = this;
        query.get().then((querySnapshot) => {
            querySnapshot.forEach(function(doc) {
                if (doc.data().plusone === true) {
                    self.setPlusOne(true)
                } else {
                    self.setPlusOne(false)
                }
            });
            setTimeout(() => self.props.onUpdate('canSubmit',true), 900);
        });
    }

    render() {
        return (
            <div id='names'>
                <input 
                    type='text'
                    id='first_name'
                    placeholder='First'
                    onChange={this.handleInputChange}
                    onBlur={this.checkForPlusOne}
                    name='first'/>
                <input type='text'
                    id='last_name' 
                    placeholder='Last'
                    onChange={this.handleInputChange}
                    onBlur={this.checkForPlusOne}
                    name='last'/>
                    <ReactCSSTransitionGroup transitionName="yesplusone" transitionEnterTimeout={60} transitionLeaveTimeout={60}>
                      { this.state.plus1 ? <PlusOne onUpdate={this.props.onUpdate}/> : null }
                    </ReactCSSTransitionGroup>
            </div>
        );
    }
}

class PlusOne extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            plus1box: false
        };
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.checked;

        this.setState({
          plus1box: value
        });
    }

    render() {
        return (
            <div id='plus1'>
                <label><input
                    name='plus1box' 
                    type='checkbox' 
                    id='plus1_box' 
                    onChange={this.handleInputChange}/>
                +1 will be joining? </label>
                    <ReactCSSTransitionGroup transitionName="yesplusonecheckbox" transitionEnterTimeout={60} transitionLeaveTimeout={60}>
                      { this.state.plus1box ? <GuestName onUpdate={this.props.onUpdate}/> : null }
                  </ReactCSSTransitionGroup>
            </div>
        );
    }
}

class GuestName extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            guest: ''
        };
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        this.setState({
            guest: value
        });
        this.props.onUpdate('guest', value);
    }
    render() {
        return (
            <div>
                <input type='text' id='guest_name' placeholder='Guest Name' onChange={this.handleInputChange} />
            </div>
        )
    }
}
class Coming extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            attending: true
        };
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event) {
        const value = document.getElementById('iscoming').checked
        this.setState({
            attending: value
        });
        this.props.onUpdate('attending', value);
    }
    render() {
        return (
            <div id='coming_boxes'>
                <label><input
                type='radio'
                name='attending'
                id='iscoming'
                onChange={this.handleInputChange}/> Attending </label>
                <label><input
                type='radio'
                name='attending'
                id='isnotcoming'
                defaultChecked={true}
                onChange={this.handleInputChange}/> Not Attending </label>
            </div>
        );
    }
}

class Button extends React.Component{
    render() {
        const searching_text = !this.props.canSubmit ? (
        <ReactCSSTransitionGroup
        transitionName="thanks" 
        transitionEnterTimeout={300} 
        transitionLeaveTimeout={300}
        transitionAppear={true}
        transitionAppearTimeout={300}>
            <h4> Searching guest list for your name... </h4>
        </ReactCSSTransitionGroup>
        ): null;
        return (
            <div id='button'>
                {searching_text}
                <button onClick={this.props.submit} disabled={this.props.canSubmit}> RSVP </button>
            </div>
        );
    }
}

class App extends React.Component{
    render() {
        return (
            <div id='container'>
                <Heading />
                <Rsvp />
            </div>
        )
    }
}
// ========================================
ReactDOM.render(
      <App />,
      document.getElementById('root')
);

