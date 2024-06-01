#include "Game.hpp"

namespace Scene {

Game::Game() {
	game_state_clock.restart();
}

void Game::update(Context::Update context){
	Base::Scene::update(context);

	// This should be set in the constructor
	if (username == ""){
		username = context.network_manager.getUsername();
	}

	if (game_state_clock.getElapsedTime().asMilliseconds() > 10){
		context.network_manager.sendGameStateRequest(game_state);
		game_state_clock.restart();
	}
}

void Game::render(Context::Render context){
	Base::Scene::render(context);

	context.window.clear(sf::Color(50,50,50));
	drawGrid(context);

	if (game_state.players_size() == 0){
		context.logger.log(Log::Type::warning, "Game", "No players in the game state.");
	}

	for (int i = 0; i < game_state.players_size(); i++){
		GameState::Player player = game_state.players(i);
		bool client_player = (player.username() == username);
		float player_size = 20.f;

		if (client_player && target_location_is_init){
			sf::Vertex line[] = {
				sf::Vertex(sf::Vector2f(player.position_x(), player.position_y()), sf::Color::White),
				sf::Vertex(sf::Vector2f(target_location), sf::Color::White)
			};
			context.window.draw(line, 2, sf::Lines);
		}

		sf::CircleShape player_shape;
		player_shape.setFillColor(client_player ? sf::Color::Green : sf::Color::Red);
		player_shape.setRadius(player_size);
		player_shape.setOrigin(player_size, player_size);
		player_shape.setPosition(player.position_x(), player.position_y());
		context.window.draw(player_shape);

		sf::Text username_text;
		username_text.setFont(context.resource_manager.get<sf::Font>("res/Roboto-Regular.ttf"));
		username_text.setFillColor(sf::Color::Yellow);
		username_text.setString(player.username());
		username_text.setOrigin(username_text.getLocalBounds().width/2, username_text.getLocalBounds().top);
		username_text.setPosition(player.position_x(), player.position_y() - player_size*2.5);
		context.window.draw(username_text);
	}
}

void Game::loadResources(Context::Resource context){
	Base::Scene::loadResources(context);
}

void Game::handleEvent(Context::Event context){
	Base::Scene::handleEvent(context);

	if (context.event.type == sf::Event::MouseButtonPressed) {
		ClientRequest::UDP::ActionRequest request;
		request.set_target_x(context.cursor_location.x);
		request.set_target_y(context.cursor_location.y);
		ServerResponse::UDP::ActionResponse response;
		context.network_manager.sendActionRequest(request, response);

		target_location = context.cursor_location;
		target_location_is_init = true;
	}
}

void Game::drawGrid(Context::Render context){
	sf::Color line_color = sf::Color(100,100,100);
	float cell_size = 40.f;
	int cols = context.window.getSize().x / cell_size;
	int rows = context.window.getSize().y / cell_size;

	for (int i = 1; i < cols; ++i) {
		sf::Vertex line[] = {
			sf::Vertex(sf::Vector2f(i * cell_size, 0), line_color),
			sf::Vertex(sf::Vector2f(i * cell_size, context.window.getSize().y), line_color)
		};
		context.window.draw(line, 2, sf::Lines);
	}

	for (int i = 1; i < rows; ++i) {
			sf::Vertex line[] = {
			sf::Vertex(sf::Vector2f(0, i * cell_size), line_color),
			sf::Vertex(sf::Vector2f(context.window.getSize().x, i * cell_size), line_color)
		};
		context.window.draw(line, 2, sf::Lines);
	}
}

}
