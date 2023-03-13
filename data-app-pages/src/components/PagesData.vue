<template>
    <div>
      <input type="text" placeholder="Search by name" v-model="search" />
      <button @click="completeData">Search</button>
      <button v-if="filteredItems.length" @click="closeSearch">
        {{ "Search result " + filteredItems.length + " X" }}
      </button>
      <div v-if="!filteredItems.length">
        <card-component
          v-for="item in items"
          :key="item._id"
          :date="item.date"
          :email="item.email"
          :movie_id="item.movie_id"
          :name="item.name"
          :text="item.text"
          :_id="item._id"
          @delete-item="openDeletePopup(item._id)"
          @edit-item="editItem(item._id, $event)"
        />
        <delete-popup
          v-if="loading || deletePop"
          :show="deletePop"
          :loading="loading"
          @delete-confirmed="deleteItem(deleteId)"
          @close="deletePop = false"
        />
      </div>
      <div v-else>
        <card-component
          v-for="item in filteredItems"
          :key="item._id"
          :date="item.date"
          :email="item.email"
          :movie_id="item.movie_id"
          :name="item.name"
          :text="item.text"
          :_id="item._id"
          @delete-item="openDeletePopup(item._id)"
          @edit-item="editItem(item._id, $event)"
        />
        <delete-popup
          v-if="deletePop"
          :show="deletePop"
          :loading="loading"
          @delete-confirmed="deleteItem(deleteId)"
          @close="deletePop = false"
        />
      </div>
      <div class="spinner-container" v-if="loading">
        <div class="spinner"></div>
      </div>
      <div class="pagination">
        <button :disabled="currentPage === 1" @click="previousPage">
          Previous
        </button>
        <button v-if="showFirstDots" @click="goToPage(1)">1</button>
        <button v-if="showFirstDots" disabled>...</button>
        <button
          v-for="pageNumber in visiblePages"
          :key="pageNumber"
          :class="{ active: pageNumber === currentPage }"
          @click="goToPage(pageNumber)"
        >
          {{ pageNumber }}
        </button>
        <button v-if="showLastDots" disabled>...</button>
        <button v-if="showLastDots" @click="goToPage(totalPages)">
          {{ totalPages }}
        </button>
        <button :disabled="currentPage === totalPages" @click="nextPage">
          Next
        </button>
      </div>
    </div>
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
  <script setup>
  import axios from "axios";
  import { ref, onMounted, watch, computed } from "vue";
  import DeletePopup from "./DeletePopup.vue";
  import CardComponent from "./CardComponent.vue";
  
  const items = ref([]);
  const loading = ref(false);
  const page = ref(1);
  const totalPages = ref(0);
  const currentPage = ref(1);
  const visiblePages = ref([]);
  const search = ref("");
  const filteredItems = ref([]);
  const deletePop = ref(false);
  const deleteId = ref("");
  
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
  
  const closeSearch = () => {
    filteredItems.value = [];
    search.value = "";
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
  const completeData = async () => {
    loading.value = true;
    await fetch("http://localhost:5000/allcomments")
      .then((res) => res.json())
      .then((data) => {
        let filteredData = data.filter((ele) => {
          return ele.name
            .toLocaleLowerCase()
            .includes(search.value.toLocaleLowerCase());
        });
        filteredItems.value = filteredData;
        console.log(filteredItems.value, "filteredItems");
        loading.value = false;
      });
  };
  const showLastDots = computed(
    () => visiblePages.value[visiblePages.value.length - 1] < totalPages.value - 1
  );
  
  watch(currentPage, (newValue, oldValue) => {
    console.log(newValue, oldValue);
    visiblePages.value = getVisiblePages();
  });
  
  const deleteItem = async (_id) => {
    await axios.delete("http://localhost:5000/comments/" + _id);
    getData(currentPage.value);
    !loading.value ? deletePop.value = true : deletePop.value = false;
  };
  const editItem = async (_id, item) => {
    await axios.put("http://localhost:5000/comments/" + _id, item);
    getData(currentPage.value);
  };
  const openDeletePopup = (id) => {
    deletePop.value = true;
    deleteId.value = id;
  };
  
  onMounted(() => {
    getData(page.value);
  });
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
  