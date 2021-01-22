const connects = require("./distance.json");
const fs = require("fs");
const saved = require("./result.json");
let globalMin = +fs.readFileSync("./resultValue.txt", "utf8");

const getRestConnectedOnSchool = (connects, key) => {
  const filtered = connects.filter((c) => c.school === key);
  const result =
    filtered[0].capacity -
    filtered.reduce((a, c) => a + (c.connection || 0), 0);
  if (Number.isNaN(result)) throw "error";
  return result;
};

const getRestConnectedOnTown = (connects, key) => {
  const filtered = connects.filter((c) => c.town === key);
  const result =
    filtered[0].students -
    filtered.reduce((a, c) => a + (c.connection || 0), 0);
  if (Number.isNaN(result)) throw "error";
  return result;
};

const getConnectLines = (connects) => {
  return connects.reduce((a, c) => a + c.connection, 0);
};

const calcNetDistance = (connects) => {
  return connects.reduce((a, c) => a + c.distance * c.connection, 0);
};

const maxDistanceLine = (connects, school) => {
  let filtered = connects.filter((c) => c.school === school);

  let maxDistance = -Infinity;
  let target;
  filtered.forEach((connect) => {
    if (connect.distance > maxDistance && connect.connection !== 0) {
      maxDistance = connect.distance;
      target = connect;
    }
  });
  return target;
};

const minDistanceLine = (connects, town) => {
  const filtered = connects.filter((connect) => connect.town === town);
  let minDistance = Infinity;
  let target;
  filtered.forEach((connect) => {
    if (connect.students <= connect.connection) {
      return;
    }
    if (connect.distance < minDistance) {
      minDistance = connect.distance;
      target = connect;
    }
  });
  return target;
};

const findTarget = (connects, school, town) => {
  return connects.find(
    (connect) => connect.school === school && connect.town === town
  );
};

const maxNetDistanceLines = (connects) => {
  let netDistance = -Infinity;
  let target;
  connects.forEach((c) => {
    const cNet = c.connection * c.distance;
    if (netDistance < cNet) {
      netDistance = cNet;
      target = c;
    }
  });
  return target;
};

const randN = (n) => {
  return ~~(Math.random() * n + 1);
};

const shuffle = (connects) => {
  let rand = findTarget(connects, `s_${randN(30)}`, `t_${randN(100)}`);
  let alter = minDistanceLine(connects, rand.town);
  let rest = maxDistanceLine(connects, alter.school);
  let rest2 = findTarget(connects, rand.school, rest.town);
  if (rand.connection && rest.connection) {
    rand.connection--;
    alter.connection++;
    rest.connection--;
    rest2.connection++;
  }
};

const load = (connects, saved) => {
  saved.schools.forEach((school) => {
    school.town_students.forEach((ts) => {
      findTarget(
        connects,
        `s_${school.name.slice(1)}`,
        `t_${ts.name.slice(1)}`
      ).connection = ts.students;
    });
  });
  connects.forEach((c) => {
    if (!c.connection) {
      c.connection = 0;
    }
  });
};

load(connects, saved);
//
console.log(calcNetDistance(connects));

const disconnectMax = (connects) => {
  let max = maxNetDistanceLines(connects);
  let alter = minDistanceLine(connects, max.town);
  let rest = maxDistanceLine(connects, alter.school);
  let rest2 = findTarget(connects, max.school, rest.town);
  if (max.connection && rest.connection) {
    max.connection--;
    alter.connection++;
    rest.connection--;
    rest2.connection++;
  }
};
const shuffleAndRun = (connects) => {
  let prev = 0;
  const ITER = 1000000;
  console.log("shuffle");
  for (let i = 0; i < ITER; i++) {
    if (i % 10000 === 0) {
      const distance = calcNetDistance(connects);
      console.log(distance);
      if (globalMin > distance) {
        save(connects, distance);
      }
    }
    shuffle(connects);
  }
  console.log("disconnectMax");
  for (let i = 0; i < ITER; i++) {
    if (i % 10000 === 0) {
      if (prev === calcNetDistance(connects)) {
        i = ITER;
      }
      prev = calcNetDistance(connects);
      console.log(prev);
      if (globalMin > prev) {
        save(connects, prev);
      }
    }
    disconnectMax(connects);
  }
};

const save = (connects, net) => {
  const result = {
    schools: [],
  };

  connects.forEach((c) => {
    if (!c.connection) {
      return;
    }
    let school = result.schools.find(
      (school) => school.name === c.school.replace("_", "")
    );
    if (!school) {
      school = {
        name: c.school.replace("_", ""),
        town_students: [],
      };
      result.schools.push(school);
    }
    school.town_students.push({
      name: c.town.replace("_", ""),
      students: c.connection,
    });
  });
  fs.writeFileSync("result.json", JSON.stringify(result));
  fs.writeFileSync("resultValue.txt", String(net));
  console.log("saved");
};

const ITER = 10000;
for (let i = 0; i < ITER; i++) {
  console.log(i);
  shuffleAndRun(connects);
  const distance = calcNetDistance(connects);
  if (globalMin > distance) {
    console.log(distance);
    save(connects, distance);
  }
}

console.log(getConnectLines(connects));
console.log(calcNetDistance(connects));
