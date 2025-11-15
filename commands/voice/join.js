const emoji = require('../../emoji');

module.exports = {
  name: 'join',
  aliases: ['connect', 'j'],
  description: 'Make the bot join your voice channel',
  voiceChannel: true,
  cooldown: 3,
  execute: (message, args, client) => {
    const player = client.manager.get(message.guild.id);
    
    if (player && player.voiceChannel) {
      const voiceChannel = message.guild.channels.cache.get(player.voiceChannel);
      return message.reply(`${emoji.warning} I'm already connected to ${voiceChannel}!`);
    }
    
    const newPlayer = client.manager.create({
      guild: message.guild.id,
      voiceChannel: message.member.voice.channel.id,
      textChannel: message.channel.id,
      selfDeafen: true,
      volume: client.config.defaultVolume
    });
    
    newPlayer.connect();
    
    message.channel.send({
      embeds: [{
        color: parseInt(client.config.embedColor.replace('#', ''), 16),
        description: `${emoji.success} Joined ${message.member.voice.channel}`,
        footer: { text: `Joined by ${message.author.tag}` },
        timestamp: new Date()
      }]
    });
  }
};
