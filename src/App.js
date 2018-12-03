import React, { Component } from 'react';
import socketIOClient from "socket.io-client";

import Crypto from './crypto/crypto';

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

import {
  Navbar,
  NavbarBrand,
  Form,
  Input,
  Container,
  Row,
  Col,
  Table,
} from 'reactstrap';

import SetupModal from './SetupModal';

import './styles/App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
      clients: []
    };

    this.modal = React.createRef();

    this.socket = null;
    this.crypto = null;
  }

  async componentDidMount() {
    this.crypto = new Crypto();
    await this.crypto.generateKeys();

    this.modal.current.toggle();
  }

  render() {
    const messages = this.state.messages.map((message, index) =>
      <p key={index}>{message.identifier}: {message.message}</p>
    );

    const clients = this.state.clients.map((client, index) =>
      <tr key={index}>
        <td>{client.identifier}</td>
      </tr>
    );

    return (
      <div className="App">
        <Navbar className="fixed-top navbar-expand-lg">
          <NavbarBrand href="#">ChatSafe</NavbarBrand>
        </Navbar>

        <Container fluid>
          <Row>
            <Col sm="9" className="panel chat-panel">
              <Row className="chat-text">
                <div>
                  {messages}
                </div>
              </Row>
              <Row className="chat-box">
                <Col sm="12">
                  <div>
                    <Form onSubmit={this.handleSubmit.bind(this)}>
                      <Input type="text" name="message" placeholder="Press enter to submit" className="chat-box-input" />
                    </Form>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col sm="3">
              <Row>
                <Table className="clients-table">
                  <thead>
                  <tr>
                    <th>Clients</th>
                  </tr>
                  </thead>
                  <tbody>
                  {clients}
                  </tbody>
                </Table>
              </Row>
            </Col>
          </Row>
        </Container>
        <SetupModal ref={this.modal} connect={this.connect.bind(this)} />
      </div>
    );
  }

  //<editor-fold desc="Page Events">
  handleSubmit(e) {
    e.preventDefault();

    const message = e.target.message.value;

    this.sendMessage(message);

    e.target.message.value = '';
  }
  //</editor-fold>

  //<editor-fold desc="Socket Setup">
  connect(options) {
    let formatted = options.server;

    if(!formatted.includes('http://')) {
      formatted = `http://${formatted}`;
    }

    const connectionOptions = {
      "force new connection": true,
      "reconnectionAttempts": "Infinity",
      "timeout" : 10000,
      "transports": ["websocket"]
    };

    this.socket = socketIOClient(formatted, connectionOptions);

    this.setupEvents();

    const message = {
      identifier: options.identifier,
      room: options.room,
      publicKey: this.crypto.publicKey
    };

    this.socket.emit('identify', message);
  }

  setupEvents() {
    this.socket.on('connected', this.connected.bind(this));
    this.socket.on('newMessage', this.newMessage.bind(this));
    this.socket.on('newClient', this.newClient.bind(this));
    this.socket.on('lostClient', this.lostClient.bind(this));
  }
  //</editor-fold>

  //<editor-fold desc="Socket Outbound">
  async sendMessage(message) {
    const messages = await this.crypto.encryptForAll(message, this.state.clients);
    console.log(messages);

    this.socket.emit('send', messages);
  }
  //</editor-fold>

  //<editor-fold desc="Socket Events">

  connected(data) {
    this.setState({
      clients: data.clients
    });
  }

  async newMessage(data) {
    data.message = await this.crypto.decrypt(data.message);

    const messages = this.state.messages;
    messages.push(data);

    this.setState({
      messages: messages
    });
  }

  newClient(data) {
    const clients = this.state.clients;
    clients.push(data);

    this.setState({
      clients: clients
    });
  }

  lostClient(data) {

  }

  //</editor-fold>
}

export default App;
