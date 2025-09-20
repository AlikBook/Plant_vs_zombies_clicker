<template>
  <Menu></Menu>

  <Home></Home>
</template>

<script setup>
import { compile, onMounted,computed } from 'vue';
import { useStore } from 'vuex';
import Menu from './components/Menu.vue';
import Home from './views/Home.vue'

const store = useStore();


onMounted(() => {
  const savedUser = localStorage.getItem('currentUser');
  const users = JSON.parse(localStorage.getItem("users")) || [];
  store.commit("update_list_of_users", users);
  
  if (savedUser!= null) {
    try {
      const user = JSON.parse(savedUser);
      store.commit('set_logged_in');
      store.commit('set_user_info', user);
    } catch (error) {
      console.error('Error restoring user session:', error);
      localStorage.removeItem('currentUser'); 
    }
  }
});

</script>
