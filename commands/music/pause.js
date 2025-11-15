const emoji = require('../../emoji');

module.exports = {
  name: 'pause',
  description: 'Pause the currently playing song',
  voiceChannel: true,
  sameVoiceChannel: true,
  cooldown: 2,
  execute: (message, args, client) => {
    const player = client.manager.get(message.guild.id);
    
    if (!player) {
      return message.reply(`${emoji.error} Nothing is playing!`);
    }
    
    if (player.paused) {
      return message.reply(`${emoji.warning} The player is already paused!`);
    }
    
    player.pause(true);
    
    message.channel.send({
      embeds: [{
        color: parseInt(client.config.embedColor.replace('#', ''), 16),
        description: `${emoji.pause} Paused the player.`,
        footer: { text: `Paused by ${message.author.tag}` },
        timestamp: new Date()
      }]
    });
  }
};