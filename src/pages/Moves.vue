<template>
  <content-wrapper>
    <div class="display-1 mb-2">Moves</div>
    <v-card>
      <v-card-title>
        <v-text-field
          v-model="query"
          label="Search"
          single-line
          hide-details
          outlined
        />
      </v-card-title>
      <v-data-table
        :headers="[
          { text: 'ID', value: 'id' },
          { text: 'Name', value: 'name' },
          { text: 'Type', value: 'type.name' },
        ]"
        :items="moves"
        :search="query"
      >
        <template v-slot:body="{ items }">
          <tbody>
            <tr
              v-for="item in items"
              :key="item.id"
              @click="$router.push(`/moves/${item.slug}`)"
              class="cursor-pointer"
            >
              <td>{{ item.id }}</td>
              <td>{{ item.name }}</td>
              <td>
                <poke-type-chip :type="item.type" small></poke-type-chip>
              </td>
            </tr>
          </tbody>
        </template>
      </v-data-table>
    </v-card>
  </content-wrapper>
</template>

<script>
import PokeTypeChip from "../components/PokeTypeChip";

export default {
  components: { PokeTypeChip },

  data() {
    return {
      query: "",
    };
  },

  computed: {
    moves() {
      return this.$page.allMove.edges.map(edge => edge.node);
    },
  },

  metaInfo() {
    return {
      title: "Moves",
      meta: [{ name: "description", content: "Pokemon Moves" }],
    };
  },
};
</script>

<page-query>
query {
  allMove (sortBy: "id", order: ASC) {
    edges {
      node {
        id, name,
        type { id, slug, name }
      }
    }
  }
}
</page-query>
