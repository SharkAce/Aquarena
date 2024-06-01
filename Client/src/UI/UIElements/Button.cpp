#include "Button.hpp"

namespace UI {

Button::Button() {
	
	sf_text = sf::Text();
	sf_text.setFillColor(sf::Color::Black);
	background = sf::RectangleShape();
	setSize(30,30);
	refreshDrawables();
}

void Button::refreshDrawables() {
	auto bounds = getBounds();
	background.setPosition(bounds.left, bounds.top);
	background.setSize(sf::Vector2f(bounds.width, bounds.height));
	sf_text.setPosition(sf::Vector2f(bounds.left + 10,bounds.top));
}

void Button::render(Context::Render context) {
	context.window.draw(background);	
	context.window.draw(sf_text);	
}

void Button::loadResources(Context::Resource context) {
	sf_text.setFont(context.resource_manager.get<sf::Font>("res/Roboto-Regular.ttf"));
}

void Button::handleEvent(Context::Event context) {
	Base::UI::handleEvent(context);

	if (context.event.type == sf::Event::MouseButtonPressed && getHovered()) {
		context.logger.log(Log::Type::info, "Button", "Got clicked.");
		on_click(context);	
	}
}

}
