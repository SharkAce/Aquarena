#include "Logger.hpp"

namespace Core {

void Logger::log(const LogLevel level, const std::string &message, const std::string &caller_info) {
	if (level < this->log_level) return;

	std::string function_name = caller_info.substr(0, caller_info.find("("));
	function_name = function_name.substr(function_name.rfind(" ") + 1);

	std::string full_message = levelToString(level) + " (" + function_name + "): " + message;

	std::cout << full_message << std::endl;
	log_entries.push_back(full_message);
}

std::string Logger::levelToString(LogLevel level){
	switch (level) {
	case DEBUG:
			return "[DEBUG]";
	case INFO:
			return "[INFO]";
	case WARNING:
			return "[WARNING]";
	case ERROR:
			return "[ERROR]";
	default:
			return "[UNKNOWN]";
	}
}

void Logger::setLevel(const std::string& log_level_string){
	static std::unordered_map<std::string, LogLevel> log_level_map = {
		{"DEBUG", DEBUG},
		{"INFO", INFO},
		{"WARNING", WARNING},
		{"ERROR", ERROR},
	};

	if (log_level_map.find(log_level_string) != log_level_map.end()){
		this->log_level = log_level_map[log_level_string];
	}
}


}
