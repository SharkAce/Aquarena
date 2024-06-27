#include "TextField.hpp"

namespace UI {

TextField::TextField() {

	input_text = sf::Text();
	input_text.setFillColor(sf::Color::Black);
	background = sf::RectangleShape();
	setSize(300,35);
	refreshDrawables();
}

void TextField::refreshDrawables() {
	const auto bounds = getBounds();
	input_text.setPosition(bounds.left, bounds.top);
	background.setPosition(bounds.left, bounds.top);
	background.setSize(sf::Vector2f(bounds.width, bounds.height));
	label.setPosition(bounds.left, bounds.top - 50);
}

void TextField::render(Context::Render context) {
	context.window.draw(background);
	context.window.draw(input_text);
	label.render(context);
}

void TextField::loadResources(Context::Resource context) {
	input_text.setFont(context.resource_manager.get<sf::Font>("res/Roboto-Regular.ttf"));
	label.loadResources(context);
}

void TextField::handleEvent(Context::Event context) {
	Base::UI::handleEvent(context);

	if (context.event.type == sf::Event::TextEntered && getFocused()){
		std::string new_text = getInputText();
		context.logger.debug(std::to_string(context.event.text.unicode));

		// 8 = Backspace; 13 = Enter; 27 = Delete; 127 = Escape;
		unsigned int unicode = context.event.text.unicode;

		if (unicode == 8){
			if (!new_text.empty()) new_text.pop_back();
		} else if (unicode != 13 && unicode != 27 && unicode != 127){
			new_text.push_back((char)context.event.text.unicode);
		}
		setInputText(new_text);
	}
}

}
