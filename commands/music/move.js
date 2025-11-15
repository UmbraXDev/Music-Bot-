const emoji = require('../../emoji');

module.exports = {
  name: 'move',
  aliases: ['mv'],
  description: 'Move a song to a different position in the queue',
  usage: '<from> <to>',
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
    
    if (args.length < 2) {
      return message.reply(`${emoji.error} Please provide both positions! Usage: \`${client.config.prefix}move <from> <to>\``);
    }
    
    const from = Number(args[0]);
    const to = Number(args[1]);
    
    if (isNaN(from) || isNaN(to)) {
      return message.reply(`${emoji.error} Please provide valid numbers!`);
    }
    
    if (from < 1 || from > player.queue.size || to < 1 || to > player.queue.size) {
      return message.reply(`${emoji.error} Invalid positions! Queue has ${player.queue.size} songs.`);
    }
    
    if (from === to) {
      return message.reply(`${emoji.error} The positions are the same!`);
    }
    
    const track = player.queue[from - 1];
    player.queue.remove(from - 1);
    player.queue.splice(to - 1, 0, track);
    
    message.channel.send({
      embeds: [{
        color: parseInt(client.config.embedColor.replace('#', ''), 16),
        description: `${emoji.success} Moved [${track.title}](${track.uri})\nFrom position **${from}** to **${to}**`,
        footer: { text: `Moved by ${message.author.tag}` },
        timestamp: new Date()
      }]
    });
  }
};