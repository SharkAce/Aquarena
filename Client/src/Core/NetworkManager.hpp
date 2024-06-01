#ifndef NETWORK_MANAGER_HPP
#define NETWORK_MANAGER_HPP

#include <SFML/Network.hpp>
#include <string>
#include <queue>
#include <optional>

#include "../Logger/Logger.hpp"

#include "../../proto/ClientRequest-TCP.pb.h"
#include "../../proto/ClientRequest-UDP.pb.h"
#include "../../proto/ServerResponse-TCP.pb.h"
#include "../../proto/ServerResponse-UDP.pb.h"
#include "../../proto/ServerAlert-TCP.pb.h"
#include "../../proto/Wrapper-TCP.pb.h"
#include "../../proto/Wrapper-UDP.pb.h"

typedef Wrapper::TCP::TcpWrapper TcpWrapper;
typedef Wrapper::UDP::UdpWrapper UdpWrapper;

constexpr unsigned short SERVER_TCP_PORT = 8080;
constexpr unsigned short SERVER_UDP_PORT = 8081;

namespace Core {

class NetworkManager {
public:
	NetworkManager(Logger::NetworkManager&);
	~NetworkManager();

	void update();

	bool connectToTcpServer(const sf::IpAddress& server_address);
	void disconnectFromServer();

	bool sendLoginRequest(const std::string& username);
	bool sendFindMatchRequest();
	bool sendGameStateRequest(ServerResponse::UDP::GameStateResponse&);
	bool sendActionRequest(ClientRequest::UDP::ActionRequest, ServerResponse::UDP::ActionResponse&);

	bool isSessionActive() const {
		return session_active;
	}

	bool isMatchActive() const {
		return match_active;
	}

	std::string getUsername() const {
		return username;
	}

private:
	Logger::NetworkManager& logger;

	sf::TcpSocket tcp_socket;
	sf::UdpSocket udp_socket;
	sf::IpAddress server_address = sf::IpAddress::None;

	std::string username = "";
	std::string session_id = "";
	std::string match_id = "";
	bool session_active = false;
	bool match_active = false;

	void handleIncomingTcpData();

	bool sendTcpMessage(const std::string& message, TcpWrapper::MessageType);
	bool sendUdpMessage(const std::string& message, UdpWrapper::MessageType, UdpWrapper& response);

	void recieveLoginResponse(const ServerResponse::TCP::LoginResponse&);
	void recieveFindMatchResponse(const ServerResponse::TCP::FindMatchResponse&);
	void receiveChatMessage(const ServerAlert::TCP::ShareChatMessage&);

};

}
#endif
