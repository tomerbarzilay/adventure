// ----------------------------------------------------------------------------

const $ = id => document.getElementById(id);

const initCallbacks = [];
const onInit = cb => initCallbacks.push(cb);
const init = () => initCallbacks.forEach(cb => cb());
addEventListener("load", init);

// ----------------------------------------------------------------------------

let $description, $input, $history;
onInit(() => {
  $description = $("description");
  $input       = $("input");
  $history     = $("history");
});

// ----------------------------------------------------------------------------

const directions = Object.fromEntries(
  [["north", "south"], ["east", "west"], ["up", "down"], ["inside", "outside"]]
  .map(d => [[d[0],d[1]], [d[1],d[0]]])
  .flat());

class Location {
  constructor(name, desc) {
    this.name = name;
    this.desc = desc;
    this.exits = {};
  }
  connect(to, dir) {
    if (!(dir in directions))
      throw Error("connect: unknown direction: " + dir);
    this.exits[dir] = to;
    to.exits[directions[dir]] = this;
  }
}

// ----------------------------------------------------------------------------

class Player {
  constructor(location) {
    this.location = location;
  }
  get location() { return this._location; }
  set location(loc) { this._location = loc; $description.innerHTML = loc.desc; }
  go(dir) {
    this.location = this.location.exits[dir];
  }
}

// ----------------------------------------------------------------------------

const home = new Location(
  "home",
  "This is your home, it is cozy.");
const meadow = new Location(
  "meadow",
  "You are in a grassy green pasture.  Cows are lazily grazing the grass, and bioconvert it to piles of dung.");
const junkyard = new Location(
  "junkyard",
  "You are standing in the middle of huge piles of crap.  You throw up a little in your mouth.");

home.connect(meadow, "south");
meadow.connect(junkyard, "south");

// ----------------------------------------------------------------------------

let player;
onInit(() => {
  player = new Player(home);
});

// ----------------------------------------------------------------------------

onInit(() => {
  $input.focus();
  $input.addEventListener("keydown", e => {
    if (e.key !== "Enter") return;
    const inp = $input.value.trim().split(/ +/);
    if (inp.length === 0) return;
    command(inp[0], inp.slice(1));
    $input.value = "";
  });
});

// ----------------------------------------------------------------------------
const show = str => {
  while ($history.childElementCount > 50) {
    $history.firstElementChild.remove();
  }
  const p = document.createElement("p");
  p.appendChild(document.createTextNode(str));
  $history.appendChild(p);
  $history.scrollTop = $history.scrollHeight - $history.offsetHeight;
};

// ---------------------------------------------------------------------------
const command = (cmd, args) => {
  show("*** " + [cmd, ...args].join(" "));
};

// ---------------------------------------------------------------------------
