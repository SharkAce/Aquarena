import { TcpServer } from './TcpServer';
import { UdpServer } from './UdpServer';

const tcpPort: number = 8080;
const udpPort: number = 8081;

const udpServer: UdpServer = new UdpServer(udpPort);
udpServer.start();

const tcpServer: TcpServer = new TcpServer(tcpPort, udpServer);
tcpServer.start();

setInterval(() => {
	udpServer.update();
	tcpServer.update();
}, 10);
