module.exports = {
  name: 'messageCreate',
  execute(message, client) {
    if (message.author.bot || !message.guild) return;
    
    const { prefix } = client.config;
    
    if (!message.content.startsWith(prefix)) return;
    
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    
    const command = client.commands.get(commandName) || 
                   client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    
    if (!command) return;
    
    if (command.guildOnly && !message.guild) {
      return message.reply('❌ This command can only be used in servers!');
    }
    
    if (command.voiceChannel && !message.member.voice.channel) {
      return message.reply('❌ You need to be in a voice channel to use this command!');
    }
    
    if (command.sameVoiceChannel) {
      const player = client.manager.get(message.guild.id);
      if (player && player.voiceChannel && player.voiceChannel !== message.member.voice.channel.id) {
        return message.reply('❌ You need to be in the same voice channel as the bot!');
      }
    }
    
    const { cooldowns } = client;
    
    if (!cooldowns.has(command.name)) {
      cooldowns.set(command.name, new Map());
    }
    
    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;
    
    if (timestamps.has(message.author.id)) {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
      
      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        return message.reply(`⏳ Please wait ${timeLeft.toFixed(1)} more seconds before using \`${command.name}\` again.`);
      }
    }
    
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    
    try {
      command.execute(message, args, client);
    } catch (error) {
      console.error(`Error executing command ${command.name}:`, error);
      message.reply('❌ There was an error executing that command!');
    }
  }
};