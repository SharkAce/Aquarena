#include "Label.hpp"

namespace UI{

Label::Label() {
	sf_text = sf::Text();
	sf_text.setFillColor(sf::Color::White);
	setSize(30,30);
	refreshDrawables();
}

void Label::refreshDrawables() {
	auto bounds = getBounds();
	sf_text.setPosition(bounds.left, bounds.top);
}

void Label::loadResources(Context::Resource context) {
	sf_text.setFont(context.resource_manager.get<sf::Font>("res/Roboto-Regular.ttf"));
}

void Label::render(Context::Render context) {
	context.window.draw(sf_text);
}

}
