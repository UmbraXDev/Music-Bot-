const emoji = require('../../emoji');

module.exports = {
  name: '24-7',
  aliases: ['24/7', 'stay'],
  description: 'Toggle 24/7 mode (bot stays in voice channel)',
  voiceChannel: true,
  sameVoiceChannel: true,
  cooldown: 5,
  execute: (message, args, client) => {
    const player = client.manager.get(message.guild.id);
    
    if (!player) {
      return message.reply(`${emoji.error} Nothing is playing!`);
    }
    
    const current247 = player.get('24/7') || false;
    player.set('24/7', !current247);
    
    message.channel.send({
      embeds: [{
        color: parseInt(client.config.embedColor.replace('#', ''), 16),
        title: `${emoji.info} 24/7 Mode ${!current247 ? 'Enabled' : 'Disabled'}`,
        description: !current247 
          ? 'The bot will now stay in the voice channel 24/7 even when the queue ends.'
          : 'The bot will now leave when the queue ends or the voice channel is empty.',
        footer: { text: `Changed by ${message.author.tag}` },
        timestamp: new Date()
      }]
    });
  }
};
