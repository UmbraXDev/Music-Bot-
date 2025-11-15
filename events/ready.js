const { Manager } = require('erela.js');

module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`\n🤖 Bot logged in as ${client.user.tag}`);
    console.log(`📊 Serving ${client.guilds.cache.size} guilds`);
    console.log(`🆔 Bot User ID: ${client.user.id}`);
    
    client.manager = new Manager({
      nodes: [
        {
          host: client.config.lavalink.host,
          port: client.config.lavalink.port,
          password: client.config.lavalink.password,
          secure: client.config.lavalink.secure || false,
          identifier: client.config.lavalink.identifier || 'primary-node',
          retryAmount: 3,
          retryDelay: 3000
        }
      ],
      autoPlay: true,
      clientName: client.config.clientName || 'DiscordMusicBot/1.0.0',
      clientId: client.user.id,
      shards: 1,
      send: (id, payload) => {
        const guild = client.guilds.cache.get(id);
        if (guild) guild.shard.send(payload);
      }
    });

    client.manager
      .on('nodeConnect', node => {
        console.log(`✅ Successfully connected to Lavalink node: ${node.options.identifier}`);
        console.log(`   Host: ${node.options.host}:${node.options.port}`);
        console.log(`   Secure: ${node.options.secure ? 'Yes (WSS)' : 'No (WS)'}`);
      })
      .on('nodeReconnect', node => {
        console.log(`🔄 Attempting to reconnect to node: ${node.options.identifier}`);
      })
      .on('nodeDisconnect', (node, reason) => {
        console.log(`⚠️ Node ${node.options.identifier} disconnected`);
        console.log(`   Reason:`, reason);
      })
      .on('nodeError', (node, error) => {
        if (error.message.includes('Unexpected op "ready"')) {
          console.log(`ℹ️  Node ${node.options.identifier}: Protocol version mismatch (harmless - music will still work)`);
          return;
        }
        
        console.error(`❌ Node ${node.options.identifier} connection error:`);
        console.error(`   Error: ${error.message}`);
        
        if (error.message.includes('400')) {
          console.error('\n🔧 Troubleshooting 400 Error:');
          console.error('   1. Check if Authorization header is correctly formatted');
          console.error('   2. Verify password in config.json matches Lavalink password');
          console.error('   3. Ensure you\'re using the correct protocol (ws:// or wss://)');
          console.error(`   4. Current settings: ${node.options.secure ? 'wss' : 'ws'}://${node.options.host}:${node.options.port}`);
          console.error('   5. Try alternative nodes or run your own Lavalink server\n');
        }
        
        if (error.message.includes('401') || error.message.includes('403')) {
          console.error('   ⚠️ Authentication failed - check your Lavalink password!');
        }
      })
      .on('trackStart', (player, track) => {
        const channel = client.channels.cache.get(player.textChannel);
        if (!channel) return;
        
        channel.send({
          embeds: [{
            color: parseInt(client.config.embedColor.replace('#', ''), 16),
            title: '🎵 Now Playing',
            description: `[${track.title}](${track.uri})`,
            fields: [
              { name: 'Author', value: track.author, inline: true },
              { name: 'Duration', value: formatDuration(track.duration), inline: true }
            ],
            thumbnail: { url: track.thumbnail },
            timestamp: new Date()
          }]
        }).catch(err => console.error('Error sending now playing message:', err));
      })
      .on('queueEnd', player => {
        const channel = client.channels.cache.get(player.textChannel);
        if (!channel) return;
        
        if (player.get('24/7')) {
          channel.send('✅ Queue ended. 24/7 mode is enabled - staying in voice channel.')
            .catch(err => console.error('Error sending queue end message:', err));
          return;
        }
        
        channel.send('✅ Queue ended. Leaving voice channel in 1 minute...')
          .catch(err => console.error('Error sending queue end message:', err));
        
        setTimeout(() => {
          if (player && player.queue.size === 0 && !player.playing) {
            player.destroy();
          }
        }, client.config.leaveOnEndDelay || 60000);
      })
      .on('trackError', (player, track, error) => {
        console.error(`Track error for ${track?.title}:`, error);
        const channel = client.channels.cache.get(player.textChannel);
        if (channel) {
          channel.send(`❌ Error playing track: ${error.message}`)
            .catch(err => console.error('Error sending track error message:', err));
        }
        
        if (player.queue.size > 0) {
          player.stop();
        } else {
          player.destroy();
        }
      })
      .on('trackStuck', (player, track, threshold) => {
        console.warn(`Track stuck: ${track?.title} (threshold: ${threshold}ms)`);
        const channel = client.channels.cache.get(player.textChannel);
        if (channel) {
          channel.send('⚠️ Track got stuck, skipping...')
            .catch(err => console.error('Error sending stuck message:', err));
        }
        player.stop();
      })
      .on('playerCreate', player => {
        console.log(`🎵 Player created for guild ${player.guild}`);
      })
      .on('playerDestroy', player => {
        console.log(`🗑️ Player destroyed for guild ${player.guild}`);
      });
    
    try {
      client.manager.init(client.user.id);
      console.log('🎵 Lavalink Manager initialized');
      console.log('⏳ Connecting to Lavalink nodes...\n');
    } catch (error) {
      console.error('❌ Failed to initialize Lavalink Manager:', error);
    }
  }
};

function formatDuration(ms) {
  if (!ms || ms === 0) return 'LIVE';
  
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor(ms / (1000 * 60 * 60));
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
