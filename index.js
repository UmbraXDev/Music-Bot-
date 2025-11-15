const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { Manager } = require('erela.js');
const config = require('./config.json');
const fs = require('fs');
const path = require('path');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ]
});

client.commands = new Collection();
client.config = config;
client.cooldowns = new Collection();

function loadCommands(dir) {
  const commandFolders = fs.readdirSync(dir);
  
  for (const folder of commandFolders) {
    const folderPath = path.join(dir, folder);
    if (!fs.statSync(folderPath).isDirectory()) continue;
    
    const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));
    
    for (const file of commandFiles) {
      const filePath = path.join(folderPath, file);
      const command = require(filePath);
      
      if (command.name) {
        client.commands.set(command.name, command);
        console.log(`✅ Loaded command: ${command.name}`);
      }
    }
  }
}

loadCommands(path.join(__dirname, 'commands'));

client.manager = null;

const eventFiles = fs.readdirSync(path.join(__dirname, 'events')).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const event = require(path.join(__dirname, 'events', file));
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
  console.log(`✅ Loaded event: ${event.name}`);
}

client.on('raw', d => {
  if (client.manager) {
    client.manager.updateVoiceState(d);
  }
});

function formatDuration(ms) {
  if (!ms || ms === 0) return 'LIVE';
  
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor(ms / (1000 * 60 * 60));
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

process.on('unhandledRejection', error => {
  console.error('❌ Unhandled promise rejection:', error);
  if (error.stack) console.error(error.stack);
});

process.on('uncaughtException', error => {
  console.error('❌ Uncaught exception:', error);
  if (error.stack) console.error(error.stack);
  setTimeout(() => process.exit(1), 1000);
});

process.on('SIGINT', () => {
  console.log('\n⚠️ Received SIGINT, shutting down gracefully...');
  if (client.manager) {
    client.manager.destroy();
  }
  client.destroy();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n⚠️ Received SIGTERM, shutting down gracefully...');
  if (client.manager) {
    client.manager.destroy();
  }
  client.destroy();
  process.exit(0);
});

console.log('🚀 Starting bot...\n');
client.login(config.token).catch(err => {
  console.error('❌ Failed to login:', err);
  process.exit(1);
});