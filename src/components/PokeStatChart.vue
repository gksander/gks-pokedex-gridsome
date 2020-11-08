<template>
  <svg
    width="100%"
    height="100%"
    :viewBox="
      `-${PADDED_R}
    -${PADDED_R}
    ${2 * PADDED_R}
    ${2 * PADDED_R}`
    "
  >
    <line
      v-for="([[x1, y1], [x2, y2]], i) in linePairs"
      :key="x1 + y1"
      :x1="x1"
      :y1="y1"
      :x2="x2"
      :y2="y2"
      class="stroke-current"
    />
    <path :d="outerPath" class="stroke-current" fill="transparent" />
    <path
      :d="innerPath"
      :fill="color"
      fill-opacity="0.9"
      :stroke="bgColor"
      stroke-width="2"
    />
    <text
      v-for="(stat, i) in pokemon.stats"
      :key="i"
      :x="getX(i)"
      :y="getY(i)"
      :text-anchor="i === 0 ? 'end' : i === 3 ? 'start' : 'middle'"
      font-size="8"
    >
      {{ stat.name }}
    </text>
  </svg>
</template>

<script>
const R = 50;
const PADDED_R = 1.02 * R;
const N = 6;
const PI = Math.PI;
const points = Array.from({ length: N })
  .map((_, i) => i)
  .map(i => [R * Math.cos((i / N) * 2 * PI), -R * Math.sin((i / N) * 2 * PI)]);

const linePairs = [
  [points[0], points[3]],
  [points[1], points[4]],
  [points[2], points[5]],
];
const outerPath = [
  `M ${points[0][0]} ${points[0][1]}`,
  ...points.map(point => `L ${point[0]} ${point[1]}`),
  `Z`,
].join(",");

export default {
  name: "PokeStatChart",

  props: {
    pokemon: {
      type: Object,
    },
    color: {
      type: String,
      default: "gray",
    },
    bgColor: {
      type: String,
      default: "gray",
    },
  },

  data: () => ({
    R,
    PADDED_R,
    N,
    PI,
    points,
    linePairs,
    outerPath,
  }),

  computed: {
    innerPath() {
      const points = this.pokemon.stats.map((stat, i) => {
        const r = R * Math.min(parseInt(stat.base, 10) / 255, 1);
        const x = r * Math.cos((i / N) * 2 * PI);
        const y = -r * Math.sin((i / N) * 2 * PI);
        return [x, y];
      });

      return [
        `M ${points[0][0]} ${points[0][1]}`,
        ...points.map(([x, y]) => `L ${x} ${y}`),
        "Z",
      ].join(",");
    },
  },

  methods: {
    getX(i) {
      return R * Math.cos((i / N) * 2 * PI);
    },
    getY(i) {
      return -R * Math.sin((i / N) * 2 * PI);
    },
  },
};
</script>
