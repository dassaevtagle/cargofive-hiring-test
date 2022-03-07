<template>
  <nav v-if="!loadingFirstTime" class="pagination is-right sticky has-background-primary-light mb-0 p-2" role="navigation" id="pagination">
    <a :class="['pagination-previous pagination-arrow', {'is-disabled': !hasPreviousPage}]" @click="goTo(currentPage-1)">
      <span class="is-rounded icon is-small has-text-dark">
        <i class="fas fa-angle-left" aria-hidden="true"></i>
      </span>
    </a>
    <a :class="['pagination-next pagination-arrow', {'is-disabled': !hasNextPage}]" @click="goTo(currentPage+1)">
      <span class="is-rounded icon is-small has-text-dark">
        <i class="fas fa-angle-right" aria-hidden="true"></i>
      </span>
    </a>
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
  <nav v-else class="pagination is-right sticky has-background-primary-light mb-0 p-2" id="pagination">
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

.pagination-link.is-current {
  background-color: #549f936b;
  border: none;
  color: black;
}
.pagination-link{
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  &:hover{
    background-color: #549f9338;
    border: none;
  }
}

.is-disabled{
  background-color:#bfbebe;
  opacity: 0.7;
  &:hover{
    cursor: default;
  }
}

.pagination-arrow{
  border-radius: 20px;
  &:hover{
    background-color: #549f9338;
    border: none;
  } 
}
</style>