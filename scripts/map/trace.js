// Vettorializza le maschere create da vectorize.py → topo_paths.json (coordinate in unità mappa).
// Uso: node scripts/map/trace.js <cartella-maschere>   (richiede: npm i -g potrace oppure npx)
const potrace = require("potrace");
const fs = require("fs");
const path = require("path");
const dir = process.argv[2];
const jobs = { buildings: "m_buildings.png", roads: "m_roads.png", sport: "m_sport.png" };
const out = {};
let n = Object.keys(jobs).length;
for (const [k, f] of Object.entries(jobs)) {
  potrace.trace(
    path.join(dir, f),
    { threshold: 128, turdSize: k === "roads" ? 120 : 60, optTolerance: 3, alphaMax: k === "buildings" ? 0.6 : 1 },
    (err, svg) => {
      if (err) throw err;
      out[k] = svg.match(/ d="([^"]+)"/)[1].replace(/-?\d+(\.\d+)?/g, (m) => String(Math.round(parseFloat(m) / 2)));
      if (--n === 0) {
        fs.writeFileSync(path.join(__dirname, "topo_paths.json"), JSON.stringify(out));
        for (const x in out) console.log(x, out[x].length);
      }
    },
  );
}
