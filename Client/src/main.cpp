#include "Core/App.hpp"


int main(int argc, char *argv[]) {
	Core::App app;
	app.start();

	while(app.is_open) {
		app.update();
		app.render();
	}
}
