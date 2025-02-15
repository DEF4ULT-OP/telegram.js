import { config } from 'dotenv';
import { Client, Events } from 'telegram.js';

config();

const client = new Client({
  polling: {
    interval: 1000,
  },
});

client.on(Events.Ready, () => {
  console.log(`Bot logged in as ${client.user.username}`);
});

client.on(Events.Update, (update) => {
  // console.dir(update.rawData, { depth: 10 });
});

client.on(Events.Message, async (message) => {
  try {
    switch (message.text) {
      case '/start':
        await message.chat.send('Hello, world!');
        break;
      case '/stop':
        await message.chat.send('Goodbye, world!');
        break;
      case '/setTitle':
        await message.chat.setTitle('Test Bot');
        break;
      case '/setDescription':
        await message.chat.setDescription('This is a test bot');
        break;
      case '/setPhoto':
        await message.chat.setPhoto(
          'https://i.ibb.co/rR8NBqHC/ed813e4a-3c28-4f18-81e9-45944032c80a.jpg'
        );
        break;
      case '/deletePhoto':
        await message.chat.deletePhoto();
        break;
    }
  } catch (err) {
    console.error(err);
  }
});

client.login(process.env.TOKEN);
