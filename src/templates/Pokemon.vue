<template>
  <Layout>
    <div>
      Pokemon with id {{ $page.pokemon.id }}, named {{ $page.pokemon.name }}
    </div>
  </Layout>
</template>

<page-query>
  query ($id: ID!) {
    pokemon(id: $id) {
      id,
      name
    }
  }
</page-query>
