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
  Form } from 'reactstrap';

class SetupModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modal: false
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  onSubmit(e) {
    e.preventDefault();

    const options = {
      server: e.target.server.value,
      identifier: e.target.identifier.value,
      room: e.target.room.value
    };

    this.toggle();
    this.props.connect(options);
  }

  render() {
    return (
      <div>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className} backdrop='static'>
          <ModalHeader>Setup</ModalHeader>
          <Form onSubmit={this.onSubmit.bind(this)}>
            <ModalBody>
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
}

export default SetupModal
