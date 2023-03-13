<template>
   <header>
  <!-- Hacker News header -->
</header>

<div v-for="(item, $index) in list" :key="$index">
  <!-- Hacker News item loop -->
</div>

<infinite-loading @infinite="infiniteHandler"></infinite-loading>
  </template>
  
  <!-- <script setup>
  import { ref, onMounted, computed } from "vue";
  import CardComponent from "./components/CardComponent.vue";
  
  const items = ref([]);
  const loading = ref(false);
  const page = ref(1);
  const totalPages = ref(0);
  const currentPage = ref(1);
  const visiblePages = ref([]);
  
  const getData = (page) => {
    loading.value = true;
    fetch(`http://localhost:5000/comments?page=${page}&limit=${10}`)
      .then((res) => res.json())
      .then((data) => {
        items.value = data.data;
        loading.value = false;
        totalPages.value = data.totalPages;
        currentPage.value = page;
        visiblePages.value = getVisiblePages();
      });
  };
  
  const getVisiblePages = () => {
    const range = 2;
    const start = Math.max(2, currentPage.value - range);
    const end = Math.min(totalPages.value - 1, currentPage.value + range);
    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };
  
  const goToPage = (page) => {
    if (page < 1 || page > totalPages.value || page === currentPage.value) {
      return;
    }
    getData(page);
  };
  
  const previousPage = () => {
    goToPage(currentPage.value - 1);
  };
  
  const nextPage = () => {
    goToPage(currentPage.value + 1);
  };
  
  const showFirstDots = computed(() => visiblePages.value[0] > 2);
  const showLastDots = computed(() => visiblePages.value[visiblePages.value.length - 1] < totalPages.value - 1);
  
  onMounted(() => {
    getData(page.value);
  });
  </script> -->
  <script>
import axios from 'axios';

const api = '//hn.algolia.com/api/v1/search_by_date?tags=story';

export default {
  data() {
    return {
      page: 1,
      list: [],
    };
  },
  methods: {
    infiniteHandler($state) {
      axios.get(api, {
        params: {
          page: this.page,
        },
      }).then(({ data }) => {
        if (data.hits.length) {
          this.page += 1;
          this.list.push(...data.hits);
          $state.loaded();
        } else {
          $state.complete();
        }
      });
    },
  },
};
</script>
  
  <style>
  * {
    margin: 7px;
  }
  .pagination {
    display: flex;
    justify-content: center;
    margin-top: 1rem;
  }
  
  .pagination button {
    margin: 0 0.5rem;
  }
  
  .active {
    background-color: #ccc;
  }
  .spinner-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #4285f4;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    animation: spin 0.8s linear infinite;
  }
  
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  </style>
  