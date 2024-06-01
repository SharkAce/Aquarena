#ifndef BUTTON_HPP
#define BUTTON_HPP

#include "../UI.hpp"

namespace UI {
class Button : public Base::UI {

public:
	Button();
	virtual void render(Context::Render) override;
	virtual void loadResources(Context::Resource) override;
	virtual void handleEvent(Context::Event) override;

	void setTextString(const std::string& text) {
		sf_text.setString(text);	
	}

	void setOnClick(const std::function<void(Context::Event)>& callback) {
		on_click = callback;
	}

private:
	std::function<void(Context::Event)> on_click;
	sf::RectangleShape background;
	sf::Text sf_text;

protected:
	virtual void refreshDrawables() override;

};

}
#endif
