<template>
  <div id="app" class="app-container">
    <!-- <Sidebar /> -->
    <div class="sidebar" :class="{ 'collapsed': isCollapsed }">
      <button class="toggle-button" @click="toggleSidebar">
        {{ isCollapsed ? '▶' : '◀' }} <!-- Use symbols for toggle -->
      </button>
      <div v-if="!isCollapsed">
        <h2>Bryan Workspace</h2>
        <ul>
          <li><a @click="changeMode('home')">Home</a></li>
          <li><a @click="changeMode('plan')">Plan</a></li>
          <li><a @click="changeMode('important_image')">Important Image</a></li>
        </ul>
      </div>
    </div>
    <div class="content">
      <Home v-if="mode == 'home'" />
      <Plan v-if="mode == 'plan'" />
      <ImportantImage v-if="mode == 'important_image'" />
    </div>
  </div>
</template>

<script>
  import Home from "./components/Home.vue"
  import Plan from "./components/Plan.vue"
  import ImportantImage from "./components/ImportantImage.vue"

  export default {
    name: 'App',
    components: {
      Home,
      Plan,
      ImportantImage
    },
    data() {
      return {
        mode: 'home',
        isCollapsed: false
      }
    },
    methods: {
        toggleSidebar() {
          this.isCollapsed = !this.isCollapsed; // Toggle the state
        },
        changeMode(mode) {
          this.mode = mode;
        }
      }
  };
</script>

<style>
  body {
    margin: 0;
    font-family: Arial, sans-serif;
  }
  .app-container {
    display: flex;
    height: auto; /* Allow height to adjust based on content */
    min-height: 100vh; /* Ensure it takes at least the full viewport height */
    background-color: #1a1a1a;
    color: white;
  }
  .content {
    padding: 20px;
    background-color: #222;
    color: white;
    flex: 1; /* Allow it to grow and fill the space */
  }
  .sidebar {
    width: 250px;
    background-color: #333;
    color: white;
    padding: 20px;
    transition: width 0.3s; /* Smooth transition for width */
  }
  
  .sidebar.collapsed {
    width: 50px; /* Width when collapsed */
  }
  
  .toggle-button {
    background: none;
    border: none;
    color: white;
    font-size: 20px;
    cursor: pointer;
    margin-bottom: 10px;
  }
  
  .sidebar h2 {
    color: #fff;
  }
  
  .sidebar ul {
    list-style-type: none;
    padding: 0;
  }
  
  .sidebar ul li {
    margin: 15px 0;
  }
  
  .sidebar ul li a {
    color: #fff;
    text-decoration: none;
  }
  
  .sidebar ul li a:hover {
    text-decoration: underline;
  }
</style>