const emoji = require('../../emoji');

module.exports = {
  name: 'nowplaying',
  aliases: ['np', 'current'],
  description: 'Show the currently playing song',
  cooldown: 3,
  execute: (message, args, client) => {
    const player = client.manager.get(message.guild.id);
    
    if (!player) {
      return message.reply(`${emoji.error} Nothing is playing!`);
    }
    
    const track = player.queue.current;
    
    if (!track) {
      return message.reply(`${emoji.error} No song is currently playing!`);
    }
    
    const position = player.position;
    const duration = track.duration;
    const bar = createProgressBar(position, duration);
    
    message.channel.send({
      embeds: [{
        color: parseInt(client.config.embedColor.replace('#', ''), 16),
        author: {
          name: 'Now Playing',
          iconURL: message.guild.iconURL({ dynamic: true })
        },
        title: track.title,
        url: track.uri,
        description: `By ${track.author}`,
        fields: [
          {
            name: 'Duration',
            value: `${formatDuration(position)} / ${formatDuration(duration)}`,
            inline: true
          },
          {
            name: 'Requested by',
            value: track.requester.tag,
            inline: true
          },
          {
            name: 'Volume',
            value: `${player.volume}%`,
            inline: true
          },
          {
            name: 'Progress',
            value: bar,
            inline: false
          }
        ],
        thumbnail: { url: track.thumbnail },
        footer: { text: `Queue: ${player.queue.size} songs` },
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

function createProgressBar(current, total) {
  const percentage = current / total;
  const progress = Math.round(20 * percentage);
  const emptyProgress = 20 - progress;
  
  const progressText = '▇'.repeat(progress);
  const emptyProgressText = '—'.repeat(emptyProgress);
  
  return progressText + emptyProgressText;
}