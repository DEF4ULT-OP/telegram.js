import { config } from 'dotenv';
import { Client, Events } from 'telegram.js';

config();

const client = new Client();

client.on(Events.Update, (update) => {
  console.dir(update.rawData, { depth: 10 });
});

client.on(Events.Message, (message) => {
  // console.log('message', message);
});

client.login(process.env.TOKEN);
