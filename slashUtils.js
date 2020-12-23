const Discord = require('discord.js');


class SlashUtils {
  constructor(client) {
    this.client = client;
    this.global = new GlobalUtils(client);
    this.guild = new GuildUtils(client);
  }


}

class GlobalUtils{
  constructor(client) {
    this.client = client;
  }

  delete(commandId) {
    return this.client.api.applications(this.client.user.id).commands(commandId).delete();
  }
  get() {
    return this.client.api.applications(this.client.user.id).commands.get();
  }
  create(data) {
    return this.client.api.applications(this.client.user.id).commands.post(data)
  }

}

class GuildUtils{
  constructor(client) {
    this.client = client;
  }
  delete(guildId, commandId) {
    return this.client.api.applications(this.client.user.id).guilds(guildId).commands(commandId).delete();
  }
  get(guildId) {
    return this.client.api.applications(this.client.user.id).guilds(guildId).commands.get();
  }
  create(guildId, data) {
    return this.client.api.applications(this.client.user.id).guilds(guildId).commands.post(data)
  }
}

exports.utils = SlashUtils