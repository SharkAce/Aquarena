#include "RequestHandler.hpp"

namespace Core {

RequestHandler::RequestHandler(Logger::RequestHandler& logger)
	: logger(logger) {
	return;
}

void RequestHandler::requestSceneChange(const std::string& scene_name) {
	logger.log(Log::Type::info, "Sent a ChangeScene request for scene: " + scene_name + ".");
	requests.push({RequestType::ChangeScene, ChangeSceneData({scene_name})});
}

bool RequestHandler::processRequest(Request& request_ref) {
	if (requests.empty()) return false;

	request_ref = requests.front();
	requests.pop();

	return true;
}

}
