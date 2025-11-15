const emoji = require('../../emoji');

module.exports = {
  name: 'volume',
  aliases: ['vol', 'v'],
  description: 'Change the player volume',
  usage: '<1-100>',
  voiceChannel: true,
  sameVoiceChannel: true,
  cooldown: 3,
  execute: (message, args, client) => {
    const player = client.manager.get(message.guild.id);
    
    if (!player) {
      return message.reply(`${emoji.error} Nothing is playing!`);
    }
    
    if (!args.length) {
      return message.channel.send({
        embeds: [{
          color: parseInt(client.config.embedColor.replace('#', ''), 16),
          description: `${emoji.volume} Current volume: **${player.volume}%**`
        }]
      });
    }
    
    const volume = Number(args[0]);
    
    if (isNaN(volume)) {
      return message.reply(`${emoji.error} Please provide a valid number!`);
    }
    
    if (volume < 1 || volume > 100) {
      return message.reply(`${emoji.error} Volume must be between 1 and 100!`);
    }
    
    player.setVolume(volume);
    
    message.channel.send({
      embeds: [{
        color: parseInt(client.config.embedColor.replace('#', ''), 16),
        description: `${emoji.volume} Volume set to **${volume}%**`,
        footer: { text: `Changed by ${message.author.tag}` },
        timestamp: new Date()
      }]
    });
  }
};
