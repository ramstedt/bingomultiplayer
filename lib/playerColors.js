export const PLAYER_COLORS = [
  '#e05252', '#e07c52', '#d4a017', '#e0c020',
  '#2e9eb5', '#4b79e3', '#7c52e0', '#c052e0', '#e05298', '#e08020',
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
