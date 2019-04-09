# WHAutomata
Warehouse Automation System

# Instructions:
  1. Clone this project and cd into it
  2. Run `npm install`
  3. Install mongodb. If in Ubuntu `sudo apt install mongodb`
  4. Run `node data.js` to create some sample data
  5. Run `node index.js` for frontend server
  6. Run `node api_server.js` for separate api server. (Same database. But does not need to run for functioning of frontend)
  7. Clone this project to a Raspberry Pi and run `npm install express axios node-bluetooth`
  8. Install at least node.js version 8 on the Pi
  9. Run `node api_bot_2.js` in the Pi
  10. **Note:** Pi server will refuse to run (and drown the screen with errors) if it cannot establish a bluetooth connection to the address defined. For this you will need to create and bind an rfcomm channel for that address. The address is for the HC05 connected to arduino.
  11. Write the Bot.ino code to the Arduino
