<template>
  <div
    :style="{
      position: 'fixed',
      bottom: 0,
      left: `${$vuetify.application.left}px`,
      right: $vuetify.application.right,
      height: '60px',
      background: 'rgba(255,255,255,0.9)',
    }"
    class="d-flex align-center elevation-3"
  >
    <slot />
  </div>
</template>

<script>
export default {};
</script>
