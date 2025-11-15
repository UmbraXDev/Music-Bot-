const emoji = require('../../emoji');

module.exports = {
  name: 'remove',
  aliases: ['rm'],
  description: 'Remove a song from the queue',
  usage: '<position>',
  voiceChannel: true,
  sameVoiceChannel: true,
  cooldown: 2,
  execute: (message, args, client) => {
    const player = client.manager.get(message.guild.id);
    
    if (!player) {
      return message.reply(`${emoji.error} Nothing is playing!`);
    }
    
    if (!player.queue.size) {
      return message.reply(`${emoji.error} The queue is empty!`);
    }
    
    if (!args.length) {
      return message.reply(`${emoji.error} Please provide a position! Usage: \`${client.config.prefix}remove <position>\``);
    }
    
    const position = Number(args[0]);
    
    if (isNaN(position)) {
      return message.reply(`${emoji.error} Please provide a valid number!`);
    }
    
    if (position < 1 || position > player.queue.size) {
      return message.reply(`${emoji.error} Invalid position! Queue has ${player.queue.size} songs.`);
    }
    
    const track = player.queue[position - 1];
    player.queue.remove(position - 1);
    
    message.channel.send({
      embeds: [{
        color: parseInt(client.config.embedColor.replace('#', ''), 16),
        description: `${emoji.success} Removed from queue:\n[${track.title}](${track.uri})`,
        footer: { text: `Removed by ${message.author.tag}` },
        timestamp: new Date()
      }]
    });
  }
};