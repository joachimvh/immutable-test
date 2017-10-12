
const { Map, Record } = require('immutable');

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

let keys = [ '?x', '?y', '?z' ];
let BindingRecord = Record({'?x': null, '?y': null, '?z': null});
let bindingCount = 100;
let resultCount;

let start;
for (let i = 0; i < 15; ++i) {
  resultCount = 0;
  if (i === 5)
    start = time();
  for (let binding of applyBindingsImmutable(new Map(), 0)) { }
}
console.log(`Immutable Map: ${time(start)}ms`);

for (let i = 0; i < 15; ++i) {
  resultCount = 0;
  if (i === 5)
    start = time();
  for (let binding of applyBindingsImmutable(new BindingRecord(), 0)) { }
}
console.log(`Immutable Record: ${time(start)}ms`);

for (let i = 0; i < 15; ++i) {
  resultCount = 0;
  if (i === 5)
    start = time();
  for (let binding of applyBindingsClone({}, 0)) { }
}
console.log(`Clone Object: ${time(start)}ms`);