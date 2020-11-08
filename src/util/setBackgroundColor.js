export const setBackgroundColor = (color = "red") => {
  if (process.isClient) {
    document.documentElement.style.setProperty("--background-color", color);
  }
};
