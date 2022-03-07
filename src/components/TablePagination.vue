<template>
  <nav v-if="!loadingFirstTime" class="pagination is-right sticky has-background-primary-light mb-0" role="navigation" id="pagination">
    <a :class="['pagination-previous', {'is-disabled': !hasPreviousPage}]" @click="goTo(currentPage-1)">Previous</a>
    <a :class="['pagination-next', {'is-disabled': !hasNextPage}]" @click="goTo(currentPage+1)">Next page</a>
    <ul v-if="lastPage <= 7" class="pagination-list">
      <li v-for="index in lastPage" :key="index">
        <a 
          :class="['pagination-link', {'is-current': index === currentPage}]"
          @click="goTo(index)"
        >{{index}}</a>
      </li>
    </ul>
    <ul v-else-if="currentPage < 5" class="pagination-list">
      <li v-for="index in 5" :key="index">
        <a :class="['pagination-link', {'is-current': index === currentPage}]" @click="goTo(index)">{{index}}</a>
      </li>
      <li>
        <span class="pagination-ellipsis">&hellip;</span>
      </li>
      <li>
        <a class="pagination-link" @click="goTo(lastPage)">{{lastPage}}</a>
      </li>
    </ul>
    <ul v-else-if="currentPage > (lastPage - 4)" class="pagination-list">
      <li>
        <a class="pagination-link" @click="goTo(1)">1</a>
      </li>
      <li>
        <span class="pagination-ellipsis">&hellip;</span>
      </li>
      <li v-for="index in lastFivePages" :key="index">
        <a :class="['pagination-link', {'is-current': index === currentPage}]" @click="goTo(index)">{{index}}</a>
      </li>
    </ul>
    <ul v-else class="pagination-list">
      <li>
        <a class="pagination-link" @click="goTo(1)">1</a>
      </li>
      <li>
        <span class="pagination-ellipsis">&hellip;</span>
      </li>
      <li>
        <a class="pagination-link" @click="goTo(currentPage - 1)">{{currentPage - 1}}</a>
      </li>
      <li>
        <a class="pagination-link is-current" @click="goTo(currentPage)">{{currentPage}}</a>
      </li>
      <li>
        <a class="pagination-link" @click="goTo(currentPage + 1)">{{currentPage + 1}}</a>
      </li>
      <li>
        <span class="pagination-ellipsis">&hellip;</span>
      </li>
      <li>
        <a class="pagination-link" @click="goTo(lastPage)">{{lastPage}}</a>
      </li>
    </ul>
  </nav>
  <nav v-else class="pagination is-right sticky has-background-primary-light mb-0" id="pagination">
    <a class="pagination-link skeleton"><div></div></a>
    <a class="pagination-link skeleton"><div></div></a>
    <ul class="pagination-list">
      <li v-for="index in 7" :key="index">
        <a class="pagination-link skeleton"><div></div></a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      currentPage: 0,
      lastPage: 0,
      loadingFirstTime: true
    };
  },
  created() {
    this.setListeners();
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
    goTo(page) {
      if(page === 0 || page > this.lastPage || page === this.currentPage) return "";
      this.$emit("goto", page);
    },
    setPage(page, lastPage) {
      this.currentPage = page;
      this.lastPage = lastPage;
    },
    setListeners() {
      this.$parent.$on('loading-first-time', value => this.loadingFirstTime = value);
    }
  }
}
</script>

<style lang="scss" scoped>
.skeleton div{
  background-color: #e7e7e7;
  border-radius: 20px;
  height: 15px;
  width: 15px;
}
.skeleton.pagination-link {
  border: none;
}
</style>