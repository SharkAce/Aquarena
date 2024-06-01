#ifndef APP_H
#define APP_H

#include <SFML/Graphics/Rect.hpp>
#include <SFML/Graphics/Sprite.hpp>
#include <SFML/System/Vector2.hpp>
#include <SFML/Audio.hpp>

#include <memory>
#include <functional>

#include "ResourceManager.hpp"
#include "RequestHandler.hpp"
#include "NetworkManager.hpp"
#include "../Logger/Logger.hpp"
#include "../Scene/include.hpp"

namespace Core {

class App {

public:
	App();
	virtual ~App() = default;
	void update();
	void render();
	void start();
	void stop();

	bool is_open = true;

private:
	sf::RenderWindow window;
	sf::Clock clock;
	Core::ResourceManager resource_manager;
	Core::RequestHandler request_handler;
	Core::NetworkManager network_manager;

	Log::Settings log_settings;
	Log::Loggers loggers;

	float delta_time;
	sf::Vector2i cursor_location;

	void setCurrentScene(const std::string& name);
	std::unique_ptr<Base::Scene> current_scene;
	void registerScene(const std::string& name, std::function<std::unique_ptr<Base::Scene>()> constructor);
	std::unordered_map<std::string, std::function<std::unique_ptr<Base::Scene>()>> scene_registry;

	void handleEvent(sf::Event& event);

};

}

#endif
