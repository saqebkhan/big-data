<template>
  <div>
    <div class="card">
      <div class="card-header">
        <div class="d-flex justify-content-between align-items-center">
          <span>{{ formatDate(date) }}</span>

          <p @click="openDD = !openDD" class="three-dots">...</p>
          <div
            class="dropdown-menu dropdown-menu-right"
            v-if="openDD"
            style="float: right"
          >
            <p
              @click="editItem"
              style="
                font-size: small;
                font-weight: lighter;
                background-color: bisque;
                margin: 0;
                padding: 7px;
                cursor: pointer;
              "
            >
              Edit
            </p>
            <p
              @click="deleteItem"
              style="
                font-size: small;
                font-weight: lighter;
                background-color: bisque;
                margin: 0;
                padding: 7px;
                cursor: pointer;
              "
            >
              Delete
            </p>
          </div>
        </div>
      </div>
      <div class="card-body">
        <h5 class="card-title">{{ name }}</h5>
        <p class="card-text">{{ text }}</p>
        <p class="card-text">{{ email }}</p>
        <p class="card-text">{{ movie_id }}</p>
      </div>
    </div>
    <form action="" v-if="openEditor" @submit.prevent="updateItem" class="card">
      <input type="text" placeholder="Name" v-model="editObj.name" />
      <input type="text" placeholder="Email" v-model="editObj.email" />
      <input type="text" placeholder="Description" v-model="editObj.text" />
      <button type="submit">Edit</button>
      <button type="default" @click="cancelEdit">Cancel</button>
    </form>
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "CardComponent",
  data() {
    return {
      openDD: false,
      openEditor: false,
    };
  },
  props: {
    date: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    movie_id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    _id: {
      type: String,
      required: true,
    },
  },
  computed: {
    editObj() {
      return {
        name: this.name,
        email: this.email,
        text: this.text,
      };
    },
  },
  methods: {
    formatDate(date) {
      // use moment.js or any other date library to format the date
      return moment(date).format("MMMM Do YYYY, h:mm:ss a");
    },
    deleteItem() {
      this.$emit("delete-item");
      this.openDD = false;
    },
    editItem() {
      this.openEditor = true;
      this.openDD = false;
    },
    updateItem() {
      this.$emit("edit-item", this.editObj);
      this.openEditor = false;
      this.editObj = {
        name: "",
        email: "",
        text: "",
        date: new Date(),
      };
    },
    cancelEdit() {
      this.editObj = {
        name: "",
        email: "",
        text: "",
        date: new Date(),
      };
      this.openEditor = false;
    },
  },
};
</script>

<style scoped>
/* input{
  display: block;
} */
.card {
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}
.card-header {
  background-color: #f7f7f7;
  padding: 10px;
  font-weight: bold;
}
.card-body {
  padding: 10px;
}
.card-title {
  margin-bottom: 5px;
  font-size: 18px;
  font-weight: bold;
}
.card-text {
  margin-bottom: 5px;
  font-size: 14px;
}
.three-dots {
  float: right;
  cursor: pointer;
  width: 20px;
  height: 19px;
  text-align: center;
  border-radius: 1px;
  margin: -6px;
}
.three-dots:hover {
  background: rgb(182, 182, 182);
  color: rgb(255, 255, 255);
}
</style>
