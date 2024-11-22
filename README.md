# How to build and deploy the project

1. Push a version that successfully runs
2. In the terminal, put "npm run build"
3. Push the changes
4. Check github actions and pages

# Devlog Entry - 11/21/2024

## How we satisfied the software requirements

- [F0.a]
  - You control a character moving over a 2D grid. The player jumps between spaces in the grid, aligning themselves with the grid space they are on. The player knows how big the cells are in the grid, and thus can move themselves one cell's-width when a movement key is pressed. They are also prevented from moving off of the screen
- [F0.b]
  - You advance time manually in the turn-based simulation. Time moves forwards when the player moves. We accomplish this by having a function in the Game scene that advances time forwards one step. When the player moves, they call that function and "step" forwards in time.
- [F0.c]
  - You can reap or sow plants on grid cells only when you are near them. When the player is standing on a cell they are able to sow or reap. There is only one input for the player. When they press the button the game will check if the cell is empty which would then sow a random type of plant into the sell. Otherwise, it would check if the plant is at max level. If it is then it’ll allow the player to reap the plant. This increases a counter at the moment, counting how many plants have been reaped
- [F0.d]
  - Grid cells have sun and water levels. The incoming sun and water for each cell is somehow randomly generated each turn. Sun energy cannot be stored in a cell (it is used immediately or lost) while water moisture can be slowly accumulated over several turns. The grid manager randomly generates 0-5 water or 0-1 sun for each cell every timestep. When a cell receives water, it adds it to storage. Then, it checks if the plant needs any water and gives it 1 water if needed. The plant will only take 1 sun and 1 water per timestep. When the cell receives sun, it’ll check if the plant needs sun. If it doesn’t, then the sun disappears; otherwise, it gives it to the plant.
- [F0.e]
  - Each plant on the grid has a distinct type (e.g. one of 3 species) and a growth level (e.g. “level 1”, “level 2”, “level 3”). Each plant is randomly any one of the three species. These plants each have a different sprite set associated with them, shown through emojis. As the plant levels up, the sprite changes to match the plant's level. Each type of plant has it's own different quantity of sun and water to level up.
- [F0.f]
  - Simple spatial rules govern plant growth based on sun, water, and nearby plants (growth is unlocked by satisfying conditions).Each plant must reach its maximum amount of sun and water to level up. The plant absorbs water from the cell it is in 1 every time step, and the same is true for sun. When the plant reaches its max in both, it will grow the next time step. This change is visible through the emoji sprites placed in the cell. Spacially, the plants can only grow if there is more than 1 adjacent plant in the North, South, East or West directions. As such, plants must be planted nearby eachother to grow.
- [F0.g]
  - A play scenario is completed when some condition is satisfied (e.g. at least X plants at growth level Y or above). The win condition for ours is that the player must reap 10 plants before they complete the play scenario. After which, the player is taken to an end screen.

## Reflection

When we first met up to plan for this assignment, we had multiple different views as to how the player would move in the grid. Originally, the player would have free movement in all directions, though this ended up changing to the system we have now. We decided on this as it would simplify the process for setting up our planting system, and we could easily keep track of what cell the player was in.

The project was first made without the use of any code formatter, which we changed soon into the process by using Prettier. We also started using a build system through webpack that allows us to push changes to the project without changing the build that goes to Github Pages.

The majority of technical changes came in the Plant system, where we refactored how the Grid, Cells, and Plants all communicated. Our route we took was to avoid having things further down the tree (plants) communicate with things that were holding them (Cells).

# Devlog Entry - 11/14/2024

## Introducing the team

Garrett Blake as Tools Lead  
Sunny Han as Engine Lead  
Katrina VanArsdale as Design Lead  
Lia Cui as Assistant to Engine and Design

## Tools and Materials

### Engines, libraries, frameworks

Phaser 3 is our game engine of choice, as it will help us to make a web game and can be easily adapted for any changes we may need to make. Our approach allows us to use and relearn an engine we all have some experience in, while giving room for us to experiment in other aspects of the project.

### Programming languages

We will be using Phaser 3 API along with JavaScript as Phaser is a web-based game engine. Consequently, because we are using a web-based game engine we will also be using HTML and CSS albeit very minimally. On the likely chance that we wil use Sprite Atlases, we will likely also use JSON to organize sprite atlas information. Moving forward in our alternate platform, we would like to switch the main programming language from JavaScript to TypeScript.

### Tools

The main IDE for writing code that we will all use is Visual Studio Code which we are all comfortable with. With visual assets, there are a variety of possibilities but it is very likely that Aseprite will be used for pixel art and sprites. We all know how to make pixel art and can do art to some degree so any art program is comfortable for us to use. For version control, we are also using GitHub because that is the expected version control tool.

### Alternate Platform

Our alternate primary programming language is TypeScript which supports web functionality but with stricter types. Phaser 3 should support TypeScript which means we can still use Phaser 3 to build our game.

## Outlook

Our team is hoping to make a project of reasonable scope that we feel that can be accomplished giving the time frame and available resources. The hardest anticipated part of this project is switching frameworks and getting comfortable in both languages. We are hoping to expand our understanding of creating clean, readable, and scalable code in a team setting.
