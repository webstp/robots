# Robot Simulator

This a sample project to create a robot simulator

## Setup

To run this simulator you'll first need to clone this repository and install the dependencies using the following commands

```
git clone https://github.com/webstp/robots
cd robots
npm i
```

## Running the Simulator

To run the simulator you can use the following:
```
npm start
```

## Using the simulator
Once teh simulator is started you can use the arrow keys to select what you would like to do from the following:

- Start a new Simulation
- Run through a single turn
- Query simulation for all robot locations
- Query for houses with at least (n) presents
- Query for the total presents delivered so far
- Run entire simulation
- Exit

Note:
To be able to run a single turn or the entire simulation you must first start a simulation. And you cannot start a new simulation if one is currently running.