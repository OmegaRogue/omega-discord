const Discord = require('discord.js');
const client = new Discord.Client();


const utils = new require('slashUtils').utils(client);


const config = require('./config.json')


client.on('ready', () => {
  console.log('ready');

  utils.guild.create(config.guild_id, {
    data: {
      name: "hello",
      description: "Replies with Hello World!"
    }
  }).then(()=>{
    console.log("registered hello")
  });

  utils.guild.create(config.guild_id, {
    data: {
      name: "echo",
      description: "Echos your text as an embed",
      options:[
        {
          name: "content",
          description: "Context of the embed",
          type: 3,
          required: true
        }
      ]
    }
  }).then(()=>{
    console.log("registered echo")
  });

  client.ws.on('INTERACTION_CREATE', async interaction => {
    const command = interaction.data.name.toLowerCase();
    const args = interaction.data.options;

    if(command == 'hello') {
      client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
          type: 4,
          data: {
            content: "Hello World!"
          }
        }
      })
    }
    if(command == 'echo') {
      const description = args.find(arg => arg.name.toLowerCase() === "content").value;
      const embed = new Discord.MessageEmbed()
          .setTitle("Echo!")
          .setDescription(description)
          .setAuthor(interaction.member.user.username);

      client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
          type: 4,
          data: await createAPIMessage(interaction, embed)
        }

      });

    }
  });
})





async function createAPIMessage(interaction, content) {
  const apiMessage = await Discord.APIMessage.create(client.channels.resolve(interaction.channel_id), content)
      .resolveData().resolveFiles();
  return apiMessage;
}

client.login(process.env.DISCORD_TOKEN);
