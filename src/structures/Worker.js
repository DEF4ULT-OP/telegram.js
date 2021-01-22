const Message = require('./Message');

class Worker {
  constructor(client) {
    this.client = client;
  };

  _processData(data) {
    if (data.message || data.channel_post) this.onMessage(data.message || data.channel_post);
    if (data.edited_message || data.edited_channel_post) this.onMessageEdit(data);
    this.emit('raw', data);
  };

  onMessage(data) {
    const msg = new Message(this.client, data);
    this.client.emit('message', msg);
    if (!msg.content || msg.content.indexOf(this.client.commands.prefix) !== 0) return;
    const args = msg.content.slice(this.client.commands.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    this.client.commands.trigger(command, msg, args);
  };

  onMessageEdit(data) {
    const msg = new Message(this.client, data);
    this.client.emit('messageEdit', msg);
  };

};

module.exports = Worker;