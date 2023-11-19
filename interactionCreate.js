const { Events } = require("discord.js");
const { red, bold, underline } = require("kleur");

// Define a new Map to hold the cooldowns
const cooldowns = new Map();

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(
        "No command matching " +
          red().bold().underline(`${interaction.commandName}`) +
          " was found."
      );
      return;
    }

    // Cooldown logic
    if (!cooldowns.has(command.name)) {
      cooldowns.set(command.name, new Map());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000; // Cooldown period in milliseconds

    if (timestamps.has(interaction.user.id)) {
      const expirationTime =
        timestamps.get(interaction.user.id) + cooldownAmount;

      // Made one change to have the reply be ephemeral.
      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        return interaction.reply({
          content: `Please wait ${timeLeft.toFixed(
            1
          )} more second(s) before reusing the \`${command.name}\` command.`,
          ephemeral: true,
        });
      }
    }

    timestamps.set(interaction.user.id, now);
    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(
        "Error executing " +
          red().bold().underline(`${interaction.commandName}`) +
          "."
      );
      console.error(error);
    }
  },
};
