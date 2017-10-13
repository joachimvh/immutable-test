
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

function* applyBindingsSeamlessImmutableClone (o, keyIdx) {
  if (keyIdx >= keys.length)
    return yield o;

  let key = keys[keyIdx];

  for (let i = 0; i < bindingCount; ++i) {
    yield* applyBindingsSeamlessImmutableClone(o.set(key, i), keyIdx + 1);
  }
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

let keys = [ '?x', '?y', '?z', '?v', '?w' ];
let BindingRecord = imRecord({'?x': null, '?y': null, '?z': null, '?v': null, '?w': null});
let bindingCount = 13;
let SimmutableObject = () => Simmutable({'?x': null, '?y': null, '?z': null, '?v': null, '?w': null});

let start;
for (let i = 0; i < 15; ++i) {
  if (i === 5)
    start = time();
  for (let binding of applyBindingsImmutable(new imMap(), 0)) { }
}
console.log(`Immutable Map: ${time(start)}ms`);

for (let i = 0; i < 15; ++i) {
  if (i === 5)
    start = time();
  for (let binding of applyBindingsImmutable(new BindingRecord(), 0)) { }
}
console.log(`Immutable Record: ${time(start)}ms`);

for (let i = 0; i < 15; ++i) {
  if (i === 5)
    start = time();
  for (let binding of applyBindingsSeamlessImmutableClone(SimmutableObject(), 0)) { }
}
console.log(`Seamless Immutable Object: ${time(start)}ms`);

for (let i = 0; i < 15; ++i) {
  if (i === 5)
    start = time();
  for (let binding of applyBindingsClone({}, 0)) { }
}
console.log(`Clone Object: ${time(start)}ms`);

for (let i = 0; i < 15; ++i) {
  if (i === 5)
    start = time();
  for (let binding of applyBindingsMap(new Map(), 0)) { }
}
console.log(`Native Map: ${time(start)}ms`);