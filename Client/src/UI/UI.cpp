#include "UI.hpp"

namespace Base {

void UI::handleEvent(Context::Event context) {
	if (context.event.type != sf::Event::MouseButtonPressed) return;

	bool cursor_on_ui = bounds.contains((sf::Vector2f)context.cursor_location);

	is_focused = cursor_on_ui;
}

void UI::update(Context::Update context) {
	bool cursor_on_ui = bounds.contains((sf::Vector2f)context.cursor_location);

	is_hovered = cursor_on_ui;
}

}
