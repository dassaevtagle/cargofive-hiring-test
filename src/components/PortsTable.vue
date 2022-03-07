<template>
  <div class="container">
    <div class="card">
      <header class="card-header sticky" id="header">
        <div class="card-header-title level has-background-primary-dark has-text-white">
          <div class="level-left">
            <div class="level-item">
              <div v-if="loading" class="spinner mr-3"></div>
              <h1>Ports</h1>
            </div>
          </div>
          <div class="level-right">
            <div class="level-item">
              <div class="field has-addons">
                <p class="control">
                  <input 
                    class="input" 
                    id="search" 
                    type="text" 
                    placeholder="Find in page"
                    v-model="filter">
                </p>
                <p class="control">
                  <button class="button">
                    <span class="icon has-text-dark">
                      <i class="fas fa-search" aria-hidden="true"></i>
                    </span>
                  </button>
                </p>
              </div>
            </div>
            <div class="level-item">
              <button class="button" @click="resetFilters">
                Reset filters
              </button>
            </div>
          </div>
        </div>
      </header>
      <Pagination
        @goto="fetchPorts"
        ref="pagination"
      />
      <table v-if="!loadingFirstTime" class="table is-striped is-narrow is-hoverable">
        <thead>
          <tr>
            <th
              v-for="(header, index) in columnHeaders"
              :key="index"
              class="th-column sticky has-background-primary-light"
            >
              <div v-if="isSortable(header)">
                <div class="is-size-6" @click="sortBy(header)">
                  {{header}}
                  <span class="tag is-rounded icon is-small has-text-dark">
                    <i class="fas fa-arrow-down" aria-hidden="true"></i>
                  </span>
                </div>
              </div>
              <div v-else>
                <div class="is-size-6">
                  {{header}}
                </div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="port in sortedPorts"
            :key="port.id"
          >
            <td v-html="highlightMatches(port.id)"></td>
            <td v-html="highlightMatches(port.name)"></td>
            <td v-html="highlightMatches(port.country)"></td>
            <td v-html="highlightMatches(port.continent)"></td>
            <td v-html="highlightMatches(port.coordinates)"></td>
          </tr>
        </tbody>
      </table>
      <table v-else class="table is-striped is-narrow">
        <tbody>
          <tr 
            v-for="index in 18"
            :key="index"
          >
            <td class="skeleton loading-row-id"><div>&nbsp;</div></td>
            <td class="skeleton loading-row-name"><div>&nbsp;</div></td>
            <td class="skeleton loading-row-country"><div>&nbsp;</div></td>
            <td class="skeleton loading-row-continent"><div>&nbsp;</div></td>
            <td class="skeleton loading-row-coordinates"><div>&nbsp;</div></td>
          </tr>
        </tbody>  
      </table>
    </div>
  </div>
</template>

<script>
import { PortsService } from "@/services/PortsService";
import Pagination from "@/components/TablePagination";

export default {
  data () {
    return  {
      ports: undefined,
      filter: '',
      columnHeaders: ["ID", "Name", "Country", "Continent", "Coordinates"],
      unsortableColumns: ["Coordinates"],
      currentSort: '',
      currentSortDirection: 'asc',
      currentPage: undefined,
      lastPage: undefined,
      loading: true,
      loadingFirstTime: true,
      error: false
    };
  },
  components: {
    Pagination: Pagination
  },
  mounted() {
    this.fetchPorts();
  },
  computed: {
    filteredPorts: function() {
      return this.ports.filter(port => this.containsSearch(this.filter, port));
    },
    sortedPorts: function() {
      if(this.currentSort === "") return this.filteredPorts;

      return [...this.filteredPorts].sort((a, b) => {
        let modifier = 1;
        if(this.currentSortDirection === 'desc') modifier = -1;
        if(a[this.currentSort] < b[this.currentSort]) return -1 * modifier;
        if(a[this.currentSort] > b[this.currentSort]) return 1 * modifier;
        return 0;
      });
    }
  },
  methods: {
    async fetchPorts(page = 1) {
      try {
        this.toggleLoading(true);

        const response = await PortsService.getPorts(page);
        const parsedResponse = JSON.parse(JSON.stringify(response.data));

        this.ports = parsedResponse.data;
        this.toggleLoading(false);

        const { current_page: responseCurrentPage, last_page: responseLastPage } = parsedResponse.meta;
        this.updatePagination(responseCurrentPage, responseLastPage);

        this.$nextTick(() => this.setStickyElementsPosition());
      } catch {
        this.error = true;
        this.toggleLoading(false);
      }
    },
    updatePagination(currentPage, lastPage) {
      if (this.currentPage === undefined || this.currentPage !== currentPage) {
        this.currentPage = currentPage;
      }
      if (this.lastPage === undefined || this.lastPage !== lastPage) {
        this.lastPage = lastPage;
      }

      this.$refs.pagination.setPage(this.currentPage, this.lastPage);
    },
    setStickyElementsPosition() {
      const header = document.querySelector("#header");
      const pagination = document.querySelector("#pagination");
      const tableHeaderColumns = document.querySelectorAll(".th-column");

      pagination.style.top = `${header.offsetHeight - 1}px`;
      [...tableHeaderColumns].forEach(column => column.style.top = `${pagination.offsetHeight + header.offsetHeight - 1}px`);
    },
    containsSearch(searchValue, port) {
      let normalizedValue = searchValue.toLowerCase();

      if (!!port.id && port.id.toString().includes(normalizedValue)) return true;
      if (!!port.name && port.name.toLowerCase().includes(normalizedValue)) return true;
      if (!!port.country && port.country.toLowerCase().includes(normalizedValue)) return true;
      if (!!port.continent && port.continent.toLowerCase().includes(normalizedValue)) return true;
      if (!!port.coordinates && port.coordinates.includes(normalizedValue)) return true;
      
      return false;
    },
    highlightMatches(text) {
      if(typeof text === "number") text = text.toString();
      if(!text) return '';

      const isMatch = text.toLowerCase().includes(this.filter.toLowerCase());
      if(!isMatch) return text;

      const regex = new RegExp(this.filter, 'ig');
      return text.replace(regex, matchedText => `<strong>${matchedText}</strong>`)
    },
    sortBy(column) {
      column = column.toLowerCase();

      if (column === this.currentSort) {
        this.currentSortDirection =
          this.currentSortDirection === 'asc'? 'desc' : 'asc';
      }

      this.currentSort = column;
    },
    isSortable(column) {
      return this.unsortableColumns.indexOf(column) === -1;
    },
    toggleLoading(value) {
      if(this.currentPage === undefined && this.lastPage === undefined & !!value){
        this.$emit("loading-first-time", value);
        this.loadingFirstTime = value;
      }

      let notLoadingAndNoError = !value && this.error !== true;
      if(notLoadingAndNoError) {
        this.loadingFirstTime = false;
        this.$emit("loading-first-time", false);
      }

      this.loading = value;
      this.$emit("loading", value);
    },
    resetFilters() {
      this.filter = "";
      this.currentSort = '';
      this.currentSortDirection = 'asc';
    }
  }
}
</script>

<style scoped lang="scss">
  @import "@/scss/components/_ports-table.scss";
</style>
