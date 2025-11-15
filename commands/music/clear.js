const emoji = require('../../emoji');

module.exports = {
  name: 'clear',
  aliases: ['clean', 'clearqueue'],
  description: 'Clear the entire queue',
  voiceChannel: true,
  sameVoiceChannel: true,
  cooldown: 3,
  execute: (message, args, client) => {
    const player = client.manager.get(message.guild.id);
    
    if (!player) {
      return message.reply(`${emoji.error} Nothing is playing!`);
    }
    
    if (!player.queue.size) {
      return message.reply(`${emoji.error} The queue is already empty!`);
    }
    
    const queueSize = player.queue.size;
    player.queue.clear();
    
    message.channel.send({
      embeds: [{
        color: parseInt(client.config.embedColor.replace('#', ''), 16),
        description: `${emoji.success} Cleared **${queueSize}** songs from the queue.`,
        footer: { text: `Cleared by ${message.author.tag}` },
        timestamp: new Date()
      }]
    });
  }
};