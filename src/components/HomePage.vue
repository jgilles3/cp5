<template>
  <div>
    <div v-if="loggedIn">
      <user-list/>
    </div>
    <div v-else>
      <welcome-page/>
    </div>
  </div>
</template>

<script>
 import WelcomePage from './WelcomePage';
 import UserList from './UserList';
 export default {
   name: 'HomePage',
   components: {WelcomePage,UserList},
   computed: {
     loggedIn: function() {
       return this.$store.getters.loggedIn;
     },
   },
 }
</script>

<style scoped>
</style>