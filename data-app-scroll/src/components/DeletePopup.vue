<template>
    <div class="modal-mask" v-if="show">
      <div class="modal-wrapper">
        <div class="loading-bar" v-if="loading">
          <div class="progress"></div>
        </div>
        <div class="modal-container">
          <div class="modal-header">
            <h3>Confirm Delete</h3>
            <button class="close-btn" @click="close" style="color: gray">
              X
            </button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete?</p>
          </div>
          <div class="modal-footer">
            <button
              class="cancel-btn"
              @click="close"
              style="
                color: grey;
                color: grey;
                border: 2px solid gray;
                cursor: default;
              "
            >
              Cancel
            </button>
            <button
              class="delete-btn"
              @click="deleteUser"
              :disabled="loading"
              :style="active"
            >
              {{ loading ? "Deleting.." : "Delete" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "ConfirmDeleteModal",
    props: ["show", "loading"],
  
    methods: {
      close() {
        this.$emit("close");
      },
      deleteUser() {
        this.$emit("delete-confirmed", this._id);
      },
    },
    computed: {
      active() {
        if (!this.loading) {
          return {
            color: "white",
            backgroundColor: "rgb(110, 121, 214)",
            marginLeft: "10px",
            cursor: "default",
          };
        } else {
          return {
            color: "white",
            backgroundColor: "gray",
            marginLeft: "10px",
            cursor: "default",
          };
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.187);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  @keyframes drop {
    0% {
      transform: translateY(-100%);
      opacity: 0;
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }
  .modal-wrapper {
    animation-name: drop;
    animation-duration: 0.3s;
    animation-timing-function: ease-in-out;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    width: 350px;
  }
  
  .modal-container {
    padding: 20px;
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 10px;
    border-bottom: 1px solid #ddd;
  }
  
  .modal-header h3 {
    margin: 0;
  }
  
  .close-btn {
    background: none;
    border: none;
    font-size: 18px;
    /* cursor: pointer; */
  }
  
  .modal-body {
    padding: 20px 0;
    text-align: center;
  }
  
  .modal-footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-top: 10px;
    border-top: 1px solid #ddd;
  }
  
  .modal-footer button {
    background: none;
    border: none;
    font-size: 14px;
    font-weight: bold;
    padding: 10px 20px;
    cursor: pointer;
  }
  .loading-bar {
    width: 100%;
    /* height: 4px; */
    background-color: #ddd;
    position: relative;
  }
  
  .progress {
    position: absolute;
    top: 0;
    left: 0;
    height: 4px;
    background-color: #4caf50;
    animation: loading 1s ease-in-out;
  }
  
  @keyframes loading {
    0% {
      width: 0;
    }
    50% {
      width: 50%;
    }
    100% {
      width: 100%;
    }
  }
  </style>
  