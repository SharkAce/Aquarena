#ifndef SCENE_HPP
#define SCENE_HPP

#include <SFML/Graphics.hpp>

#include <vector>
#include <unordered_map>
#include <string>

#include "../UI/include.hpp"
#include "../context.hpp"

namespace Base {

class Scene {
public:
	virtual ~Scene() = default;
	virtual void update(Context::Update);
	virtual void render(Context::Render);
	virtual void loadResources(Context::Resource);
	virtual void handleEvent(Context::Event);

protected:
	std::vector<Base::UI*> ui_elements;

	void addUIElement(Base::UI& ui_element) {
		ui_elements.push_back(&ui_element);
	}

};

}

#endif
