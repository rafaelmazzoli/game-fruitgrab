export default function createKeyboardListener() {
  const state = {
    subscribers: [],
    playerId: null,
  };

  function registerPlayer(playerId) {
    state.playerId = playerId;
  }

  function subscribe(observerFunction) {
    state.subscribers.push(observerFunction);
  }

  function unsubscribe(observerFunction) {
    state.subscribers = state.subscribers.filter(
      (func) => func !== observerFunction
    );
  }

  function notifyAll(command) {
    state.subscribers.forEach((observerFunction) => observerFunction(command));
  }

  document.addEventListener("keydown", handleKeyDown);

  function handleKeyDown(event) {
    const keyPressed = event.key;
    const command = {
      type: "move-player",
      playerId: state.playerId,
      keyPressed,
    };
    notifyAll(command);
  }

  return {
    registerPlayer,
    subscribe,
    unsubscribe,
  };
}
