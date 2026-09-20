const { Client, LocalAuth } = require('whatsapp-web.js');const qrcode = require('qrcode-terminal');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI('YOUR_API_KEY');
const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

const client = new Client({ authStrategy: new LocalAuth() });
client.on('qr', qr => qrcode.generate(qr, {small: true}));
client.on('ready', () => console.log('Done, use prefix ".ia"'));

client.on('message_create', async msg => {
if(msg.from.includes('@g.us')) return;
if(!msg.body.startsWith('.ia')) return;

const Question = msg.body.slice(3).trim();
if(!Question) return;

try {
const result = await model.generateContent(Question);
let text = result.response.text();

text = text.replace(/\*/g, '').replace(/_/g, '').replace(/~/g, '').replace(/`/g, '');

await msg.reply(text);
} catch(e){ console.log(e); }
});
client.initialize();
