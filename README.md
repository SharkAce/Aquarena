# Aquarena

## Preface
Aquarena is an open source multiplayer game in development it contains the code for a game with a client-server architecture. The project is divided into three main parts: the Client, the Server, and the Protocol. Each part is contained in its own directory with its own `README.md` file for more detailed information.

## Project Structure

- **Client**: The client is developed in C++ using the SFML library. It handles the game's user interface and communicates with the server to synchronize the game state.
- **Server**: The server is implemented in TypeScript and runs in a Node.js environment. It manages game logic, player interactions, and maintains the game state.
- **Protocol**: This part contains Protocol Buffers (`.proto` files) that define the communication protocol between the client and server.

## Components

### [Client](./Client/README.md)

The Client handles the game's user interface and user input. It communicates with the server to send and receive game state updates. The client is built using the SFML library.

For more information, see the [Client README](./Client/README.md).

### [Server](./Server/README.md)

The Server is responsible for managing the game state and handling player interactions. It is built using TypeScript and runs in a Node.js environment. The server ensures that all players have a consistent view of the game.

For more information, see the [Server README](./Server/README.md).

### [Protocol](./Protocol/README.md)

The Protocol directory contains Protocol Buffers files (`.proto` files) that define the messages exchanged between the client and server. These files ensure that the communication between the client and server is efficient and reliable.

For more information, see the [Protocol README](./Protocol/README.md).
