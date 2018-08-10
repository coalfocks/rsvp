import React from 'react';
import Modal from 'react-responsive-modal';

export default class MoreInfo extends React.Component {
  state = {
    open: false,
  };

  onOpenModal = () => {
    this.setState({ open: true });
  };

  onCloseModal = () => {
    this.setState({ open: false });
  };

  render() {
    const { open } = this.state;
    const btnStyle = {
        width: '150px',
        margin: 'auto',
        display: 'block',
        marginBottom: '4px'
    }
    return (
      <div>
        <button onClick={this.onOpenModal} style={ btnStyle }>Event Details</button>
        <Modal open={open} onClose={this.onCloseModal} center>
          <h2>Location</h2>
          <h3>Last Chance Lodge, Solitude Mountain Resort</h3>
          <iframe 
          src={ process.env.REACT_APP_MAP_URL }
          width="600"
          height="380"
          frameBorder="0" 
            >map
          </iframe>
          <h2> Date & Time </h2>
          <h4> Friday, June 8th, 2018 5:30pm </h4>
          <h4> Park at Entry 2 off of the main road. You will be directed through the village to the venue </h4>
          <p> Kim and Cole are registered at Target and Amazon </p>
        </Modal>
      </div>
    );
  }
}
