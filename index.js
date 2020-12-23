const {Client, MessageEmbed, APIMessage} = require('discord.js');
const client = new Client();

const {DiscordInteractions, InteractionResponseType, ApplicationCommandOptionType} = require("slash-commands");


const interaction = new DiscordInteractions({
  applicationId: process.env.DISCORD_ID,
  authToken: process.env.DISCORD_TOKEN,
  publicKey: process.env.DISCORD_PUBKEY,
});


const hello = {
  name: "hello",
  description: "Replies with Hello World!"
};


const embedBuilder = {
  name: "embed",
  description: "create your own embed!",
  options: [
    {
      name: "title",
      description: "Title of the embed",
      type: ApplicationCommandOptionType.STRING,
      required: false
    },
    {
      name: "description",
      description: "Description of the embed",
      type: ApplicationCommandOptionType.STRING,
      required: false
    },
    {
      name: "url",
      description: "URL of the embed",
      type: ApplicationCommandOptionType.STRING,
      required: false
    },
    {
      name: "color",
      description: "Color of the embed",
      type: ApplicationCommandOptionType.STRING,
      required: false
    },
    {
      name: "footer",
      description: "Footer of the embed",
      type: ApplicationCommandOptionType.STRING,
      required: false
    }
  ]
};

interaction.getApplicationCommands("135079294262050816")
    .then(console.log)
    .catch(console.error);
interaction.getApplicationCommands()
    .then(console.log)
    .catch(console.error);


interaction.deleteApplicationCommand("791408943736946728", "135079294262050816")
    .then(console.log)
    .catch(console.error);
interaction.deleteApplicationCommand("791408943736946728")
    .then(console.log)
    .catch(console.error);

interaction.createApplicationCommand(hello, "135079294262050816")
    .then(console.log)
    .catch(console.error);
interaction.createApplicationCommand(hello)
    .then(console.log)
    .catch(console.error);

interaction.createApplicationCommand(embedBuilder, "135079294262050816")
    .then(console.log)
    .catch(console.error);
interaction.createApplicationCommand(embedBuilder)
    .then(console.log)
    .catch(console.error);


client.on('ready', () => {
  console.log('ready');

  client.ws.on('INTERACTION_CREATE', async interaction => {
    const command = interaction.data.name.toLowerCase();
    const args = interaction.data.options;

    if (command == 'hello') {
      client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: "Hello World!"
          }
        }
      }).then(console.log).catch(console.error);
    }
    if (command == 'echo') {
      const description = args.find(arg => arg.name.toLowerCase() === "content").value;
      const embed = new MessageEmbed()
          .setTitle("Echo!")
          .setDescription("test")
          .setAuthor(interaction.member.user.username);

      client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: await createAPIMessage(interaction, embed)
        }
      }).then(console.log).catch(console.error);

    }
    if (command == 'embed') {
      const embed = new MessageEmbed().setAuthor(interaction.member.user.username);

      if (args !== undefined) {
        if (args.find(arg => arg.name.toLowerCase() === "title")) {
          const title = args.find(arg => arg.name.toLowerCase() === "title").value;
          embed.setTitle(title)
        }
        if (args.find(arg => arg.name.toLowerCase() === "description")) {
          const description = args.find(arg => arg.name.toLowerCase() === "description").value;
          embed.setDescription(description)
        }
        if (args.find(arg => arg.name.toLowerCase() === "url")) {
          const url = args.find(arg => arg.name.toLowerCase() === "url").value;
          embed.setURL(url)
        }
        if (args.find(arg => arg.name.toLowerCase() === "color")) {
          const color = args.find(arg => arg.name.toLowerCase() === "color").value;
          embed.setColor(color)
        }
        if (args.find(arg => arg.name.toLowerCase() === "footer")) {
          const footer = args.find(arg => arg.name.toLowerCase() === "footer").value;
          embed.setFooter(footer)
        }
      }


      client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
          type: InteractionResponseType.CHANNEL_MESSAGE,
          data: await createAPIMessage(interaction, embed)
        }
      }).then(console.log).catch(console.error);
    }
  });
})


async function createAPIMessage(interaction, content) {
  const apiMessage = await APIMessage.create(client.channels.resolve(interaction.channel_id), content).resolveData().resolveFiles();
  return {...apiMessage.data, files: apiMessage.files};
}

client.login(process.env.DISCORD_TOKEN).then(console.log).catch(console.error);
