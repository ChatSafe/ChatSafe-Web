import React from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  FormGroup,
  Label,
  Alert,
  Form } from 'reactstrap';

class SetupModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modal: false,
      alert: false
    };

    this.toggle = this.toggle.bind(this);
    this.alert = this.alert.bind(this);
  }

  render() {
    let alert;

    if(this.state.alert) {
      alert = <Alert color="danger">{this.state.alert}</Alert>;
    }

    return (
      <div>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className} backdrop='static'>
          <ModalHeader>Setup</ModalHeader>
          <Form onSubmit={this.onSubmit.bind(this)}>
            <ModalBody>
              {alert}
              <FormGroup>
                <Label>Server</Label>
                <Input type="text" placeholder="Server" name="server" />
              </FormGroup>
              <FormGroup>
                <Label>Identifier</Label>
                <Input type="text" placeholder="Identifier" name="identifier" />
              </FormGroup>
              <FormGroup>
                <Label>Room</Label>
                <Input type="text" placeholder="Room" name="room" />
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button color="primary">Connect</Button>
            </ModalFooter>
          </Form>
        </Modal>
      </div>
    );
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  alert(alert) {
    this.setState({
      alert: alert
    });
  }

  onSubmit(e) {
    e.preventDefault();

    this.alert(false);

    const options = {
      server: e.target.server.value,
      identifier: e.target.identifier.value,
      room: e.target.room.value
    };

    this.toggle();
    this.props.connect(options);
  }
}

export default SetupModal
