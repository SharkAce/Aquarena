#ifndef LOGGER_HPP
#define LOGGER_HPP

#include <SFML/Window.hpp>
#include <SFML/Graphics.hpp>


namespace Log {

struct Settings {
	bool console_print;
	bool window_print;
	bool ignore_errors;
	bool ignore_warnings;
	bool ignore_info;
};

const Settings default_settings = {true, false, false, false, false};

enum Type {
	error,
	warning,
	info
};

}

namespace Base {

class Logger {
public:
	Logger(sf::Window& window, Log::Settings& settings);

	Log::Settings& settings;

protected:
	void log(Log::Type, const std::string& prefix, const std::string& message);

private:
	sf::Window& window;
};

}

namespace Logger {

class NetworkManager: public Base::Logger {
public:
	NetworkManager(sf::Window& window, Log::Settings& settings);
	void log(Log::Type, const std::string& message);
};

class ResourceManager: public Base::Logger {
public:
	ResourceManager(sf::Window& window, Log::Settings& settings);
	void log(Log::Type, const std::string& message);
};

class RequestHandler: public Base::Logger {
public:
	RequestHandler(sf::Window& window, Log::Settings& settings);
	void log(Log::Type, const std::string& message);
};

class Update: public Base::Logger {
public:
	Update(sf::Window& window, Log::Settings& settings);
	void log(Log::Type, const std::string& origin, const std::string& message);
};

class Render: public Base::Logger {
public:
	Render(sf::Window& window, Log::Settings& settings);
	void log(Log::Type, const std::string& origin, const std::string& message);
};

class Resource: public Base::Logger {
public:
	Resource(sf::Window& window, Log::Settings& settings);
	void log(Log::Type, const std::string& origin, const std::string& message);
};

class Event: public Base::Logger {
public:
	Event(sf::Window& window, Log::Settings& settings);
	void log(Log::Type, const std::string& origin, const std::string& message);
};

}

namespace Log {

struct Loggers {
	Logger::NetworkManager network_manager;
	Logger::ResourceManager resource_manager;
	Logger::RequestHandler request_handler;
	Logger::Update update;
	Logger::Render render;
	Logger::Resource resource;
	Logger::Event event;

	Loggers(sf::Window& window, Settings& settings);
};

}

#endif
