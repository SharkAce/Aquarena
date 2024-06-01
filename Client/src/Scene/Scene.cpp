#include "Scene.hpp"

namespace Base {

void Scene::update(Context::Update context) {
	for (auto ui_element : ui_elements) {
		ui_element->update(context);
	}
}
void Scene::render(Context::Render context) {
	for (auto ui_element : ui_elements) {
		ui_element->render(context);
	}
}

void Scene::loadResources(Context::Resource context) {
	for (auto ui_element : ui_elements) {
		ui_element->loadResources(context);
	}
}

void Scene::handleEvent(Context::Event context) {
	for (auto ui_element : ui_elements) {
		ui_element->handleEvent(context);
	}
}

}
