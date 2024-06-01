#ifndef LABEL_HPP
#define LABEL_HPP

#include "../UI.hpp"

namespace UI {
class Label : public Base::UI{

public:
	Label();
	
	void setText(const std::string& text) {
		sf_text.setString(text);
	}

	void setTextColor(const sf::Color& color) {
		sf_text.setFillColor(color);
	}

	std::string getText() const {
		return sf_text.getString();
	}

	virtual void render(Context::Render) override;
	virtual void loadResources(Context::Resource) override;

private:
	sf::Text sf_text; 

protected:
	virtual void refreshDrawables() override;

};

}

#endif
