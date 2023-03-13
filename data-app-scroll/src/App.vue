<template>
  <div>
    <input type="text" placeholder="Search by name" v-model="search" />
    <button @click="completeData">Search</button>
    <button
      v-if="filteredItems.length"
      @click="(filteredItems = []), (search = '')"
    >
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
    <infinite-loading @infinite="infiniteHandler"></infinite-loading>
  </div>
</template>

<script>
import axios from "axios";
import CardComponent from "./components/CardComponent.vue";
import InfiniteLoading from "vue-infinite-loading";
import DeletePopup from "../../new-app/src/components/DeletePopup.vue";

// const api = `http://localhost:5000/comments?page=${this.page}&limit=${10}`;

export default {
  components: {
    InfiniteLoading,
    CardComponent,
    DeletePopup,
  },
  data() {
    return {
      page: 1,
      items: [],
      search: "",
      filteredItems: [],
      loading: false,
      deletePop: false,
      deleteId: "",
    };
  },
  methods: {
    infiniteHandler($state) {
      axios
        .get(`http://localhost:5000/comments?page=${this.page}&limit=${10}`)
        .then((data) => {
          console.log(data.data.data);
          if (data.data.data.length) {
            this.page += 1;
            this.items.push(...data.data.data);
            $state.loaded();
          } else {
            $state.complete();
          }
        });
    },
    async completeData() {
      this.loading = true;
      await fetch("http://localhost:5000/allcomments")
        .then((res) => res.json())
        .then((data) => {
          let filteredData = data.filter((ele) => {
            return ele.name
              .toLocaleLowerCase()
              .includes(this.search.toLocaleLowerCase());
          });
          this.filteredItems = filteredData;
          console.log(this.filteredItems, "filteredItems");
          this.loading = false;
        });
    },
    async deleteItem(_id) {
      this.loading = true;
      await axios.delete("http://localhost:5000/comments/" + _id);
      // this.items.splice(this.items.indexOf())
      this.items = this.items.filter((ele)=> {
        return ele._id !== _id;
      })
      this.loading = false;
      this.loading ? (this.deletePop = true) : (this.deletePop = false);
    },
    openDeletePopup(id) {
      this.deletePop = true;
      this.deleteId = id;
    },
    async editItem(_id, item) {
      this.loading = true;
      await axios.put("http://localhost:5000/comments/" + _id, item);
      this.items.filter((ele) => {
        if (ele._id === _id) {
          ele.name = item.name;
          ele.email = item.email;
          ele.text = item.text;
        }
      });
      this.loading = false;
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
