/**
 * File testing the itinerary model code.
 */
{
// For comparison of arrays
// This code has issues, see https://www.30secondsofcode.org/blog/s/javascript-array-comparison
    const equals = (a, b) =>
        a.length === b.length &&
        a.every((v, i) => v === b[i]);

    let x = ["p1", "p2"]; // "planets"

// The itinerary is empty at the start
    console.assert(itGet().length === 0, "itinerary:E1");

// Add a planet to the itinerary
    itPushCommit(x[0]);
    console.assert(equals(itGet(), ["p1"]), "itinerary:E2");

// Remove a planet from the itinerary
    itPopCommit();
    console.assert(itGet().length === 0, "itinerary:E3");

// Remove again
    itPopCommit();
    console.assert(itGet().length === 0, "itinerary:E4");

// Add twice
    itPushCommit(x[0]);
    itPushCommit(x[1]);
    console.assert(equals(itGet(), ["p1", "p2"]), "itinerary:E5");

// Remove twice
    itPopCommit();
    console.assert(equals(itGet(), ["p1"]), "itinerary:E6");
    itPopCommit();
    console.assert(itGet().length === 0, "itinerary:E7");

// Clear the itinerary
    itClearCommit();
    console.assert(itGet().length === 0, "itinerary:E8");
// Clear a non-empty itinerary
    itPushCommit(x[0]);
    itClearCommit();
    console.assert(itGet().length === 0, "itinerary:E9");

// Set the itinerary
    itSet(x);
    console.assert(equals(itGet(), ["p1", "p2"]), "itinerary:E10");
// Set to empty
    itSet([]);
    console.assert(itGet().length === 0, "itinerary:E11");

    undoRedoClear(); // Must be called at the end of all tests
}