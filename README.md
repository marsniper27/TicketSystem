# Discord Ticketing System Library

This Discord Ticketing System library enables Discord server administrators to efficiently manage support requests or inquiries through a ticket-based system. With this library, users can create support tickets that are organized into categories (e.g., "Tickets", "Tickets #2" when the first is full, etc.), ensuring that support requests are managed in an orderly and scalable manner.

## Features

- **Ticket Creation**: Users can create a ticket through a Discord slash command.
- **Automatic Ticket Categorization**: Tickets are automatically organized into categories based on availability, with new categories being created as needed.
- **Role-based Access**: Tickets are private channels, accessible only to the ticket creator, specified team roles, and optionally, bot administrators.
- **Customizable**: The ticketing system allows for customization, including specifying which roles can view and manage tickets.

## Prerequisites

- Node.js (version 16.x or newer)
- A Discord Bot Token
- MongoDB for ticket data storage
- `discord.js` library (v13.x or newer)

## Installation

To use this library, you will first need to set up a Discord bot and invite it to your server. Follow these steps:

1. Clone the repository to your local machine:
   `git clone https://github.com/marsniper27/TicketSystem.git`

2. Navigate to the cloned directory:
    `cd discord-ticketing-system`

3. Install the required dependencies:
    `npm install`

4. Create a .env file in the root directory and add your Discord bot token and MongoDB credentials:
    ```js
    DISCORD_TOKEN=your_discord_bot_token
    MONGO_DB_ADDRESS=your_mongodb_address
    MONGO_PASSWORD=your_mongodb_password
    TEAM_ROLE=your_team_role_id
    ```

## Configuration
Before using the ticketing system, ensure you have configured the necessary permissions for your bot:

* The bot requires permissions to create and manage channels within your Discord server.
* Assign the `TEAM_ROLE` ID in your `.env` file to specify which role(s) can access and manage tickets.

## Usage
After installation and configuration, your bot can create tickets using the `/create_ticket` slash command. This command initializes a new support ticket, creating a dedicated channel under the appropriate "Tickets" category.

## Customization
You can customize the ticketing system to suit your needs. Explore the `createTicket.js` script to adjust settings like channel names, permission overwrites, and the response messages.

## Contributing
Contributions to the Discord Ticketing System library are welcome. Please feel free to fork the repository, make your changes, and submit a pull request.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Support
If you encounter any issues or have questions about implementing the ticketing system, please open an issue in the GitHub repository.