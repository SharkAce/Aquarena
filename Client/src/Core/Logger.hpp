#ifndef LOGGER_HPP
#define LOGGER_HPP

#include <iostream>
#include <vector>
#include <unordered_map>
#include <source_location>

#include <SFML/Graphics.hpp>

namespace Core {


class Logger {


	public:
		Logger(const std::string& log_level_string) { setLevel(log_level_string); };
		enum LogLevel { DEBUG, INFO, WARNING, ERROR };

		void setLevel(const std::string& log_level_string);

		void drawLogs(sf::RenderWindow& window);


		void debug(const std::string& message, std::source_location source_info = std::source_location::current()) {
			log(Core::Logger::DEBUG, message, source_info.function_name());
		};
		void info(const std::string& message, std::source_location source_info = std::source_location::current()) {
			log(Core::Logger::INFO, message, source_info.function_name());
		};
		void warning(const std::string& message, std::source_location source_info = std::source_location::current()) {
			log(Core::Logger::WARNING, message, source_info.function_name());
		};
		void error(const std::string& message, std::source_location source_info = std::source_location::current()) {
			log(Core::Logger::ERROR, message, source_info.function_name());
		};

	private:
		LogLevel log_level = LogLevel::INFO;
		std::vector<std::string> log_entries;

		std::string levelToString(LogLevel level);
		void log(const LogLevel level, const std::string& message, const std::string& caller_info);
};

}

#endif
