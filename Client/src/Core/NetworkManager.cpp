#include "NetworkManager.hpp"
#include <iostream>

namespace Core {

NetworkManager::NetworkManager(Logger::NetworkManager& logger)
	: logger(logger) {
	udp_socket.bind(sf::Socket::AnyPort);
	tcp_socket.setBlocking(false);
}

NetworkManager::~NetworkManager() {
	disconnectFromServer();
}

bool NetworkManager::connectToTcpServer(const sf::IpAddress& server_address) {

	if (tcp_socket.connect(server_address, SERVER_TCP_PORT) == sf::Socket::Done) {
		this->server_address = server_address;
		return true;
	}

	return false;
}

void NetworkManager::disconnectFromServer() {
	logger.log(Log::Type::info, "Disconnecting from server.");
	this->server_address = sf::IpAddress::None;
	session_active = false;
	match_active = false;

	tcp_socket.disconnect();
}

void NetworkManager::update() {
	handleIncomingTcpData();
}

void NetworkManager::handleIncomingTcpData() {
	char data[1024];
	std::size_t received_size;
	TcpWrapper wrapper;

	if (tcp_socket.receive(data, sizeof(data), received_size) == sf::Socket::Done) {
		wrapper.ParseFromArray(data, received_size);
		logger.log(Log::Type::info, "TCP packet recieved.");
	} else return;

	switch (wrapper.payload_type()) {
		case TcpWrapper::LoginResponse: {
			ServerResponse::TCP::LoginResponse response;
			if (response.ParseFromString(wrapper.payload())) {
				logger.log(Log::Type::info, "LoginResponse parsed successfully.");
				recieveLoginResponse(response);
			} else {
				logger.log(Log::Type::error, "Failed to parse LoginRequest.");
			}
			break;
		}
		case TcpWrapper::FindMatchResponse: {
			ServerResponse::TCP::FindMatchResponse response;
			if (response.ParseFromString(wrapper.payload())) {
				logger.log(Log::Type::info, "FindMatchResponse parsed successfully.");
				recieveFindMatchResponse(response);
			} else {
				logger.log(Log::Type::error, "Failed to parse FindMatchResponse.");
			}
			break;
		}
		case TcpWrapper::ShareChatMessage: {
			ServerAlert::TCP::ShareChatMessage ChatMessage;
			if (ChatMessage.ParseFromString(wrapper.payload())) {
				logger.log(Log::Type::info, "ShareChatMessage parsed successfully.");
				receiveChatMessage(ChatMessage);
			} else {
				logger.log(Log::Type::error, "Failed to parse ShareChatMessage");
			}
			break;
		}
		default:
			break;
	}
}

void NetworkManager::recieveLoginResponse(const ServerResponse::TCP::LoginResponse& message) {
	std::string log_message = std::string("LoginRequest was ") + (message.success() ? "accepted." : "rejected.");
	logger.log(message.success() ? Log::Type::info : Log::Type::warning, log_message);

	if (message.success()){
		session_active = true;
		session_id = message.session_id();
	}
}

void NetworkManager::recieveFindMatchResponse(const ServerResponse::TCP::FindMatchResponse& message) {
	std::string log_message = std::string("FindMatchRequest was ") + (message.success() ? "successful." : "unsuccessful.");
	logger.log(message.success() ? Log::Type::info : Log::Type::warning, log_message);

	if (message.success()){
		match_active = true;
		match_id = message.match_id();
	}
}

void NetworkManager::receiveChatMessage(const ServerAlert::TCP::ShareChatMessage& message) {
	// Chat functionality not yet implemented
	return;
}

bool NetworkManager::sendTcpMessage(const std::string& message, TcpWrapper::MessageType type) {
	// Create and populate the wrapper
	TcpWrapper wrapper;
	wrapper.set_payload_type(type);
	wrapper.set_payload(message);

	// Determine the size of the serialized data
	int size = wrapper.ByteSizeLong();
	// Allocate an array to hold the serialized data
	std::vector<char> serialized_wrapper(size);
	// Serialize the wrapper into the array
	wrapper.SerializeToArray(serialized_wrapper.data(), size);

	if (tcp_socket.send(serialized_wrapper.data(), size) != sf::Socket::Done) {
		logger.log(Log::Type::error, "Failed to send TCP message.");
		return false;
	}

	logger.log(Log::Type::info, "TCP message sent.");

	return true;
}

bool NetworkManager::sendUdpMessage(const std::string& message, UdpWrapper::MessageType type, UdpWrapper& response) {
	// Create and populate the wrapper
	UdpWrapper request_wrapper;
	request_wrapper.set_payload_type(type);
	request_wrapper.set_payload(message);

	int size = request_wrapper.ByteSizeLong();
	std::vector<char> serialized_wrapper(size);
	request_wrapper.SerializeToArray(serialized_wrapper.data(), size);

	if (udp_socket.send(serialized_wrapper.data(), size, server_address, SERVER_UDP_PORT) != sf::Socket::Done) {
		logger.log(Log::Type::error, "Failed to send UDP message.");
		return false;
	}

	char data[1024];
	std::size_t received_size;
	unsigned short port = SERVER_UDP_PORT;

	// Blocking call! Should be on a Selector::wait to handle server disconnection without crashing.
	udp_socket.receive(data, sizeof(data), received_size, server_address, port);

	if (!response.ParseFromArray(data, received_size)) {
		logger.log(Log::Type::error, "Failed to parse UDP message.");
		return false;
	} 

	return true;
}

bool NetworkManager::sendLoginRequest(const std::string& username) {
	this->username = username;

	ClientRequest::TCP::LoginRequest request;
	request.set_username(username);

	return sendTcpMessage(request.SerializeAsString(), TcpWrapper::LoginRequest);
}

bool NetworkManager::sendFindMatchRequest() {
	ClientRequest::TCP::FindMatchRequest request;
	request.set_session_id(session_id);

	return sendTcpMessage(request.SerializeAsString(), TcpWrapper::FindMatchRequest);
};

bool NetworkManager::sendGameStateRequest(ServerResponse::UDP::GameStateResponse& response) {
	if (!isMatchActive() || !isSessionActive()){
		logger.log(Log::Type::warning, "Client does not have the required credientials.");
		return false;
	}
	ClientRequest::UDP::GameStateRequest request;
	request.set_match_id(match_id);

	UdpWrapper wrapped_response;
	if (!sendUdpMessage(request.SerializeAsString(), UdpWrapper::GameStateRequest, wrapped_response)) {
		return false;
	}

	if (!response.ParseFromString(wrapped_response.payload())) {
		logger.log(Log::Type::error, "Failed to parse the message response.");
		return false;
	}

	return true;
}

bool NetworkManager::sendActionRequest(ClientRequest::UDP::ActionRequest request, ServerResponse::UDP::ActionResponse& response) {
	if (!isMatchActive() || !isSessionActive()){
		logger.log(Log::Type::warning, "Client does not have the required credientials.");
		return false;
	}
	request.set_match_id(match_id);
	request.set_session_id(session_id);

	UdpWrapper wrapped_response;
	if (!sendUdpMessage(request.SerializeAsString(), UdpWrapper::ActionRequest, wrapped_response)) {
		return false;
	}

	if (!response.ParseFromString(wrapped_response.payload())) {
		logger.log(Log::Type::error, "Failed to parse the message response.");
		return false;
	}

	return true;
}

}
