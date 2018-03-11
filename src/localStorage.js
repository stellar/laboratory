export const loadState = () => {
  try {
    const serializerdState = localStorage.getItem('state');
    if (serializerdState === null) {
      return undefined;
    }
    return JSON.parse(serializerdState);
  } catch (err) {
    return undefined;
  }
}

export const saveState = (state) => {
  try {
    const serializerdState = JSON.stringify(state)
    localStorage.setItem('state', serializerdState);
  } catch (err) {
    // Ignore error.
  }
}
