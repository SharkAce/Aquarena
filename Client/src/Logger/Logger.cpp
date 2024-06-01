#include "Logger.hpp"
#include <iostream>

namespace Log {

Loggers::Loggers(sf::Window& window, Settings& settings)
	: network_manager(window, settings),
	resource_manager(window, settings),
	request_handler(window, settings),
	update(window, settings),
	render(window, settings),
	resource(window, settings),
	event(window, settings) {}

}

namespace Base {

Logger::Logger(sf::Window& window, Log::Settings& settings)
    : window(window), settings(settings) {}

void Logger::log(Log::Type type, const std::string& origin, const std::string& message) {
if ((type == Log::Type::error && settings.ignore_errors) ||
	(type == Log::Type::warning && settings.ignore_warnings) ||
	(type == Log::Type::info && settings.ignore_info)) {
	return;
}

std::string typeString;
switch (type) {
	case Log::Type::error:
		typeString = "[ERROR]";
		break;
	case Log::Type::warning:
		typeString = "[WARNING]";
		break;
	case Log::Type::info:
		typeString = "[INFO]";
		break;
}

std::string fullMessage = typeString + " (" + origin + "): " + message;

if (settings.console_print) {
	std::cout << fullMessage << std::endl;
}

if (settings.window_print) {
		std::cout << "Window log not yet implemented." << std::endl;
	}
}

} // namespace Base

namespace Logger {

NetworkManager::NetworkManager(sf::Window& window, Log::Settings& settings)
	: Base::Logger(window, settings) {}

void NetworkManager::log(Log::Type type, const std::string& message) {
	Base::Logger::log(type, "NetworkManager", message);
}

ResourceManager::ResourceManager(sf::Window& window, Log::Settings& settings)
	: Base::Logger(window, settings) {}

void ResourceManager::log(Log::Type type, const std::string& message) {
	Base::Logger::log(type, "ResourceManager", message);
}

RequestHandler::RequestHandler(sf::Window& window, Log::Settings& settings)
	: Base::Logger(window, settings) {}

void RequestHandler::log(Log::Type type, const std::string& message) {
	Base::Logger::log(type, "RequestHandler", message);
}

Update::Update(sf::Window& window, Log::Settings& settings)
	: Base::Logger(window, settings) {}

void Update::log(Log::Type type, const std::string& origin, const std::string& message) {
	Base::Logger::log(type, "Update->" + origin, message);
}

Render::Render(sf::Window& window, Log::Settings& settings)
	: Base::Logger(window, settings) {}

void Render::log(Log::Type type, const std::string& origin, const std::string& message) {
	Base::Logger::log(type, "Render->" + origin, message);
}

Resource::Resource(sf::Window& window, Log::Settings& settings)
	: Base::Logger(window, settings) {}

void Resource::log(Log::Type type, const std::string& origin, const std::string& message) {
	Base::Logger::log(type, "Resource->" + origin, message);
}

Event::Event(sf::Window& window, Log::Settings& settings)
	: Base::Logger(window, settings) {}

void Event::log(Log::Type type, const std::string& origin, const std::string& message) {
	Base::Logger::log(type, "Event->" + origin, message);
}

} // namespace Logger
