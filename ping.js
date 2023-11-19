const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
  category: "utility",
  // Can comment out cooldown line to put default to 3 seconds instead of 10.
  cooldown: 10,
  async execute(interaction) {
    return interaction.reply("Pong!");
  },
};
