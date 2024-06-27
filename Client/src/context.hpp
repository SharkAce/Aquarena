#ifndef CONTEXT_HPP
#define CONTEXT_HPP

#include "Core/NetworkManager.hpp"
#include "Core/ResourceManager.hpp"
#include "Core/RequestHandler.hpp"
#include "Core/Logger.hpp"
#include <SFML/Graphics.hpp>

namespace Context {

struct Update {
	Core::RequestHandler& request_handler;
	Core::NetworkManager& network_manager;
	float delta_time;
	sf::Vector2i cursor_location;
	Core::Logger& logger;
};

struct Render {
	sf::RenderWindow& window;
	Core::ResourceManager& resource_manager;
	Core::Logger& logger;
};

struct Resource {
	Core::ResourceManager& resource_manager;
	Core::Logger& logger;
};

struct Event {
	Core::RequestHandler& request_handler;
	Core::NetworkManager& network_manager;
	sf::Event& event;
	sf::Vector2i cursor_location;
	Core::Logger& logger;
};

}
#endif
