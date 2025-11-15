module.exports = {
  name: 'voiceStateUpdate',
  execute(oldState, newState, client) {
    const player = client.manager.get(oldState.guild.id);
    
    if (!player) return;
    
    if (oldState.id === client.user.id && !newState.channelId) {
      player.destroy();
      return;
    }
    
    if (client.config.leaveOnEmpty && player.voiceChannel === oldState.channelId) {
      const voiceChannel = oldState.guild.channels.cache.get(player.voiceChannel);
      
      if (!voiceChannel) return;
      
      const members = voiceChannel.members.filter(m => !m.user.bot);
      
      if (members.size === 0 && !player.get('24/7')) {
        setTimeout(() => {
          const updatedChannel = oldState.guild.channels.cache.get(player.voiceChannel);
          if (!updatedChannel) return;
          
          const updatedMembers = updatedChannel.members.filter(m => !m.user.bot);
          
          if (updatedMembers.size === 0 && player) {
            const textChannel = client.channels.cache.get(player.textChannel);
            if (textChannel) {
              textChannel.send('👋 Left voice channel due to inactivity.');
            }
            player.destroy();
          }
        }, client.config.leaveOnEmptyDelay);
      }
    }
  }
};