export const PLAYER_COLORS = [
  '#fc8181', '#f6ad55', '#f6e05e', '#4fd1c5',
  '#63b3ed', '#76e4f7', '#b794f4', '#f687b3', '#68d391', '#fbb6ce',
  '#f97316', '#e879f9', '#34d399', '#fb923c', '#a3e635',
];

export const pickColor = (usedColors) => {
  const available = PLAYER_COLORS.filter((c) => !usedColors.includes(c));
  const pool = available.length > 0 ? available : PLAYER_COLORS;
  return pool[Math.floor(Math.random() * pool.length)];
};

export const colorFromUsername = (username) => {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PLAYER_COLORS[Math.abs(hash) % PLAYER_COLORS.length];
};
