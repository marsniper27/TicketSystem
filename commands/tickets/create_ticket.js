// createTicket.js
require('dotenv').config();
const { SlashCommandBuilder, ChannelType, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
// const { findEntryByID, saveEntry } = require('../../utils/db'); // Assuming removeEntry is correctly implemented in your database utility
const { findEntryByID, saveEntry } = require("mars-simple-mongodb"); // Adjust the import path as necessary

module.exports = {
    data: new SlashCommandBuilder()
        .setName('create_ticket')
        .setDescription('Create a Support ticket'),
    async execute(interaction) {
        const guild = interaction.guild;
        const target = interaction.user;
        // Assume "teamRoleId" is the ID of your "team" role. Replace "YOUR_TEAM_ROLE_ID" with the actual role ID.
        const teamRoleId = process.env.TEAM_ROLE; 

        // Function to find or create a ticket category
        async function findOrCreateTicketCategory() {
            // Fetch all categories
            const categories = await guild.channels.fetch().then(channels => channels.filter(ch => ch.type === ChannelType.GuildCategory && ch.name.startsWith('Tickets')));
            let ticketCategory = categories.find(cat => cat.children.cache.size < 50);
            
            // If no suitable category found, create a new one
            if (!ticketCategory) {
                const categoryCount = categories.size + 1;
                ticketCategory = await guild.channels.create({
                    name: `Tickets #${categoryCount}`,
                    type: ChannelType.GuildCategory,
                });
            }

            return ticketCategory;
        }

        try {
            const ticketInfo = await findEntryByID('tickets', interaction.guildId, target.id);
            if (ticketInfo) {
                await interaction.reply({ content: `Ticket already open <#${ticketInfo.ticketId}>`, ephemeral: true });
                return;
            }

            await interaction.reply({ content: `Creating Ticket...`, ephemeral: true });

            const ticketCategory = await findOrCreateTicketCategory();

            // Create the ticket channel within the found or newly created category
            const ticketChannel = await guild.channels.create({
                name: `${target.username}-support`,
                type: ChannelType.GuildText,
                parent: ticketCategory.id,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id, // Deny access to everyone by default
                        deny: [PermissionFlagsBits.ViewChannel],
                    },
                    {
                        id: target.id, // Allow the ticket creator to view the channel
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                    },
                    {
                        id: teamRoleId, // Allow the "team" role to view the channel
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                    },
                    {
                        id: process.env.CLIENT_ID, // The bot's user ID
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                    }
                ],
            });

            // Create a button for closing the ticket
            const closeButton = new ButtonBuilder()
                .setCustomId('close_ticket')
                .setLabel('Close Ticket')
                .setStyle(ButtonStyle.Danger);

            const row = new ActionRowBuilder().addComponents(closeButton);

            await ticketChannel.send({
                content: `Support ticket created for ${target.username}. A member of our team will be with you shortly. Click the button below if you wish to close this ticket.`,
                components: [row],
            });

            await saveEntry('tickets', interaction.guildId, {
                _id: target.id,
                ticketId: ticketChannel.id,
            });

            
            await interaction.editReply({ content: `Ticket created <#${ticketChannel.id}>`, ephemeral: true })

        } catch (error) {
            console.error(error);
            await interaction.followUp({ content: 'There was an error while trying to create a ticket.', ephemeral: true });
        }
    }
};
