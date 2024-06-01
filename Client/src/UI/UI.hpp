#ifndef UI_HPP
#define UI_HPP

#include <SFML/Graphics.hpp>

#include "../context.hpp"

namespace Base {

class UI {

public:
	virtual ~UI() = default;
	virtual void update(Context::Update);
	virtual void render(Context::Render) {};
	virtual void handleEvent(Context::Event);
	virtual void loadResources(Context::Resource) {};

	bool getHovered() const {
		return is_hovered;
	}

	bool getFocused() const {
		return is_focused;
	}
	
	void setSize(float x, float y) {
		bounds.width = x;
		bounds.height = y;
		refreshDrawables();
	}

	void setPosition(float x, float y) {
		bounds.left = x;
		bounds.top = y;
		refreshDrawables();
	}

	sf::Rect<float> getBounds() const {
		return bounds;
	}

protected:
	virtual void refreshDrawables() {};

private:
	sf::Rect<float> bounds = sf::Rect<float>(0.f,0.f,0.f,0.f);
	bool is_focused = false;
	bool is_hovered = false;
	
};

}

#endif
