const emoji = require('../../emoji');

module.exports = {
  name: 'play',
  aliases: ['p'],
  description: 'Play a song from YouTube',
  usage: '<song name or URL>',
  voiceChannel: true,
  cooldown: 3,
  execute: async (message, args, client) => {
    if (!args.length) {
      return message.reply(`${emoji.error} Please provide a song name or URL!`);
    }

    const query = args.join(' ');
    
    let player = client.manager.get(message.guild.id);
    
    if (!player) {
      player = client.manager.create({
        guild: message.guild.id,
        voiceChannel: message.member.voice.channel.id,
        textChannel: message.channel.id,
        selfDeafen: true,
        volume: client.config.defaultVolume
      });
    }
    
    if (!player.connected) player.connect();
    
    const res = await client.manager.search(query, message.author);
    
    if (res.loadType === 'LOAD_FAILED' || res.loadType === 'NO_MATCHES') {
      return message.reply(`${emoji.error} No results found for: ${query}`);
    }
    
    let embed = {
      color: parseInt(client.config.embedColor.replace('#', ''), 16),
      timestamp: new Date()
    };
    
    if (res.loadType === 'PLAYLIST_LOADED') {
      const playlist = res.playlist;
      
      if (playlist.tracks.length > client.config.maxPlaylistSize) {
        return message.reply(`${emoji.error} Playlist is too large! Maximum ${client.config.maxPlaylistSize} songs allowed.`);
      }
      
      for (const track of playlist.tracks) {
        player.queue.add(track);
      }
      
      embed.title = `${emoji.queue} Playlist Added to Queue`;
      embed.description = `[${playlist.name}](${query})`;
      embed.fields = [
        { name: 'Tracks', value: `${playlist.tracks.length}`, inline: true },
        { name: 'Requested by', value: message.author.tag, inline: true }
      ];
      
      message.channel.send({ embeds: [embed] });
    } else {
      const track = res.tracks[0];
      
      if (player.queue.size >= client.config.maxQueueSize) {
        return message.reply(`${emoji.error} Queue is full! Maximum ${client.config.maxQueueSize} songs allowed.`);
      }
      
      player.queue.add(track);
      
      embed.title = `${emoji.success} Added to Queue`;
      embed.description = `[${track.title}](${track.uri})`;
      embed.fields = [
        { name: 'Author', value: track.author, inline: true },
        { name: 'Duration', value: formatDuration(track.duration), inline: true },
        { name: 'Position in queue', value: `${player.queue.size}`, inline: true }
      ];
      embed.thumbnail = { url: track.thumbnail };
      
      message.channel.send({ embeds: [embed] });
    }
    
    if (!player.playing && !player.paused) {
      player.play();
    }
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