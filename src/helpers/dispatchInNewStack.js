// Calling `dispatch` inside the `.catch` of `httpRequest` causes problems
// because it silently hides errors down the stack including all the React
// re-rendering happening due to the dispatch.
// By dispatching in a new stack, the dispatch function won't be caught
export default function dispatchInNewStack(dispatch, dispatchObj) {
  setTimeout(() => {
    dispatch(dispatchObj);
  }, 0);
}