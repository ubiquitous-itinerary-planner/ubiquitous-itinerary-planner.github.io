/**
 * Undo-Redo manager
 */
import {itGet, itSet} from "./sideMenu.js";

let undoStack = [];
let redoStack = [];

/**
 * Commit the current state to the undo-redo manager.
 */
export function commit(){
    undoStack.push(itGet());
}

/**
 * Undo the most recent action, if such action exists.
 */
export function undo(){
    let oldState = itGet();
    let newState = undoStack.pop();
    if(newState === undefined){
        return;
    }
    itSet(newState);
    redoStack.push(oldState);
}

/**
 * Redo the most recently undone action, if such action exists.
 */
export function redo(){
    let oldState = itGet();
    let newState = redoStack.pop();
    if(newState === undefined){
        return;
    }
    itSet(newState);
    undoStack.push(oldState);
}

/**
 * Clears the undo-redo manager. For debugging purposes.
 */
export function undoRedoClear(){
    undoStack = [];
    redoStack = [];
}