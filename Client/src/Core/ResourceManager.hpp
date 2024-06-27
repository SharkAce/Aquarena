#ifndef RESOURCEMANAGER_HPP
#define RESOURCEMANAGER_HPP

#include <SFML/Graphics.hpp>
#include <SFML/Audio.hpp>
#include <unordered_map>
#include <string>
#include <memory>
#include <stdexcept>

#include "Logger.hpp"

namespace Core {

class ResourceManager {
public:
	ResourceManager(Logger&);

	template<typename T>
	T& get(const std::string& filename);

	template<typename T>
	void free(const std::string& filename);

private:
	Logger& logger;
	std::unordered_map<std::string, std::unique_ptr<sf::Texture>> textures;
	std::unordered_map<std::string, std::unique_ptr<sf::SoundBuffer>> sound_buffers;
	std::unordered_map<std::string, std::unique_ptr<sf::Font>> fonts;

};


}

#endif
