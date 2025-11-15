# 🎵 Discord Music Bot

<div align="center">


**A powerful, feature-rich Discord music bot powered by Lavalink**

Elevate your server's audio experience with high-quality playback, intuitive commands, and seamless music management.

[![Discord Server](https://img.shields.io/discord/YOUR_SERVER_ID?color=5865F2&logo=discord&logoColor=white)](https://discord.gg/Whq4T2vYPP)
[![Node.js](https://img.shields.io/badge/Node.js-16%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Stars](https://img.shields.io/github/stars/YOUR_USERNAME/YOUR_REPO?style=social)](https://github.com/YOUR_USERNAME/YOUR_REPO/stargazers)

[Features](#-features) • [Installation](#-installation) • [Commands](#-commands) • [Support](#-support--community) • [Contributing](#-contributing)

</div>

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🎧 Audio Quality
- **Lavalink-powered** for crystal-clear sound
- Support for YouTube, Spotify, SoundCloud & more
- Adjustable volume control (0-200%)
- High-performance streaming with minimal latency

</td>
<td width="50%">

### 🎮 Player Control
- Full playback management (play, pause, skip, stop)
- Advanced queue system with shuffle & loop
- Track seeking and position control
- Now playing with rich embeds

</td>
</tr>
<tr>
<td width="50%">

### 📋 Queue Management
- View and manage your music queue
- Move, remove, and clear tracks
- Playlist support with bulk operations
- Queue persistence across sessions

</td>
<td width="50%">

### 🔧 Server Features
- **24/7 Mode** for continuous playback
- Auto-disconnect when inactive
- Per-server prefix customization
- Permission-based command access

</td>
</tr>
</table>

### 🌟 Why Choose This Bot?

- ⚡ **Lightning Fast** — Optimized for speed and reliability
- 🛠️ **Easy Setup** — Get started in minutes with minimal configuration
- 📱 **Active Development** — Regular updates and new features
- 🤝 **Community Driven** — Join our support server for help and feedback
- 🔒 **Stable & Secure** — Built with best practices and error handling

---

## 📦 Installation

### Prerequisites

Before you begin, ensure you have:
- [Node.js](https://nodejs.org/) **v16.0.0** or higher
- [Lavalink Server](https://github.com/freyacodes/Lavalink) running (see [Lavalink Setup](#lavalink-setup))
- A Discord Bot Token from the [Discord Developer Portal](https://discord.com/developers/applications)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/UmbraXDev/Music-Bot.git
   cd Music-Bot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure your bot**
   
   Create a `config.json` file in the root directory:
   ```json
   {
     "token": "YOUR_BOT_TOKEN",
     "prefix": "!",
     "clientId": "YOUR_CLIENT_ID",
     "lavalink": {
       "host": "localhost",
       "port": 2333,
       "password": "youshallnotpass"
     }
   }
   ```

4. **Start the bot**
   ```bash
   node index.js
   ```

   Or use a process manager for production:
   ```bash
   npm install -g pm2
   pm2 start index.js --name discord-music-bot
   ```

### Lavalink Setup

Download and run a Lavalink server:

```bash
# Download Lavalink.jar from https://github.com/freyacodes/Lavalink/releases
java -jar Lavalink.jar
```

Or use Docker:
```bash
docker run -d -p 2333:2333 --name lavalink fredboat/lavalink:latest
```

---

## 🎮 Commands

### 🎶 Music Commands

| Command | Usage | Description |
|---------|-------|-------------|
| `play` | `!play <song/url>` | Play a song or add it to the queue |
| `pause` | `!pause` | Pause the current track |
| `resume` | `!resume` | Resume playback |
| `skip` | `!skip [amount]` | Skip to the next track |
| `stop` | `!stop` | Stop playback and clear the queue |
| `volume` | `!volume <0-200>` | Adjust the player volume |
| `loop` | `!loop [song\|queue\|off]` | Toggle loop mode |
| `shuffle` | `!shuffle` | Shuffle the queue |
| `queue` | `!queue [page]` | Display the current queue |
| `nowplaying` | `!nowplaying` | Show the currently playing song |
| `move` | `!move <from> <to>` | Move a track in the queue |
| `remove` | `!remove <position>` | Remove a track from the queue |
| `clear` | `!clear` | Clear the entire queue |

### 🔊 Voice Commands

| Command | Usage | Description |
|---------|-------|-------------|
| `join` | `!join` | Join your current voice channel |
| `24-7` | `!24-7` | Toggle 24/7 mode (stay in VC) |

### ⚙️ General Commands

| Command | Usage | Description |
|---------|-------|-------------|
| `help` | `!help [command]` | Display all commands or info about a specific command |

---

## 📁 Project Structure

```
discord-music-bot/
├── commands/
│   ├── general/
│   │   └── help.js
│   ├── music/
│   │   ├── play.js
│   │   ├── pause.js
│   │   ├── resume.js
│   │   ├── skip.js
│   │   ├── stop.js
│   │   ├── volume.js
│   │   ├── loop.js
│   │   ├── queue.js
│   │   ├── shuffle.js
│   │   ├── nowplaying.js
│   │   ├── move.js
│   │   ├── remove.js
│   │   └── clear.js
│   └── voice/
│       ├── join.js
│       └── 24-7.js
├── events/
│   ├── ready.js
│   └── messageCreate.js
├── handlers/
│   └── commandHandler.js
├── utils/
│   └── musicPlayer.js
├── config.json
├── index.js
├── package.json
└── README.md
```

---

## 🌐 Support & Community

Need help or want to request a feature?

<div align="center">

[![Discord Server](https://invidget.switchblade.xyz/Whq4T2vYPP)](https://discord.gg/Whq4T2vYPP)

**[Join Our Support Server](https://discord.gg/Whq4T2vYPP)**

Get help, report bugs, suggest features, and connect with other users!

</div>

### 🐛 Found a Bug?

Please [open an issue](https://discord.gg/Whq4T2vYPP) with:
- A clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Your environment (Node.js version, OS, etc.)

---

## 🤝 Contributing

Contributions make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**!

### How to Contribute

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow the existing code style
- Test your changes thoroughly
- Update documentation as needed
- Keep commits atomic and well-described

---

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Discord.js](https://discord.js.org/) - The Discord API wrapper
- [Lavalink](https://github.com/freyacodes/Lavalink) - Audio delivery system
- [Erela.js](https://github.com/MenuDocs/erela.js) - Lavalink wrapper
- All our amazing contributors and supporters!

---

<div align="center">

### ⭐ Star us on GitHub!

If you find this project useful, please consider giving it a star. It helps others discover the project!


**Made with ❤️ by the community**

</div>
