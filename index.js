
const immutable = require('immutable');
const Simmutable = require('seamless-immutable');
const imMap = immutable.Map;
const imRecord = immutable.Record;

function time (start) {
  if (start) {
    let end = process.hrtime(start);
    return end[0] * 1000 + end[1]/1000000;
  }
  return process.hrtime();
}

function* applyBindingsImmutable (o, keyIdx) {
  if (keyIdx >= keys.length)
    return yield o;

  let key = keys[keyIdx];

  for (let i = 0; i < bindingCount; ++i)
    yield* applyBindingsImmutable(o.set(key, i), keyIdx + 1);
}

function* applyBindingsClone (o, keyIdx) {
  if (keyIdx >= keys.length)
    return yield o;

  let key = keys[keyIdx];

  for (let i = 0; i < bindingCount; ++i) {
    let sub = Object.create(o);
    sub[key] = i;
    yield* applyBindingsClone(sub, keyIdx + 1);
  }
}

function* applyBindingsMap (o, keyIdx) {
  if (keyIdx >= keys.length)
    return yield o;

  let key = keys[keyIdx];

  for (let i = 0; i < bindingCount; ++i) {
    let sub = new Map(o);
    sub.set(key, i);
    yield* applyBindingsClone(sub, keyIdx + 1);
  }
}

let keys = [ 'a', 'b', 'c', 'd', 'e' ];
let BindingRecord = imRecord({'a': null, 'b': null, 'c': null, 'd': null, 'e': null});
let SimmutableObject = () => Simmutable({'a': null, 'b': null, 'c': null, 'd': null, 'e': null});
let bindingCount = 13;
let warmup = 5;
let runs = 15;

function test(name, f, init) {
  let start = null;
  for (let i = 0; i < runs; ++i) {
    if (i === warmup)
      start = time();
    for (let binding of f(init(), 0)) { }
  }
  console.log(`${name}: ${time(start)}ms`);
}

test('Immutable Map', applyBindingsImmutable, () => new imMap());
test('Immutable Record', applyBindingsImmutable, () => new BindingRecord());
test('Simmutable Object', applyBindingsImmutable, () => SimmutableObject());
test('Clone Object', applyBindingsClone, () => { return {} });
test('Native Map', applyBindingsMap, () => new Map());

for (let binding of applyBindingsMap(new Map(), 0)) { }