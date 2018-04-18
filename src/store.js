import Vue from 'vue';
import Vuex from 'vuex';

import axios from 'axios';

Vue.use(Vuex);

const getAuthHeader = () => {
   return { headers: {'Authorization': localStorage.getItem('token')}};
}

export default new Vuex.Store({
  state: {
    user: {},
    token: '',
    loginError: '',
    registerError: '',
    list: [],
  },
  getters: {
    user: state => state.user,
    getToken: state => state.token,
    loggedIn: state => {
      if (state.token === '')
       return false;
      return true;
    },
    loginError: state => state.loginError,
    registerError: state => state.registerError,
    list: state => state.list,
  },
  mutations: {
    setUser (state, user) {
      state.user = user;
    },
    setToken (state, token) {
     state.token = token;
      if (token === '')
       localStorage.removeItem('token');
      else
       localStorage.setItem('token', token)
    },
    setLoginError (state, message) {
      state.loginError = message;
    },
    setRegisterError (state, message) {
      state.registerError = message;
    },
    setList (state, list) {
      state.list = list;
    },
  },
  actions: {
  	// Registration, Login //
    register(context,user) {
      axios.post("/api/users",user).then(response => {
	context.commit('setUser', response.data.user);
	context.commit('setToken',response.data.token);
	context.commit('setRegisterError',"");
	context.commit('setLoginError',"");
      }).catch(error => {
	context.commit('setLoginError',"");
	context.commit('setUser',{});   
  context.commit('setToken','');
	if (error.response) {
	  if (error.response.status === 403)
	    context.commit('setRegisterError',"That email address already has an account.");
	  else if (error.response.status === 409)
	    context.commit('setRegisterError',"That user name is already taken.");
	  return;
	}
	context.commit('setRegisterError',"Sorry, your request failed. We will look into it.");
      });
    },
    login(context,user) {
      return axios.post("/api/login",user).then(response => {
	context.commit('setUser', response.data.user);
	context.commit('setToken',response.data.token);
	context.commit('setRegisterError',"");
	context.commit('setLoginError',"");
      }).catch(error => {
        context.commit('setUser',{});
        context.commit('setToken','');
	      context.commit('setRegisterError',"");
	if (error.response) {
	  if (error.response.status === 403 || error.response.status === 400)
	    context.commit('setLoginError',"Invalid login.");
	  context.commit('setRegisterError',"");
	  return;
	}
	context.commit('setLoginError',"Sorry, your request failed. We will look into it.");
      });
    },
    logout(context,user) {
      context.commit('setUser', {});
      context.commit('setToken','');
    },
    // See homework list //
    getList(context) {
      axios.get("/api/users/" + context.state.user.id + "/assignments").then(response => {
	context.commit('setList',response.data.assignments);
      }).catch(err => {
	console.log("getList failed:",err);
      });
    },
    addAssignment(context, title, details, priority, duedate) {
      let item = {title: title, details: details, priority: priority, duedate: duedate};
      axios.post("/api/users/" + context.state.user.id + "/assignments",item, getAuthHeader()).then(response => {
	return context.dispatch('getList');
      }).catch(err => {
	console.log("addAssignment failed:",err);
      });
    },
    deleteAssignment(context, assignment_id) {
      console.log('Store.js id: ');
      console.log(assignment_id);
      axios.delete("/api/users/" + context.state.user.id + "/assignments/" + assignment_id, getAuthHeader()).then(response => {
  return context.dispatch('getList');
      }).catch(err => {
  console.log("deleteAssignment failed:",err);
      });
    },
    // Initialize //
    initialize(context) {
      let token = localStorage.getItem('token');
      if(token) {
       // see if we can use the token to get my user account
       axios.get("/api/me",getAuthHeader()).then(response => {
         context.commit('setToken',token);
         context.commit('setUser',response.data.user);
       }).catch(err => {
         // remove token and user from state
         localStorage.removeItem('token');
         context.commit('setUser',{}); 
         context.commit('setToken','');
       });
     }
    },
  }
});