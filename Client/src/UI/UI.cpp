#include "UI.hpp"

namespace Base {

void UI::handleEvent(Context::Event context) {
	if (context.event.type != sf::Event::MouseButtonPressed) return;

	bool cursor_on_ui = bounds.contains((sf::Vector2f)context.cursor_location);

	if (is_focused){
		if (!cursor_on_ui) {
			is_focused = false;
		}
	} else {
		if (cursor_on_ui) {
			is_focused = true;
		}
	}
}

void UI::update(Context::Update context) {
	bool cursor_on_ui = bounds.contains((sf::Vector2f)context.cursor_location);

	if (is_hovered){
		if (!cursor_on_ui) {
			is_hovered = false;
		}
	} else {
		if (cursor_on_ui) {
			is_hovered = true;
		}
	}
}

}
