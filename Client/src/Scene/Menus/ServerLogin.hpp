#ifndef SERVER_LOGIN_HPP
#define SERVER_LOGIN_HPP

#include "../Scene.hpp"

namespace Scene {

class ServerLogin : public Base::Scene {
public:
	ServerLogin();
	virtual void loadResources(Context::Resource) override;
	virtual void update(Context::Update) override;
	virtual void render(Context::Render) override;
	virtual void handleEvent(Context::Event) override;

private:
	void connect(Context::Event);

	bool match_request_sent = false;

	UI::TextField server_address_field;
	UI::TextField username_field;
	UI::Button submit_button;

};

}

#endif
