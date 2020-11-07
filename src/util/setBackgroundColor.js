export const setBackgroundColor = (color = "red") => {
  document.documentElement.style.setProperty("--background-color", color);
};
