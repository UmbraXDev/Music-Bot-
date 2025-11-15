const emoji = require('../../emoji');

module.exports = {
  name: 'loop',
  aliases: ['repeat', 'l'],
  description: 'Set the loop mode',
  usage: '<off/song/queue>',
  voiceChannel: true,
  sameVoiceChannel: true,
  cooldown: 3,
  execute: (message, args, client) => {
    const player = client.manager.get(message.guild.id);
    
    if (!player) {
      return message.reply(`${emoji.error} Nothing is playing!`);
    }
    
    if (!args.length) {
      const modes = ['Off', 'Song', 'Queue'];
      const currentMode = player.queueRepeat ? 'Queue' : player.trackRepeat ? 'Song' : 'Off';
      
      return message.channel.send({
        embeds: [{
          color: parseInt(client.config.embedColor.replace('#', ''), 16),
          description: `${emoji.loop} Current loop mode: **${currentMode}**\n\nAvailable modes: \`${modes.join(', ')}\``
        }]
      });
    }
    
    const mode = args[0].toLowerCase();
    
    switch (mode) {
      case 'off':
      case 'disable':
      case 'none':
        player.setTrackRepeat(false);
        player.setQueueRepeat(false);
        message.channel.send({
          embeds: [{
            color: parseInt(client.config.embedColor.replace('#', ''), 16),
            description: `${emoji.loop} Loop mode disabled.`,
            footer: { text: `Changed by ${message.author.tag}` },
            timestamp: new Date()
          }]
        });
        break;
        
      case 'song':
      case 'track':
      case 'current':
        player.setTrackRepeat(true);
        player.setQueueRepeat(false);
        message.channel.send({
          embeds: [{
            color: parseInt(client.config.embedColor.replace('#', ''), 16),
            description: `${emoji.loop} Loop mode set to: **Song**\nCurrent track will repeat.`,
            footer: { text: `Changed by ${message.author.tag}` },
            timestamp: new Date()
          }]
        });
        break;
        
      case 'queue':
      case 'all':
        player.setQueueRepeat(true);
        player.setTrackRepeat(false);
        message.channel.send({
          embeds: [{
            color: parseInt(client.config.embedColor.replace('#', ''), 16),
            description: `${emoji.loop} Loop mode set to: **Queue**\nEntire queue will repeat.`,
            footer: { text: `Changed by ${message.author.tag}` },
            timestamp: new Date()
          }]
        });
        break;
        
      default:
        message.reply(`${emoji.error} Invalid loop mode! Use: \`off\`, \`song\`, or \`queue\``);
    }
  }
};