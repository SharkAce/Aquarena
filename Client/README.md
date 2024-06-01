# Game Client Specifications

## Preface
The client is made using the C++ language in an OOP style wih the multimedia library SFML [(see here)](https://sfml-dev.org).

## <a id="Namespaces"></a> Namespaces
| Name        | Role                                                |
| :---------: | --------------------------------------------------- |
| `sf::`      | Contains all the SFML library.                      |
| `Core::`    | Contains the App class and all the managers.        |
| `Base::`    | Contains all the Base classes to be inhereted from. |
| `UI::`      | Contains all the child classes of Base::UI.         |
| `Scene::`   | Contains all the child classes of Base::Scene.      |
| `Context::` | Contains all the context structures.                |

## <a id="Context-Structures"> Context Structures
Data needed globally is initialized in the Core::App class and flows through the application using the structs within the Context namespace. They are as follow:

- **Context::Update**
    - Description: Contains all the required data for update methods.
    - Fields:
        - `request_handler` (Core::RequestHandler&): A referance to the Request Handler.
        - `network_manager` (Core::NetworkManager&): A referance to the Network Manager.
        - `delta_time` (float): Time elapsed since the last `Core::App::Update`.
        - `cursor_location` (sf::Vector2i): The location of the cursor on the screen.

- **Context::Render**
    - Description: Contais all the required data for the render methods.
    - Fields:
        - `window` (sf::RenderWindow&): A referance to the sfml window object.
        - `resource_manager` (Core::ResourceManager&): A referance to the Resource Manager.

- **Context::Resource**
    - Description: Contains all the required data for the loadResources methods.
    - Fields:
        - `resource_manager` (Core::ResourceManager&): A referance to the Resource Manager.

- **Context::Event**
    - Description: Contains all the required dara for the handleEvent methods.
    - Fields:
        - `request_handler` (Core::RequestHandler&): A referance to the Request Handler.
        - `network_manager` (Core::NetworkManager&): A referance to the Network Manager.
        - `event` (sf::Event&): A referance to the event to handle. 
        - `cursor_location` (sf::Vector2i): The location of the cursor on the screen.

## <a id="Inheriting-From-Base"> Inheriting from the Base:: namespace
Each member of the Base:: namespace has a template file in the `skel/` directory defining how it should be inherited. These template files can be generated into headers using the `generateClass` task.

### Syntax:
To generate a class header from a template file, use the the following syntax:

```bash
make generateClass hpp_sf=<hpp_template_file> cpp_sf=<cpp_template_file> out_dir=<output_location> name=<name>
```

### Example:

```bash
make generateClass hpp_sf=skel/Scene.hpp.skel cpp_sf=skel/Scene.cpp.skel out_dir=src/Scene/Game/ name=Game
