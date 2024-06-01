#ifndef TEXT_FIELD_HPP
#define TEXT_FIELD_HPP

#include "../UI.hpp"
#include "Label.hpp"

namespace UI {
class TextField : public Base::UI {

public:
	TextField();
	virtual void render(Context::Render) override;
	virtual void loadResources(Context::Resource) override;
	virtual void handleEvent(Context::Event) override;

	void setLabelText(const std::string& text) {
		this->label.setText(text);
	}
	void setInputText(const std::string& text) {
		this->input_text.setString(text);
	}
	std::string getInputText() const {
		return input_text.getString();
	}

private:
	sf::RectangleShape background;
	sf::Text input_text;

	Label label;


protected:
	virtual void refreshDrawables() override;

};

}

#endif
