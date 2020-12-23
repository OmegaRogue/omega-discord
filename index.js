const { Client, MessageEmbed, APIMessage } = require('discord.js');
const client = new Client();

const { DiscordInteractions } = require("slash-commands");

const interaction = new DiscordInteractions({
  applicationId: process.env.DISCORD_ID,
  authToken: process.env.DISCORD_TOKEN,
  publicKey: process.env.DISCORD_PUBKEY,
});



const echo = {
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
};

const hello = {
  name: "hello",
  description: "Replies with Hello World!"
};

// interaction.getApplicationCommands("135079294262050816")
//     .then(console.log)
//     .catch(console.error);


interaction.createApplicationCommand(echo, "135079294262050816")
    // .then(console.log)
    .catch(console.error);

interaction.createApplicationCommand(hello, "135079294262050816")
    // .then(console.log)
    .catch(console.error);


client.on('ready', () => {
  console.log('ready');

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
      }).then(console.log).catch(console.error);
    }
    if(command == 'echo') {
      const description = args.find(arg => arg.name.toLowerCase() === "content").value;
      const embed = new MessageEmbed()
          .setTitle("Echo!")
          .setDescription("test")
          .setAuthor(interaction.member.user.username);

      client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
          type: 4,
          data: await createAPIMessage(interaction, embed)
        }
      }).then(console.log).catch(console.error);

    }
  });
})






async function createAPIMessage(interaction, content) {
  const apiMessage = await APIMessage.create(client.channels.resolve(interaction.channel_id), content).resolveData().resolveFiles();
  return apiMessage;
}

client.login(process.env.DISCORD_TOKEN);
