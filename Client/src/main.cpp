#include "Core/App.hpp"


int main(int argc, char *argv[]) {
	Core::App app(argc > 1 ? argv[1] : "INFO");
	app.start();

	while(app.is_open) {
		app.update();
		app.render();
	}
}
