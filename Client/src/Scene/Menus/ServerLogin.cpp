#include "ServerLogin.hpp"
#include <iostream>

namespace Scene {

ServerLogin::ServerLogin() {
	username_field.setPosition(810, 300);
	username_field.setLabelText("Username:");
	addUIElement(username_field);

	server_address_field.setPosition(810, 400);
	server_address_field.setLabelText("Server IP:");
	server_address_field.setInputText("127.0.0.1");
	addUIElement(server_address_field);
	
	submit_button.setPosition(910, 475);
	submit_button.setSize(100,45);
	submit_button.setTextString("Log in");
	submit_button.setOnClick([this](Context::Event c) {this->connect(c); });
	addUIElement(submit_button);
}

void ServerLogin::update(Context::Update context) {
	Base::Scene::update(context);

	if (context.network_manager.isSessionActive() && !match_request_sent) {
		match_request_sent = true;
		context.logger.info("Sending a find_match request.");
		context.network_manager.sendFindMatchRequest();
	}

	if (context.network_manager.isMatchActive()) {
		context.request_handler.requestSceneChange("Game");
	}
}

void ServerLogin::render(Context::Render context) {
	Base::Scene::render(context);
}

void ServerLogin::loadResources(Context::Resource context) {
	Base::Scene::loadResources(context);
}

void ServerLogin::handleEvent(Context::Event context) {
	Base::Scene::handleEvent(context);
}

void ServerLogin::connect(Context::Event context) {
	sf::IpAddress server_address = sf::IpAddress(server_address_field.getInputText());
	context.network_manager.connectToTcpServer(server_address);

	std::string username = username_field.getInputText();
	context.logger.info("Sending a login request.");
	context.network_manager.sendLoginRequest(username);
}

}
