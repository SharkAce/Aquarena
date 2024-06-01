#ifndef CONTEXT_HPP
#define CONTEXT_HPP

#include "Core/NetworkManager.hpp"
#include "Core/ResourceManager.hpp"
#include "Core/RequestHandler.hpp"
#include "Logger/Logger.hpp"
#include <SFML/Graphics.hpp>

namespace Context {

struct Update {
	Core::RequestHandler& request_handler;
	Core::NetworkManager& network_manager;
	float delta_time;
	sf::Vector2i cursor_location;
	Logger::Update logger;
};

struct Render {
	sf::RenderWindow& window;
	Core::ResourceManager& resource_manager;
	Logger::Render logger;
};

struct Resource {
	Core::ResourceManager& resource_manager;
	Logger::Resource logger;
};

struct Event {
	Core::RequestHandler& request_handler;
	Core::NetworkManager& network_manager;
	sf::Event& event;
	sf::Vector2i cursor_location;
	Logger::Event logger;
};

}
#endif
