> Relevant rankgun marketplace post: https://www.rankgun.works/marketplace/rankgun-sessions-board-mpbrfuiq

# Rankgun Sessions Board

This is a sessions board designed to be added to your roblox game built with [RobloxTs](https://roblox-ts.com/) & [Rankgun](https://rankgun.works/). Download the latest version from the releases tab or from the roblox model list. 

Please keep in mind this software is avaible for everyone under the [RankGun PolyForm Shield License](/license.md).

## Usage 

Ensure HTTPService is **enabled**. 

If using production build (You most likely are), drag "session_board" to workspace. Then set the value of API_KEY variable to your rankgun workspace api key. Then all should work. 

If using development build, simply configure ``API_KEY``. ([HttpService Secrets coming](https://create.roblox.com/docs/reference/engine/datatypes/Secret). DO NOT COMMIT TO GIT with API_KEY exposed.)

## Development 

Install all dependencies: ``npm install``

### Start Session 

``npm run start`` 

Builds projec to game.rbxl, launches roblox studio, starts rojo serve and robloxts compiler. You can connect via rojo plugin and develop as necessary. 

### Existing projects

``npm run watch``, will start rojo serve and start the robloxts compiler. 

### Development Build  

``npm run build``, Will build to game.rbxl. 

### Production Build  

To build a version that keeps the project more compact: 

1. ``npx rbxtsc --rojo build.project.json`` - Compiles RobloxTs
2. ``rojo build build.project.json -o build.rbxl`` - Compiles Build

## Sync roblox project to support fully managed rojo. 

TODO. Note to self: 

Using ``7.7.0-rc.1`` run ``rojo syncback default.project.json --input game.rbxl``. 

Run sync: ``npm run sync``. (Uses lune to generate src/services.d.ts) (Ref: [rbxts-build](https://github.com/osyrisrblx/rbxts-build))s


## Debugging 

Logs should be outputted to the "output" window. 
