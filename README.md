# Aquarena

## Preface
Aquarena is an open source multiplayer game in development using a C++ frontend with a custom TypeScript backend.

## Client
The game client is made using the C++ language in an OOP style wih the multimedia library SFML [(see here)](https://sfml-dev.org).

### Prerequisites
- C++ compiler (such as g++) installed
- Make
- sfml
- protobuf

### Compilation
```bash
cd Client
make
```
### Usage
```bash
make run
```
## Server
The game server is made using TypeScript in a NodsJS envirement, it handles communication by UDP and TCP sockets.

### Prerequisites
- NodsJS
- tsc

### Installation
```bash
cd Server
npm install
```
or
```bash
cd Server
npm install --include dev
```

### Usage
```bash
npm run start
```

### Compilation
```bash
npm run build-proto
npm run build-ts
```

## Networking
The communication between the client and the server is made using a combination of UDP and TCP with the data being serialized as Protocol Buffers [see here](https://protobuf.dev/). To learn more about the structure and implementation of the Protocol Buffers read the `Protocol/README.md` file.
