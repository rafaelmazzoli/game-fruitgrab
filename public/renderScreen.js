export default function renderScreen(
  screen,
  game,
  requestAnimationFrame,
  currentPlayerId
) {
  const context = screen.getContext("2d");

  context.clearRect(0, 0, 10, 10);
  game.state.players.forEach((player) => {
    context.fillStyle = "black";
    context.fillRect(player.x, player.y, 1, 1);
  });

  game.state.fruits.forEach((fruit) => {
    context.fillStyle = "green";
    context.fillRect(fruit.x, fruit.y, 1, 1);
  });

  const currentPlayer = game.state.players.find(
    (player) => player._key === currentPlayerId
  );
  if (currentPlayer) {
    context.fillStyle = "red";
    context.fillRect(currentPlayer.x, currentPlayer.y, 1, 1);
  }

  requestAnimationFrame(() => {
    renderScreen(screen, game, requestAnimationFrame, currentPlayerId);
  });
}
