/**
 * Undo-Redo manager
 */
let undoStack = [];
let redoStack = [];

/**
 * Commit the current state to the undo-redo manager.
 */
function commit(){
    undoStack.push(itGet());
}

/**
 * Undo the most recent action, if such action exists.
 */
function undo(){
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
function redo(){
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
function undoRedoClear(){
    undoStack = [];
    redoStack = [];
}