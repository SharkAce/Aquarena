#include "./ResourceManager.hpp"

namespace Core {

ResourceManager::ResourceManager(Logger::ResourceManager& logger)
	: logger(logger) {
	return;
}

template<>
sf::Texture& ResourceManager::get<sf::Texture>(const std::string& filename) {
	if (textures.find(filename) == textures.end()){
		logger.log(Log::Type::warning, "Texture key " + filename + " not found, loading from file...");
		textures.insert({filename, std::make_unique<sf::Texture>()});
		textures[filename]->loadFromFile(filename);
	}
	return *(textures.find(filename)->second);
}

template<>
sf::SoundBuffer& ResourceManager::get<sf::SoundBuffer>(const std::string& filename) {
	if (sound_buffers.find(filename) == sound_buffers.end()){
		logger.log(Log::Type::warning, "Sound buffer key " + filename + " not found, loading from file...");
		sound_buffers.insert({filename, std::make_unique<sf::SoundBuffer>()});
		sound_buffers[filename]->loadFromFile(filename);
	}
	return *(sound_buffers.find(filename)->second);
}

template<>
sf::Font& ResourceManager::get<sf::Font>(const std::string& filename) {
	if (fonts.find(filename) == fonts.end()){
		logger.log(Log::Type::warning, "Font key " + filename + " not found, loading from file...");
		fonts.insert({filename, std::make_unique<sf::Font>()});
		fonts[filename]->loadFromFile(filename);
	}
	return *(fonts.find(filename)->second);
}

template<>
void ResourceManager::free<sf::Texture>(const std::string& filename) {
	logger.log(Log::Type::info, "Freeing Texture " + filename + ".");
	textures.erase(filename);
}

template<>
void ResourceManager::free<sf::SoundBuffer>(const std::string& filename) {
	logger.log(Log::Type::info, "Freeing SoundBuffer " + filename + ".");
	sound_buffers.erase(filename);
}

template<>
void ResourceManager::free<sf::Font>(const std::string& filename) {
	logger.log(Log::Type::info, "Freeing Font " + filename + ".");
	fonts.erase(filename);
}

}
