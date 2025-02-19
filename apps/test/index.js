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
      case '/getAdmins':
        const admins = await message.chat.getAdmins();
        await message.chat.send(
          admins.map((admin) => admin.user.username).join('\n')
        );
        break;
      case '/sendPhoto':
        await message.chat.sendPhoto(
          'https://i.ibb.co/rR8NBqHC/ed813e4a-3c28-4f18-81e9-45944032c80a.jpg',
          { caption: 'This is a test photo' }
        );
        break;
      case '/sendAudio':
        await message.chat.sendAudio(
          'https://file-examples.com/storage/fe020292f667b1bd3a7801e/2017/11/file_example_MP3_1MG.mp3',
          {
            caption: 'hii',
            thumbnail:
              'https://i.ibb.co/N4Pqpd4/2024-Predator-Default-3840x2400.jpg',
          }
        );
        break;
      case '/sendVideo':
        await message.chat.sendVideo(
          'https://file-examples.com/storage/febb80f7d567b1cb49bdca5/2017/04/file_example_MP4_480_1_5MG.mp4',
          {
            caption: 'hii video',
            thumbnail:
              'https://i.ibb.co/N4Pqpd4/2024-Predator-Default-3840x2400.jpg',
            cover:
              'https://i.ibb.co/N4Pqpd4/2024-Predator-Default-3840x2400.jpg',
          }
        );
        break;

      case '/sendAction':
        await message.chat.sendAction('typing');
        break;

      case '/sendDice':
        await message.chat.sendDice('🎯');
        break;

      default:
      // await message.chat.send('Invalid command');
    }
  } catch (err) {
    console.error(err);
  }
});

client.login(process.env.TOKEN);
