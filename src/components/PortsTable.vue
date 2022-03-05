<template>
  <div class="container">
    <div class="card">
      <header class="card-header sticky" id="header">
        <div class="card-header-title has-background-primary-dark has-text-white">
          Ports
        </div>
      </header>
      <table class="table is-striped is-bordered">
        <thead>
          <tr>
            <th
              v-for="(header, index) in columnHeaders"
              :key="index"
              class="th-column sticky has-background-primary-light"
            >
              {{header}}
            </th>
          </tr>
        </thead>
        <tbody v-if="!loading">
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
      <nav class="pagination sticky has-background-primary-light" role="navigation" id="pagination">
        <a :class="['pagination-previous', {'is-disabled': !hasPreviousPage}]">Previous</a>
        <a :class="['pagination-next', {'is-disabled': !hasNextPage}]">Next page</a>
        <ul v-if="lastPage <= 7" class="pagination-list">
          <li v-for="index in lastPage" :key="index">
            <a :class="['pagination-link', {'is-current': index === currentPage}]">{{index}}</a>
          </li>
        </ul>
        <ul v-else-if="currentPage <= 5" class="pagination-list">
          <li v-for="index in 5" :key="index">
            <a :class="['pagination-link', {'is-current': index === currentPage}]">{{index}}</a>
          </li>
          <li>
            <span class="pagination-ellipsis">&hellip;</span>
          </li>
          <li>
            <a class="pagination-link">{{lastPage}}</a>
          </li>
        </ul>
        <ul v-else-if="currentPage >= (lastPage - 4)" class="pagination-list">
          <li>
            <a class="pagination-link">1</a>
          </li>
          <li>
            <span class="pagination-ellipsis">&hellip;</span>
          </li>
          <li v-for="index in lastFivePages" :key="index">
            <a :class="['pagination-link', {'is-current': index === currentPage}]">{{index}}</a>
          </li>
        </ul>
        <ul v-else class="pagination-list">
          <li>
            <a class="pagination-link">1</a>
          </li>
          <li>
            <span class="pagination-ellipsis">&hellip;</span>
          </li>
          <li>
            <a class="pagination-link">{{currentPage - 1}}</a>
          </li>
          <li>
            <a class="pagination-link is-current">{{currentPage}}</a>
          </li>
          <li>
            <a class="pagination-link">{{currentPage + 1}}</a>
          </li>
          <li>
            <span class="pagination-ellipsis">&hellip;</span>
          </li>
          <li>
            <a class="pagination-link">{{lastPage}}</a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script>
import { PortsService } from "@/services/PortsService";

export default {
  data () {
    return  {
      ports: undefined,
      columnHeaders: ["ID", "Name", "Country", "Continent", "Coordinates"],
      currentPage: undefined,
      lastPage: undefined,
      loading: true,
      error: false
    };
  },
  mounted() {
    this.fetchPorts();
  },
  computed: {
    hasNextPage: function() {
      return this.currentPage !== this.lastPage;
    },
    hasPreviousPage: function() {
      return this.currentPage !== 1;
    },
    lastFivePages: function() {
      const start = this.lastPage-4;
      const stop = this.lastPage;
      return Array(stop - start + 1).fill().map((_, idx) => start + idx);
    }
  },
  methods: {
    async fetchPorts() {
      try {
        const response = await PortsService.getPorts();
        const parsedResponse = JSON.parse(JSON.stringify(response.data));

        this.ports = parsedResponse.data;
        this.loading = false;
        
        const { current_page: responseCurrentPage, last_page: responseLastPage } = parsedResponse.meta;
        this.updatePagination(responseCurrentPage, responseLastPage);
    
        this.setStickyElementsPosition();
      } catch {
        this.error = true;
        this.loading = false;
      }
    },
    updatePagination(currentPage, lastPage) {
      if (this.currentPage === undefined || this.currentPage === currentPage) {
        this.currentPage = currentPage;
      }
      if (this.lastPage === undefined || this.lastPage === lastPage) {
        this.lastPage = lastPage;
      }
    },
    setStickyElementsPosition() {
      const header = document.querySelector("#header");
      const tableHeaderColumns = document.querySelectorAll(".th-column");
      const pagination = document.querySelector("#pagination");

      header.style.top = 0;
      [...tableHeaderColumns].forEach( column => column.style.top = `${header.offsetHeight - 1}px`);
      pagination.style.bottom = 0;
    }
  }
}
</script>

<style scoped lang="scss">
  @import "@/scss/components/_ports-table.scss";
</style>
