var _ = require('lodash');

interface Data {
  towns: Town[];
  schools: School[];
}

interface Town {
  name: string;
  students: number;
  position: Position;
}

interface School {
  name: string;
  town_students: TownStudent[];
  position: Position;
  capacity: number;
}

interface TownStudent {
  name: string;
  student: number;
}

interface Position {
  x: number;
  y: number;
}

var data: Data = require('./input_data.json');

const townXMax = _.maxBy(data.towns, (town: Town) => town.position.x)
console.log('townXMax :', townXMax);
const townYMax = _.maxBy(data.towns, (town: Town) => town.position.y)
console.log('townYMax :', townYMax);

const schoolXMax = _.maxBy(data.schools, (school: Town) => school.position.x)
console.log('schoolXMax :', schoolXMax);
const schoolYMax = _.maxBy(data.schools, (school: Town) => school.position.y)
console.log('schoolYMax :', schoolYMax);
