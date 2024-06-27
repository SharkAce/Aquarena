#include "App.hpp"
#include "../context.hpp"

namespace Core {

App::App(const std::string& log_level) 
	: window(sf::VideoMode::getDesktopMode(), "Aquarena", sf::Style::Fullscreen),

	logger(log_level),
	network_manager(this->logger),
	resource_manager(this->logger),
	request_handler(this->logger){

	registerScene("ServerLogin", []() {return std::make_unique<Scene::ServerLogin>();});
	registerScene("Game", []() {return std::make_unique<Scene::Game>();});
}

App::~App() {
	network_manager.disconnectFromServer();
}

void App::update() {
	delta_time = clock.restart().asSeconds();
	cursor_location = sf::Mouse::getPosition(window);

	Context::Update context {
		.request_handler = request_handler,
		.network_manager = network_manager,
		.delta_time = delta_time,
		.cursor_location = cursor_location,
		.logger = logger
	};

	if (current_scene) {
		current_scene->update(context);
	}

	sf::Event event;
	while (window.pollEvent(event)) {
		handleEvent(event);
	}

	RequestHandler::Request request;
	while (request_handler.processRequest(request)){
		switch (request.type) {
			case RequestHandler::RequestType::ChangeScene:
				if (auto scene_data = std::get_if<RequestHandler::ChangeSceneData>(&request.data)) {
        	setCurrentScene(scene_data->scene_name);
        }
				break;
			default:
				break;
		}
	}

	network_manager.update();
}

void App::render() {
	window.clear(sf::Color(100,100,100));

	Context::Render context {
		.window = window,
		.resource_manager = resource_manager,
		.logger = logger
	};

	if (current_scene) {
		current_scene->render(context);
	}

	window.display();
}

void App::start() {
	setCurrentScene("ServerLogin");
}

void App::handleEvent(sf::Event& event) {

	Context::Event context {
		.request_handler = request_handler,
		.network_manager = network_manager,
		.event = event,
		.cursor_location = cursor_location,
		.logger = logger
	};

	switch (event.type) {
		case sf::Event::Closed:
			is_open = false;
			window.close();
			break;

		default:
			if (current_scene) {
				current_scene->handleEvent(context);
			}
			break;
	}
}

void App::registerScene(const std::string& name, std::function<std::unique_ptr<Base::Scene>()> constructor) {
	scene_registry.insert({name, constructor});
}

void App::setCurrentScene(const std::string& name) {
	auto it = scene_registry.find(name);
	current_scene = it->second();
	Context::Resource context {
		.resource_manager = resource_manager,
		.logger = logger
	};
	current_scene->loadResources(context);
}

}
