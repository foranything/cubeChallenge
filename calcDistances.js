const fs = require("fs");
const data = require("./input_data.json");

const calcDistance = (a, b) => {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
};

const connect = [];

data.schools.forEach((school) => {
  data.towns.forEach((town) => {
    connect.push({
      school: school.name,
      town: town.name,
      distance: calcDistance(school.position, town.position),
      capacity: school.capacity,
      students: town.students,
    });
  });
});

fs.writeFile("distance.json", JSON.stringify(connect), (err) => {
  if (err) {
    console.log("err :", err);
  }
  console.log("done");
});
