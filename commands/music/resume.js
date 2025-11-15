const emoji = require('../../emoji');

module.exports = {
  name: 'resume',
  aliases: ['unpause'],
  description: 'Resume the paused song',
  voiceChannel: true,
  sameVoiceChannel: true,
  cooldown: 2,
  execute: (message, args, client) => {
    const player = client.manager.get(message.guild.id);
    
    if (!player) {
      return message.reply(`${emoji.error} Nothing is playing!`);
    }
    
    if (!player.paused) {
      return message.reply(`${emoji.warning} The player is not paused!`);
    }
    
    player.pause(false);
    
    message.channel.send({
      embeds: [{
        color: parseInt(client.config.embedColor.replace('#', ''), 16),
        description: `${emoji.play} Resumed the player.`,
        footer: { text: `Resumed by ${message.author.tag}` },
        timestamp: new Date()
      }]
    });
  }
};