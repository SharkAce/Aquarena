"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TcpServer_1 = require("./TcpServer");
const UdpServer_1 = require("./UdpServer");
const tcpPort = 8080;
const udpPort = 8081;
const udpServer = new UdpServer_1.UdpServer(udpPort);
udpServer.start();
const tcpServer = new TcpServer_1.TcpServer(tcpPort, udpServer);
tcpServer.start();
setInterval(() => {
    udpServer.update();
    tcpServer.update();
}, 10);
