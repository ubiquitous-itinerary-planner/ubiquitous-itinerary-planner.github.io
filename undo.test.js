/**
 * File testing the undo-redo manager code.
 *
 * Assumes that the code for the itinerary is bug-free.
 */

import {itGet, itPushCommit} from "./itinerary.js";
import {redo, undo, undoRedoClear} from "./undo.js";

// For comparison of arrays
// This code has issues, see https://www.30secondsofcode.org/blog/s/javascript-array-comparison
const equals = (a, b) =>
    a.length === b.length &&
    a.every((v, i) => v === b[i]);

let x = ["p1", "p2"]; // "planets"

// The stack is empty at start
console.assert(itGet().length === 0, "undo:E1");

// Add an item to the itinerary
itPushCommit(x[0]);
console.assert(equals(itGet(),["p1"]), "undo:E2");

// Undo the add
undo();
console.assert(itGet().length === 0, "undo:E3");

// Undo again
undo();
console.assert(itGet().length === 0, "undo:E4");

// Redo the add
redo();
console.assert(equals(itGet(), ["p1"]), "undo:E5");

// Redo again
redo();
console.assert(equals(itGet(), ["p1"]), "undo:E6");

// Add a second item to the itinerary
itPushCommit(x[1]);
console.assert(equals(itGet(), ["p1", "p2"]), "undo:E7");

// Undo twice
undo();
console.assert(equals(itGet(), ["p1"]), "undo:E8");
undo();
console.assert(itGet().length === 0, "undo:E9");

// Redo twice
redo(); redo();
console.assert(equals(itGet(), ["p1", "p2"]), "undo:E10");

// Undo again, to leave the system in the same state as we started
undo(); undo();
console.assert(itGet().length === 0, "undo:E11");


undoRedoClear(); // Must be called at the end of all tests