#ifndef REQUEST_HANDLER_HPP
#define REQUEST_HANDLER_HPP

#include <queue>
#include <functional>
#include <string>
#include <variant>

#include "Logger.hpp"

namespace Core {


class RequestHandler {

friend class App;

public:
	RequestHandler(Logger&);

	void requestSceneChange(const std::string& scene_name);

protected:
	enum class RequestType {
		ChangeScene,
	};

	struct ChangeSceneData {
		std::string scene_name;
	};

	using RequestData = std::variant<std::monostate, ChangeSceneData>;

	struct Request {
		RequestType type;
		RequestData data;
	};

	bool processRequest(Request&);

private:
	Logger& logger;

	std::queue<Request> requests;

};

}

#endif
