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
  },
};
</script>
