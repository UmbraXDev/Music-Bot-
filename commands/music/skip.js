const emoji = require('../../emoji');

module.exports = {
  name: 'skip',
  aliases: ['s', 'next'],
  description: 'Skip the current song',
  voiceChannel: true,
  sameVoiceChannel: true,
  cooldown: 2,
  execute: (message, args, client) => {
    const player = client.manager.get(message.guild.id);
    
    if (!player) {
      return message.reply(`${emoji.error} Nothing is playing!`);
    }
    
    if (!player.queue.current) {
      return message.reply(`${emoji.error} No song is currently playing!`);
    }
    
    const currentTrack = player.queue.current;
    
    player.stop();
    
    message.channel.send({
      embeds: [{
        color: parseInt(client.config.embedColor.replace('#', ''), 16),
        description: `${emoji.skip} Skipped: [${currentTrack.title}](${currentTrack.uri})`,
        footer: { text: `Skipped by ${message.author.tag}` },
        timestamp: new Date()
      }]
    });
  }
};