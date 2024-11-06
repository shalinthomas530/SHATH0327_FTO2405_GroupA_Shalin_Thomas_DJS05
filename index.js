function newStore(reducer) {
    let state = 0;
    let subscribers = [];

    // Get the state
    const getState = function () {
        return state;
    };

    // Add a subscriber function to the subscribers array
    const subscribe = function (subscriber) {
        subscribers.push(subscriber);

        return function unsubscribe() {
            subscribers = subscribers.filter(item => item !== subscriber);
        };
    };

    // Dispatch an action to modify the state
    const dispatch = function (action) {
        state = reducer(state, action); // Reducer updates the state
        subscribers.forEach(subscriber => subscriber()) // Notify all subscribers of update to state
    }

    return {
        getState,
        subscribe,
        dispatch
    };
}

// Reducer function to handle various actions
const counterReducer = (state = 0, action) => {
    switch (action.type) {
        case "INCREMENT":
            return state + 1;
        case "DECREMENT":
            return state - 1;
        case "RESET":
            return 0;
        default:
            return state;
    }
}

// Create a new store with the reducer
const store = newStore(counterReducer);

// Subscribe to state changes and get the unsubscribe function to be called later
const unsubscribe = store.subscribe(() => console.log("State:", store.getState()));

// Dispatch actions to test different methods
store.dispatch({ type: "INCREMENT" }); // Logs: State: 1
store.dispatch({ type: "INCREMENT" }); // Logs: State: 2
store.dispatch({ type: "RESET" }); // Logs: State: 0
store.dispatch({ type: "INCREMENT" }); // Logs: State: 1

store.dispatch({ type: "INCREMENT" }); // Logs: State: 2
store.dispatch({ type: "DECREMENT" }); // Logs: State: 1

unsubscribe()

store.dispatch({ type: "INCREMENT" }); // No logs as we are unsubscribed
store.dispatch({ type: "INCREMENT" }); // No logs as we are unsubscribed