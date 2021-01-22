const connects = require("./distance.json");
const fs = require("fs");

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

///
const connectArbitrary = (connects) => {
  connects.forEach((connect) => {
    connect.connection = Math.min(
      getRestConnectedOnTown(connects, connect.town),
      getRestConnectedOnSchool(connects, connect.school)
    );
  });
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

connectArbitrary(connects);

//
console.log(getConnectLines(connects));
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
  const ITER = 1000000;
  for (let i = 0; i < ITER; i++) {
    shuffle(connects);
  }
  for (let i = 0; i < ITER; i++) {
    disconnectMax(connects);
  }
};

const ITER = 100;
for (let i = 0; i < ITER; i++) {
  console.log(i)
  shuffleAndRun(connects);
  console.log(getConnectLines(connects));
  console.log(calcNetDistance(connects));
}

console.log(getConnectLines(connects));
console.log(calcNetDistance(connects));

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

fs.writeFile("result.json", JSON.stringify(result), (err) => {
  if (err) {
    console.log(err);
  }
  console.log("done");
});
