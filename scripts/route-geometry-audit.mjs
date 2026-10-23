const response = await fetch("http://localhost:3000/api/traffic/routes");
if (!response.ok) throw new Error(`Route API returned ${response.status}`);
const { routes } = await response.json();

function intersects(a, b, c, d) {
  const orientation = (p, q, r) => (q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]);
  return orientation(a, b, c) * orientation(a, b, d) < 0 && orientation(c, d, a) * orientation(c, d, b) < 0;
}

for (const [id, geometry] of Object.entries(routes)) {
  let crossings = 0;
  let length = 0;
  for (let index = 1; index < geometry.length; index += 1) {
    length += Math.hypot((geometry[index][0] - geometry[index - 1][0]) * 102, (geometry[index][1] - geometry[index - 1][1]) * 111);
  }
  for (let first = 0; first < geometry.length - 1; first += 1) {
    for (let second = first + 3; second < geometry.length - 1; second += 1) {
      if (intersects(geometry[first], geometry[first + 1], geometry[second], geometry[second + 1])) crossings += 1;
    }
  }
  const direct = Math.hypot((geometry.at(-1)[0] - geometry[0][0]) * 102, (geometry.at(-1)[1] - geometry[0][1]) * 111);
  console.log(`${id}: ${length.toFixed(2)} km, direct ratio ${(length / direct).toFixed(2)}, self-crossings ${crossings}`);
}
