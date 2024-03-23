// const { removeEntry } = require('../utils/db'); // Adjust the path as necessary
const { removeEntry } = require("mars-simple-mongodb"); // Adjust the import path as necessary

async function interactionHandler(interaction){
        if (!interaction.isButton()) return;
        if (interaction.customId === 'close_ticket') {
            const ticketChannel = interaction.channel;
            try {
                // Remove the ticket entry from the database
                await removeEntry('tickets', interaction.guildId, interaction.user.id);
                // Delete the ticket channel
                await ticketChannel.delete();
            } catch (error) {
                console.error(error);
                // Optionally, send a message to the channel or log before deleting
            }
        }
};

module.exports = interactionHandler;
