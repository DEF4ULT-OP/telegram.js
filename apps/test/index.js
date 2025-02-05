import { config } from 'dotenv';
import { Client, Events } from 'telegram.js';

config();

const client = new Client({
  polling: {
    interval: 1000,
  },
});

client.on(Events.Update, (update) => {
  // console.dir(update.rawData, { depth: 10 });
});

client.on(Events.Message, async (message) => {
  console.log('message', message.text);

  const sentMessage = await message.chat.send('hello tjs');
  console.log('🚀 ~ client.on ~ sentMessage:', sentMessage);
});

client.login(process.env.TOKEN);
