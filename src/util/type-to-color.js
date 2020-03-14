/**
 * Get color of a type
 */
const typeToColor = typeName => {
  switch (typeName) {
    case "Bug":
      return "green lighten-2";
    case "Fire":
      return "orange darken-1";
    case "Grass":
      return "green darken-3";
    case "Poison":
      return "pink lighten-1";
    case "Water":
      return "blue darken-2";
    case "Flying":
      return "blue darken-4";
    case "Normal":
      return "white";
    case "Electric":
      return "yellow darken-3";
    case "Ground":
      return "brown lighten-1";
    case "Fairy":
      return "pink lighten-2";
    case "Fighting":
      return "red darken-2";
    case "Ice":
      return "blue lighten-2";
    case "Ghost":
      return "purple lighten-2";
    case "Psychic":
      return "purple darken-2";
    case "Rock":
      return "grey darken-2";
    case "Dragon":
      return "orange darken-1";
    case "Steel":
      return "grey lighten-3";
    default:
      return "black";
  }
};

export default typeToColor;
