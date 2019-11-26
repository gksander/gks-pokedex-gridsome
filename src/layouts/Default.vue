<template>
  <div class="layout">
    <SiteHeader />
    <div class="container mx-auto">
      <slot />
    </div>
  </div>
</template>

<script>
import SiteHeader from "~/components/SiteHeader";
export default {
  components: { SiteHeader },
};
</script>

<static-query>
query {
  metadata {
    siteName
  }
}
</static-query>
