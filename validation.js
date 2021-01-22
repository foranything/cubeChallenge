const input = require("./input_data.json");
const result = require("./result.json");

for (let i = 0; i < 30; i++) {
  const a = result.schools[i].town_students.reduce((a, c) => a + c.students, 0);
  const b = input.schools[i].capacity;
  if (a !== b) {
    throw "error";
  }
}

for (let i = 0; i < 100; i++) {
  const a = result.schools.reduce((acc, school) => {
    const target = school.town_students.find((e) => e.name === `t${i + 1}`);
    if (target) {
      return acc + target.students;
    }
    return acc;
  }, 0);

  const b = input.towns[i].students;

  if (a !== b) {
    throw "error";
  }
}
