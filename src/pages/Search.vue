<template>
  <Layout>
    <content-wrapper>
      <v-card>
        <v-card-title>
          <v-text-field
            v-model="query"
            label="Search"
            single-line
            hide-details
            outlined
          ></v-text-field>
        </v-card-title>
        <v-data-table
          :headers="[
            { text: 'ID', value: 'id' },
            { text: 'Name', value: 'name' },
            { text: 'Types', value: 'types' },
          ]"
          :items="$page.allPokemon.edges.map(edge => edge.node)"
          :search="query"
        >
          <template v-slot:body="{ items }">
            <tbody>
              <tr
                v-for="item in items"
                :key="item.id"
                @click="$router.push(`/${item.slug}`)"
                class="cursor-pointer"
              >
                <td>{{ item.id }}</td>
                <td>{{ item.name }}</td>
                <td>
                  <v-row dense>
                    <v-col
                      v-for="type in item.types"
                      :key="type.id"
                      class="flex-grow-0"
                    >
                      <poke-type-chip :type="type" small></poke-type-chip>
                    </v-col>
                  </v-row>
                </td>
              </tr>
            </tbody>
          </template>
        </v-data-table>
      </v-card>
    </content-wrapper>
  </Layout>
</template>

<script>
import PokeTypeChip from "../components/PokeTypeChip";

export default {
  components: { PokeTypeChip },

  /**
   * Component data
   */
  data() {
    return {
      query: "",
    };
  },
};
</script>

<page-query>
query {
  allPokemon(sortBy: "id", order: ASC) {
    edges {
      node {
        id, name, slug,
        types { id, name, slug }
      }
    }
  }
}
</page-query>
