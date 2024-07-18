"use strict";

const { Client, GatewayIntentBits } = require("discord.js");
const { DISCORD_CHANNEL_ID, DISCORD_BOT_TOKEN } = process.env;

class loggerService {
  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });
    this.client.on("ready", () => {
      console.log(`Logged in as ${this.client.user.tag}`);
    });
    this.client.login(DISCORD_BOT_TOKEN);
  }
  sendMessage(message = "message") {
    const channel = this.client.channels.cache.get(DISCORD_CHANNEL_ID);
    if (!channel) console.log("Channel not found");
    channel.send(message).catch((error) => {
      console.log("Error sending message to Discord", error);
    });
  }
  sendFormatLog({ url, method, message }) {
    const channel = this.client.channels.cache.get(DISCORD_CHANNEL_ID);
    if (!channel) console.log("Channel not found");
    channel
      .send(
        `URL: ${url} \n Method: ${method} \n Message: \n${JSON.stringify(
          message,
          null,
          2
        )}\n`
      )
      .catch((error) => {
        console.log("Error sending message to Discord", error);
      });
  }
}
const LoggerService = new loggerService();
module.exports = LoggerService;
