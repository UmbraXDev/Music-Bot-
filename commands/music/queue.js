const emoji = require('../../emoji');

module.exports = {
  name: 'queue',
  aliases: ['q', 'list'],
  description: 'Show the current queue',
  cooldown: 3,
  execute: (message, args, client) => {
    const player = client.manager.get(message.guild.id);
    
    if (!player) {
      return message.reply(`${emoji.error} Nothing is playing!`);
    }
    
    if (!player.queue.current) {
      return message.reply(`${emoji.error} No songs in queue!`);
    }
    
    const queue = player.queue;
    const current = queue.current;
    const upcoming = queue.slice(0, 10);
    
    let queueString = '';
    
    if (upcoming.length > 0) {
      queueString = upcoming.map((track, index) => {
        return `**${index + 1}.** [${track.title}](${track.uri}) - \`${formatDuration(track.duration)}\``;
      }).join('\n');
    } else {
      queueString = 'No upcoming songs';
    }
    
    const totalDuration = queue.reduce((acc, track) => acc + track.duration, current.duration);
    
    message.channel.send({
      embeds: [{
        color: parseInt(client.config.embedColor.replace('#', ''), 16),
        author: {
          name: `Queue for ${message.guild.name}`,
          iconURL: message.guild.iconURL({ dynamic: true })
        },
        fields: [
          {
            name: `${emoji.musical_note} Now Playing`,
            value: `[${current.title}](${current.uri}) - \`${formatDuration(current.duration)}\`\nRequested by: ${current.requester.tag}`,
            inline: false
          },
          {
            name: `${emoji.queue} Up Next`,
            value: queueString,
            inline: false
          }
        ],
        footer: {
          text: `${queue.size + 1} songs | Total duration: ${formatDuration(totalDuration)}`
        },
        timestamp: new Date()
      }]
    });
  }
};

function formatDuration(ms) {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor(ms / (1000 * 60 * 60));
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}