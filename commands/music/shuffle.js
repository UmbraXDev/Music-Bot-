const emoji = require('../../emoji');

module.exports = {
  name: 'shuffle',
  aliases: ['mix'],
  description: 'Shuffle the queue',
  voiceChannel: true,
  sameVoiceChannel: true,
  cooldown: 3,
  execute: (message, args, client) => {
    const player = client.manager.get(message.guild.id);
    
    if (!player) {
      return message.reply(`${emoji.error} Nothing is playing!`);
    }
    
    if (player.queue.size < 2) {
      return message.reply(`${emoji.error} Need at least 2 songs in queue to shuffle!`);
    }
    
    const queue = player.queue;
    for (let i = queue.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [queue[i], queue[j]] = [queue[j], queue[i]];
    }
    
    message.channel.send({
      embeds: [{
        color: parseInt(client.config.embedColor.replace('#', ''), 16),
        description: `${emoji.shuffle} Shuffled **${queue.size}** songs in the queue.`,
        footer: { text: `Shuffled by ${message.author.tag}` },
        timestamp: new Date()
      }]
    });
  }
};