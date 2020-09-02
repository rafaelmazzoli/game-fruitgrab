export default function createGame() {
  const state = {
    players: [],
    fruits: [],
    screen: {
      width: 10,
      height: 10,
    },
  };
  const observers = [];

  function subscribe(observerFunction) {
    observers.push(observerFunction);
  }

  function unsubscribe(observerFunction) {
    observers = observers.filter((func) => func !== observerFunction);
  }

  function notifyAll(command) {
    observers.forEach((observerFunction) => observerFunction(command));
  }

  function setState(newState) {
    Object.assign(state, newState);
  }

  function start() {
    setInterval(() => {
      if (state.fruits.length <= 5) addFruit({});
    }, 5000);
  }

  function addPlayer({ playerId, positionX, positionY }) {
    const x =
      positionX !== undefined
        ? positionX
        : Math.floor(Math.random() * state.screen.width);
    const y =
      positionY !== undefined
        ? positionY
        : Math.floor(Math.random() * state.screen.height);
    const player = { _key: playerId, x, y };
    state.players.push(player);

    notifyAll({
      type: "add-player",
      playerId,
      positionX: x,
      positionY: y,
    });
  }

  function removePlayer({ playerId }) {
    state.players = state.players.filter(
      (statePlayer) => statePlayer._key !== playerId
    );

    notifyAll({
      type: "remove-player",
      playerId,
    });
  }

  function addFruit({ fruitId, positionX, positionY }) {
    const _key =
      fruitId !== undefined ? fruitId : Math.floor(Math.random() * 1000);
    const x =
      positionX !== undefined
        ? positionX
        : Math.floor(Math.random() * state.screen.width);
    const y =
      positionY !== undefined
        ? positionY
        : Math.floor(Math.random() * state.screen.height);
    state.fruits.push({ _key, x, y });

    notifyAll({
      type: "add-fruit",
      fruitId: _key,
      positionX: x,
      positionY: y,
    });
  }

  function removeFruit({ fruitId }) {
    state.fruits = state.fruits.filter(
      (stateFruit) => stateFruit._key !== fruitId
    );

    notifyAll({
      type: "remove-fruit",
      fruitId,
    });
  }

  function movePlayer({ type, keyPressed, playerId }) {
    notifyAll({ type, keyPressed, playerId });

    const allowedMoves = {
      ArrowUp: (player) => {
        if (player.y - 1 >= 0) player.y--;
      },
      ArrowDown: (player) => {
        if (player.y + 1 < state.screen.height) player.y++;
      },
      ArrowLeft: (player) => {
        if (player.x - 1 >= 0) player.x--;
      },
      ArrowRight: (player) => {
        if (player.x + 1 < state.screen.width) player.x++;
      },
    };

    const moveFunction = allowedMoves[keyPressed];
    const player = state.players.find((player) => player._key === playerId);
    if (player && moveFunction) {
      moveFunction(player);
      checkFruitCollisionForPlayer(player);
    }
  }

  function checkFruitCollisionForPlayer(player) {
    state.fruits.forEach((fruit) => {
      if (fruit.x === player.x && fruit.y === player.y)
        removeFruit({ fruitId: fruit._key });
    });
  }

  return {
    subscribe,
    unsubscribe,
    movePlayer,
    state,
    addPlayer,
    removePlayer,
    addFruit,
    removeFruit,
    setState,
    start,
  };
}
