import NodeRSA from 'node-rsa';

class Crypto {
  constructor() {
    this.key = null;
    this.publicKey = null;
  }

  async generateKeys() {
    this.key = new NodeRSA();

    await this.key.generateKeyPair(1024);
    this.publicKey = await this.key.exportKey('pkcs8-public-pem');
  }

  async encrypt(message, publicKey) {
    const key = new NodeRSA(publicKey);
    return await key.encrypt(message, 'base64', 'utf-8');
  }

  async decrypt(message) {
    return this.key.decrypt(message, 'utf-8');
  }

  async encryptForAll(messageText, clients) {
    const messages = [];

    for(let client of clients) {
      const message = {
        identifier: client.identifier,
        message: await this.encrypt(messageText, client.publicKey)
      };

      messages.push(message);
    }

    return messages;
  }
}

export default Crypto;
