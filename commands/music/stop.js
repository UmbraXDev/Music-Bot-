const emoji = require('../../emoji');

module.exports = {
  name: 'stop',
  aliases: ['leave', 'disconnect'],
  description: 'Stop the player and clear the queue',
  voiceChannel: true,
  sameVoiceChannel: true,
  cooldown: 3,
  execute: (message, args, client) => {
    const player = client.manager.get(message.guild.id);
    
    if (!player) {
      return message.reply(`${emoji.error} Nothing is playing!`);
    }
    
    const voiceChannel = message.guild.channels.cache.get(player.voiceChannel);
    
    player.destroy();
    
    message.channel.send({
      embeds: [{
        color: parseInt(client.config.embedColor.replace('#', ''), 16),
        description: `${emoji.stop} Stopped the player and left ${voiceChannel}.`,
        footer: { text: `Stopped by ${message.author.tag}` },
        timestamp: new Date()
      }]
    });
  }
};