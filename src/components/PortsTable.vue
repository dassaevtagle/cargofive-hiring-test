<template>
  <div>
    <div v-if="!loading">
      <table class="table is-striped is-bordered">
        <thead>
          <tr>
            <th 
              v-for="(header, index) in columnHeaders"
              :key="index"  
            >
              {{header}}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="port in ports"
            :key="port.id"
          >
            <td>{{port.id}}</td>
            <td>{{port.name}}</td>
            <td>{{port.country}}</td>
            <td>{{port.continent}}</td>
            <td>{{port.coordinates}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { PortsService } from "@/services/PortsService";

export default {
  data () {
    return  {
      ports: undefined,
      loading: true,
      error: false,
      columnHeaders: ["ID", "Name", "Country", "Continent", "Coordinates"]
    };
  },
  mounted() {
    this.fetchPorts();
  },
  methods: {
    async fetchPorts() {
      try {
        const response = await PortsService.getPorts();
        const parsedResponse = JSON.parse(JSON.stringify(response.data));

        this.ports = parsedResponse.data;
        this.loading = false;
      } catch {
        this.error = true;
        this.loading = false;
      }
    }
  }
}
</script>

<style scoped lang="scss">
  @import "@/scss/components/_ports-table.scss";
</style>
