<template>
  <component :is="`TypeChip${type}`" class="mr-2" />
</template>

<script>
import TypeChipFire from "./typechips/TypeChipFire";
import TypeChipBug from "./typechips/TypeChipBug";
import TypeChipGrass from "./typechips/TypeChipGrass";
import TypeChipPoison from "./typechips/TypeChipPoison";
import TypeChipWater from "./typechips/TypeChipWater";
import TypeChipFlying from "./typechips/TypeChipFlying";
import TypeChipNormal from "./typechips/TypeChipNormal";
import TypeChipElectric from "./typechips/TypeChipElectric";
import TypeChipGround from "./typechips/TypeChipGround";
import TypeChipFairy from "./typechips/TypeChipFairy";
import TypeChipFighting from "./typechips/TypeChipFighting";
import TypeChipIce from "./typechips/TypeChipIce";
import TypeChipGhost from "./typechips/TypeChipGhost";
import TypeChipPsychic from "./typechips/TypeChipPsychic";
import TypeChipRock from "./typechips/TypeChipRock";
import TypeChipDragon from "./typechips/TypeChipDragon";
import TypeChipSteel from "./typechips/TypeChipSteel";

// Component
export default {
  props: {
    type: {
      type: String,
      required: true,
    },
  },
  components: {
    TypeChipFire,
    TypeChipBug,
    TypeChipGrass,
    TypeChipPoison,
    TypeChipWater,
    TypeChipFlying,
    TypeChipNormal,
    TypeChipElectric,
    TypeChipGround,
    TypeChipFairy,
    TypeChipFighting,
    TypeChipIce,
    TypeChipGhost,
    TypeChipPsychic,
    TypeChipRock,
    TypeChipDragon,
    TypeChipSteel,
  },
};
</script>
