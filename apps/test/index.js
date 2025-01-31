import { Client } from 'telegram.js';
import { config } from 'dotenv';

config();

const client = new Client();

client.login(process.env.TOKEN);

client.rest.get('/getMe').then(console.log).catch(console.error);
