# Networking Protocol Specifications

## Preface:
The communication between the client and the server uses a combination of UDP and TCP, with the data serialized as Protocol Buffers [see here](https://protobuf.dev/).

## Structure:
The protocol has four main packages, they are:

| Name             | Role                                                 |
| :--------------: | ---------------------------------------------------- |
| Wrapper          | Encapsulates every message before sending.           |
| ClientRequest    | Used by the client to send requests.                 |
| ServerResponse   | Used by the server to respond to requests.           |
| ServerAlert      | Used by the server to send notifications to clients. |

Each of these packages has one or two nested packages, they are:

| Name | Role                                           |
| :--: | ---------------------------------------------- |
| TCP  | Holds messages intended for TCP communication. |
| UDP  | Holds messages intended for UDP communication. |

### Notes:
  - All messages in the UDP package must be initiated by the client since the server only retains the client's remote info within the scope of the message handling. Consequently, `ServerAlert.UDP` is not a valid package. This approach helps prevent errors that can occur when some NAT clients reset their external port after a certain delay.

## Message Serialization:

Before sending any message from the client to the server or vice versa, the message must be properly serialized to ensure it can be correctly interpreted upon receipt. The serialization process follows these steps.

1. **Serialize the Message:**
   - First, the actual message (e.g., `LoginRequest`, `ActionRequest`, etc.) is serialized into a byte array.

2. **Initialize the Wrapper:**
   - Next, create an instance of the appropriate wrapper (`TcpWrapper` or `UdpWrapper`). Set the `messageType` field to the corresponding enum value that identifies the type of the message being sent and assign the serialized byte array of the message to the `payload` field of the wrapper.

3. **Serialize the Wrapper:**
   - Finally, serialize the wrapper itself into a byte array. This ensures that the message type, and the serialized payload are serialized together.

This byte array of the wrapper is what gets sent over the network. On the receiving end, the process is reversed: the wrapper is deserialized first to determine the message type, and then the payload is deserialized to retrieve the original message.

### Examples:

- **Client (C++)**
    ```cpp
	// Initialize the message
	ClientRequest::TCP::LoginRequest request;
	request.set_username(username);

	// Initialize the wrapper
	TcpWrapper wrapper;
	wrapper.set_payload_type(TcpWrapper::LoginRequest);
	wrapper.set_payload(request.SerializeAsString());

    // Serialize the wrapper into a byte array
	int size = wrapper.ByteSizeLong();
	std::vector<char> serialized_wrapper(size);
	wrapper.SerializeToArray(serialized_wrapper.data(), size);
    ```

- **Server (TypeScript)**
    ```ts
    // Initialize the message
    const response: LoginResponse = LoginResponse.create({ 
        success: true,
        sessionId: uuidParse(getSessionId())
    });
    
    // Initialize the wrapper
    const wrapper: TcpWrapper = TcpWrapper.create({
        payload: LoginResponse.encode(response).finish(),
        type: MessageType.LoginResponse
    });
    
    // Serialize the wrapper into a byte array
    const serializedWrapper: Uint8Array = TcpWrapper.encode(wrapper).finish();
    ```

This byte array `serialized_wrapper` is then transmitted over the network.

Note that the `bytes` type in protobuf is represented as a `std::string` in C++ and a `Uint8Array` in TypeScript.

## Messages:

### Wrapper:

#### TCP:

- **TcpWrapper**
  - Description: Prefixes a TCP message with an enum representing its type and the payload size.
  - Fields:
    - `payload_type` (enum):
      | MessageType        | int |
      | :----------------: | :-: |
      | LoginRequest       |  0  |
      | LoginResponse      |  1  |
      | FindMatchRequest   |  2  |
      | FindMatchResponse  |  3  |
      | ChatMessageRequest |  4  |
      | ShareChatMessage   |  5  |
    - `payload` (bytes): The serialized message to prefix.

#### UDP:

- **UdpWrapper**
  - Description: Prefixes a UDP message with an enum representing its type and the payload size.
  - Fields:
    - `payload_type` (enum):
      | MessageType         | int |
      | :-----------------: | :-: |
      | GameStateRequest    |  0  |
      | GameStateResponse   |  1  |
      | ActionRequest       |  2  |
      | ActionResponse      |  3  |
    - `payload` (bytes): The serialized message to prefix.

### ClientRequest:

#### TCP:

- **LoginRequest**
  - Description: Represents a client's request to login with a username and password.
  - Fields:
    - `username` (string): The username of the client.
    - `password` (optional bytes): The hashed password of the client.
    
- **FindMatchRequest**
  - Description: Represents a client's request to get a `match_id` it can subscribe to.
  - Fields:
    - `session_id` (Uint8[16]): Identifier for the client's current session.

- **ChatMessageRequest**
  - Description: Represents a client's request to send a chat message.
  - Fields:
    - `session_id` (Uint8[16]): Identifier for the client's current session.
    - `chat_message` (string): The content of the chat message.

#### UDP:

- **GameStateRequest**
  - Description: Represents a clien's request to get current state of a match.
  - Fields:
    - `match_id` (Uint8[16]): Identifier for the client's current match.

- **ActionRequest**
  - Description: Represents a client's request to control its character in the game.
  - Fields:
    - `session_id` (Uint8[16]): Identifier for the client's current session.
    - `match_id` (Uint8[16]): Identifier for the client's current match.
    - `target_x` (int32): The x-coordinate of the target location.
    - `target_y` (int32): The y-coordinate of the target location.

### ServerResponse:

#### TCP:

- **LoginResponse**
  - Description: Represents the server's response to a client's login request.
  - Fields:
    - `success` (bool): Indicates whether the login was successful.
    - `session_id` (Uint8[16]) [optional]: Identifier for the client's current session.
    
- **FindMatchResponse**
  - Description: Represents the server's response to a client's find match request.
  - Fields:
    - `success` (bool): Indicates wether the server found a match.

#### UDP:

- **ActionResponse**
  - Description: Represents the server's response to a client's action request.
  - Fields:
    - `success` (bool): Indicates whether the character control request was successful.
    
- **GameStateResponse**
  - Description: Represents an response from the server containing the current state of the game.
  - Fields:
    - `players` (repeated Player): List of players in the game.
    - `coins` (repeated Coin): List of coins in the game.

  - Nested Messages:

    - **Player**
      - Description: Represents a player's information within the game.
      - Fields:
        - `username` (string): The username of the player.
        - `position_x` (int32): The x-coordinate of the player's position.
        - `position_y` (int32): The y-coordinate of the player's position.

    - **Coin**
      - Description: Represents a coin within the game.
      - Fields:
        - `position_x` (int32): The x-coordinate of the coin's position.
        - `position_y` (int32): The y-coordinate of the coin's position.

### ServerAlert:

#### TCP:

- **ShareChatMessage**
  - Description: Represents a notification from the server containing a chat message to be shared with a client.
  - Fields:
    - `username` (string): The username of the sender.
    - `chat_message` (string): The content of the chat message.
    
- **EndMatch**
  - Description: Represents a notification informing the client that the match is over and the `match_id` is no longer valid.
  - Fields:
    - `outcome` (enum):
      | GameOutcome | int |
      | :---------: | :-: |
      | Lost        |  0  |
      | Won         |  1  |
      | Draw        |  2  |

## Message Flow:

### Login:
0. Client must have a socket to the TCP server.
1. Client sends `LoginRequest`.
2. Server responds with `LoginResponse`.

### Sending a Chat Message:
0. Client must be logged in and have a `session_id`.
1. Client sends `ChatMessageRequest`.
2. Server broadcasts `ShareChatMessage` to all clients.

### Finding a Match and Getting it's Game-state:
0. Client must be logged in and have a `session_id`.
1. Client sends a `FindMatchRequest`.
2. Server responds with `MatchResponse`.
    1. If the response has `success` set to false, the client is expected to wait for 1 second before resending another `FindMatchRequest`.
    2. If the response has `success` set to true, the client can now store the `match_id`.
3. The Client can now send a `GameStateRequest` periodically with the `match_id` to the server.
4. When the match is over, the server sends a `EndMatch` notification to the client and the `match_id` becomes no longer valid for a `GameStateRequest`.

### Performing an In-game Action:
0. Client must be logged in, have a `session_id` and a `match_id`
1. Client sends `ActionRequest`
2. Server responds with `ActionResponse`

## Server Ports:

| Transport Protocol| Port Number |
| :---------------: | :----------:|
| TCP               | 8080        |
| UDP               | 8081        |

## Security:
(**Upcoming!**) 
- All communication between the client and server should be encrypted using TLS for TCP messages and DTLS for UDP messages to ensure data privacy and integrity.

- Passwords will be stored and sent as `SHA-256`.
