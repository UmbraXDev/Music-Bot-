const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  name: 'help',
  aliases: ['h', 'commands'],
  description: 'Show all available commands',
  cooldown: 5,
  execute: async (message, args, client) => {
    const { prefix } = client.config;
    
    const emoji = {
       musical_note: "<a:Musical_Note:1435508545360760882>",
  info: "<:info:1435508527258009661>",
  queue: "<a:hds:1435508574758637619>",
  volume: "<:AkenoMusicVolume:1435508354159218859>",
  success: "<a:success:1435508488062242918>",
  users: "👥",
  support: "🛠️",
  error: "<a:wwwe:1435508513731248158>",
  warning: "<a:wwwe:1435508513731248158>",
  loading: "<a:loading:1435508474787270777>",
  play: "<a:play_music:1435508260089233428>",
  pause: "<:Pause:1435508272802041973>",
  stop: "<:error:1435508500649218109>",
  skip: "<a:ArrowWhite:1435508686087913533>",
  loop: "<:fffdd:1435508341383106610>",
  shuffle: "<:shuffle:1435508328095813673>",
  radio: "📻"
    };
    
    const commands = {
      '🎵 Music Commands': [
        { name: 'play', value: `\`${prefix}play <song>\` - Play a song from YouTube`, inline: false },
        { name: 'pause', value: `\`${prefix}pause\` - Pause the current song`, inline: true },
        { name: 'resume', value: `\`${prefix}resume\` - Resume playback`, inline: true },
        { name: 'skip', value: `\`${prefix}skip\` - Skip the current song`, inline: true },
        { name: 'stop', value: `\`${prefix}stop\` - Stop playback and leave`, inline: true },
        { name: 'nowplaying', value: `\`${prefix}nowplaying\` - Show current song`, inline: true },
        { name: 'volume', value: `\`${prefix}volume <1-100>\` - Change volume`, inline: true }
      ],
      '📜 Queue Commands': [
        { name: 'queue', value: `\`${prefix}queue\` - Show the queue`, inline: true },
        { name: 'shuffle', value: `\`${prefix}shuffle\` - Shuffle the queue`, inline: true },
        { name: 'loop', value: `\`${prefix}loop <off/song/queue>\` - Set loop mode`, inline: true },
        { name: 'remove', value: `\`${prefix}remove <position>\` - Remove a song`, inline: true },
        { name: 'move', value: `\`${prefix}move <from> <to>\` - Move a song`, inline: true },
        { name: 'clear', value: `\`${prefix}clear\` - Clear the queue`, inline: true }
      ],
      '📻 Voice': [
        { name: 'join', value: `\`${prefix}join\` - Join your voice channel`, inline: true },
        { name: '24-7', value: `\`${prefix}24-7\` - Toggle 24/7 mode`, inline: true }
      ]
    };
    
    const embeds = [];
    
    embeds.push({
      color: parseInt(client.config.embedColor.replace('#', ''), 16),
      author: {
        name: `${client.user.username} - Help Menu`,
        iconURL: client.user.displayAvatarURL()
      },
      description: `**Prefix:** \`${prefix}\`\n**Total Commands:** ${client.commands.size}\n\nUse the buttons below to navigate through categories.`,
      fields: [
        {
          name: `${emoji.info} Bot Information`,
          value: `${emoji.users} **Servers:** ${client.guilds.cache.size}\n${emoji.musical_note} **Queue Limit:** ${client.config.maxQueueSize || 100} songs\n${emoji.queue} **Playlist Limit:** ${client.config.maxPlaylistSize || 50} songs\n${emoji.radio} **Radio Stations:** Comming Soon!`,
          inline: false
        }
      ],
      footer: {
        text: 'Page 1 of ' + (Object.keys(commands).length + 2)
      },
      timestamp: new Date()
    });
    
    for (const [category, categoryCommands] of Object.entries(commands)) {
      embeds.push({
        color: parseInt(client.config.embedColor.replace('#', ''), 16),
        title: category,
        fields: categoryCommands,
        footer: {
          text: `Page ${embeds.length} of ${Object.keys(commands).length + 2} | Use ${prefix}help for main menu`
        },
        timestamp: new Date()
      });
    }
    
    embeds.push({
      color: parseInt(client.config.embedColor.replace('#', ''), 16),
      title: `${emoji.support} Support & Links`,
      description: [
        `**Support Server:** [Join Here](https://discord.gg/Whq4T2vYPP)`,
        `**Created by:** Umbra X Development`
      ].join('\n'),
      footer: {
        text: `Page ${embeds.length} of ${embeds.length} | Thank you for using ${client.user.username}!`
      },
      timestamp: new Date()
    });
    
    let currentPage = 0;
    
    const getButtons = (disabled = false) => {
      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('help_previous')
            .setLabel('◀ Previous')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(disabled),
          new ButtonBuilder()
            .setCustomId('help_home')
            .setLabel('🏠 Home')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(disabled),
          new ButtonBuilder()
            .setCustomId('help_next')
            .setLabel('Next ▶')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(disabled),
          new ButtonBuilder()
            .setCustomId('help_close')
            .setLabel('✖ Close')
            .setStyle(ButtonStyle.Danger)
            .setDisabled(disabled)
        );
      return row;
    };
    
    try {
      const msg = await message.channel.send({ 
        embeds: [embeds[currentPage]], 
        components: [getButtons()] 
      });
      
      const filter = (interaction) => {
        if (interaction.user.id !== message.author.id) {
          interaction.reply({ content: '❌ This help menu is not for you!', ephemeral: true });
          return false;
        }
        return true;
      };
      
      const collector = msg.createMessageComponentCollector({ filter, time: 120000 });
      
      collector.on('collect', async (interaction) => {
        if (interaction.customId === 'help_previous') {
          currentPage = currentPage - 1 < 0 ? embeds.length - 1 : currentPage - 1;
        } else if (interaction.customId === 'help_next') {
          currentPage = currentPage + 1 >= embeds.length ? 0 : currentPage + 1;
        } else if (interaction.customId === 'help_home') {
          currentPage = 0;
        } else if (interaction.customId === 'help_close') {
          collector.stop('user_closed');
          await interaction.update({ 
            embeds: [embeds[currentPage]], 
            components: [getButtons(true)] 
          });
          setTimeout(() => msg.delete().catch(() => {}), 2000);
          return;
        }
        
        await interaction.update({ 
          embeds: [embeds[currentPage]], 
          components: [getButtons()] 
        });
      });
      
      collector.on('end', async (collected, reason) => {
        if (reason !== 'user_closed') {
          await msg.edit({ components: [getButtons(true)] }).catch(() => {});
        }
      });
      
    } catch (error) {
      console.error('Error in help command:', error);
      message.channel.send('❌ An error occurred while displaying the help menu.').catch(() => {});
    }
  }
};
