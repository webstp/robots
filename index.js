#!/usr/bin/env node

const yargs = require('yargs');
const prompts = require('prompts');
const randomName = require('random-name')

const options = yargs
  .usage('Usage: -r <number> -i <string>')
  .option('numOfRobots', { alias: 'r', describe: 'Number of Robots to simulate', type: 'number' })
  .option('instructions', { alias: 'i', describe: 'Instruction for robots to execute', type: 'string' })
  .argv;

class Robot {
  constructor() {
    this.name = randomName.first()
    this.location = {
      x: 0,
      y: 0
    }
  }
  moveUp() {
    this.location.y++
  }
  moveDown() {
    this.location.y--
  }
  moveLeft() {
    this.location.x--
  }
  moveRight() {
    this.location.x++
  }
}

let houses = {}, robots = [], commands = [], i = 0;
  
async function start() {
  const {numOfRobots} = await prompts({
    type: 'number',
    name: 'numOfRobots',
    message: 'How many robots do you wish to simulate?',
    initial: 1,
    min: 1
  })

  let directionsToParse = ''
  while (!directionsToParse || !directionsToParse.length) {
    ({directionsToParse} = await prompts({
      type: 'text',
      name: 'directionsToParse',
      message: 'What do you want the robots to execute? (Will ignore all characters exempt <,>,^,V)'
    }))
  }

  houses = {}
  robots = Array(numOfRobots).fill().map(() => new Robot())
  commands = [...directionsToParse].reduce((parsed, val) => {
    switch (val) {
      case '^':
        return [...parsed, 'moveUp']
      case '<':
        return [...parsed, 'moveLeft']
      case '>':
        return [...parsed, 'moveRight']
      case 'V':
        return [...parsed, 'moveDown']
      default:
        return parsed
    }
  }, [])
  i = 0
}


function move() {
  const command = commands.shift()
  if (command) {
    const robot = robots[i]
    robot[command]()
    if (canDeliver()) {
      const key = `${robot.location.x}|${robot.location.y}`
      houses[key] ? houses[key]++ : houses[key] = 1
    }
    i = i >= robots.length - 1 ? 0 : ++i
    return true
  }
}

function canDeliver() {
  const bots = robots.filter(({ location }) => robots[i].location === location)
  // Self will always be at the location
  return !(bots.length > 1)
}

function moveAll() {
  while (move()) {}
}

function presentReport() {
  const total = Object.values(houses).reduce((total, next) => {
    return total + next
  }, 0)
  console.log(`Total Presents Delivered: ${total}`)
}

function robotReport() {
  robots.forEach(({name, location: { x, y }}) => {
    console.log(`${name} is at x: ${x}, y: ${y}`)
  })
}
  
async function houseReport() {
  const {n} = await prompts({
    type: 'number',
    name: 'n',
    message: 'Enter in the value for (n)'
  })
  const total = Object.keys(houses).filter(key => houses[key] >= n).length
  console.log(`The total houses with at least ${n} presents: ${total}`)
}

(async () => {
  let input = true
  while (input) {
    const disabled = !commands.length;
    ({input} = await prompts({
      type: 'select',
      name: 'input',
      message: 'What would you like to run?',
      warn: disabled ? 'No simulation running, please start a new simulation' : 'A simulation is in progress',
      choices: [
        { title: 'Start a new Simulation', value: start, disabled: !disabled },
        { title: 'Run through a single turn', value: move, disabled },
        { title: 'Query simulation for all robot locations', value: robotReport },
        { title: 'Query for houses with at least (n) presents', value: houseReport},
        { title: 'Query for the total presents delivered so far', value: presentReport},
        { title: 'Run entire simulation', value: moveAll, disabled },
        { title: 'Exit', value: false }
      ]
    }))
    if (typeof input === 'function') {
      await input()
    }
  }
})()