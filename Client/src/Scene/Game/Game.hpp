#ifndef Game_HPP
#define Game_HPP

#include "../Scene.hpp"

typedef	ServerResponse::UDP::GameStateResponse GameState;

namespace Scene {

class Game : public Base::Scene {
public:
	Game();
	virtual void loadResources(Context::Resource) override;
	virtual void update(Context::Update) override;
	virtual void render(Context::Render) override;
	virtual void handleEvent(Context::Event) override;

private:
	void drawGrid(Context::Render);
	std::string username = "";

	GameState game_state;
	sf::Clock game_state_clock;

	bool target_location_is_init = false;
	sf::Vector2i target_location;
	
};

}

#endif
