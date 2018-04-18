<template>
  <div class="list">
    <div>
      <p>Add an Assignment</p>
      <form v-on:submit.prevent="addAssignment" class="assignmentForm">
         <label for="title">Title:</label><br/>
         <input v-model="title" placeholder=""/><br/>
         <div id="select">
            <label for="priority">Priority:</label><br/>
            <select v-model="priority" name="selectPriority">
              <option value="" disabled selected>Select a priority</option>
              <option value=0>None</option>
              <option value=1>Low</option>
              <option value=2>High</option>
            </select>
         </div>
         <label for="duedate">Duedate:</label><br/>
         <input type="date" :value="duedate && duedate.toISOString().split('T')[0]"
                             @input="duedate = $event.target.valueAsDate"> <br/>
         <label for="details">Description:</label>
         <textarea v-model="details" placeholder=""/><br/>
        	<div class="buttonWrap">
        	  <button class="primary" type="submit">Add</button>
        	</div>
      </form>
    </div>
    <div v-for="item in list" class="item">
      <div v-bind:class="{ red: isOverdue(item.duedate) }">
      <p class="addAssignment">{{item.title}}<br>{{item.details}}<br>{{item.priority | prioritize}}<br>{{item.duedate}}</p>
      <button v-on:click="deleteAssignment(item.id)" class="delete">X</button>
      </div>
    </div>
  </div>
</template>

<script>
 import moment from 'moment';
 export default {
   name: 'UserList',
   data () {
     return {
       title: '',
       details: '',
       priority: '',
       duedate: '',
     }
   },
   filters: {
     prioritize: function(priority) {
       if(priority === 0){
         return 'None';
       }
       else if(priority === 1){
         return 'Low';
       }
       else if(priority === 2){
         return 'High';
       }
     },
   },
   created: function() {
     this.$store.dispatch('getList');
   },
   computed: {
     list: function() {
       return this.$store.getters.list;
     },
   },
   methods: {
     isOverdue: function(duedate) {

        var currentTime = new Date().toISOString();
        var compare = duedate.localeCompare(currentTime);
        if(compare < 0){
          return true;
        }
        else{
          return false;
        }
     },
     deleteAssignment: function(item_id) {
          this.$store.dispatch('deleteAssignment', item_id)
     },
     addAssignment: function() {
       this.$store.dispatch('addAssignment',{
         title: this.title,
         details: this.details,
         priority: this.priority,
         duedate: this.duedate,
       }).then(useless => {
   this.title = "";
   this.details = "";
   this.priority = "";
   this.duedate = "";
       });
     },
   }
 }
</script>

<style scoped>
 .list {
     width: 600px;
 }
 .assignmentForm {
     background: #eee;
     padding: 10px;
     margin-bottom: 10px;
 }
 .buttonWrap {
     width: 100%;
     display: flex;
 }
 button {
     margin-left: auto;
     height: 2em;
     font-size: 0.9em;
     margin: 1vw;
 }
 textarea {
     width: 100%;
     height: 5em;
     padding: 2px;
     margin-bottom: 5px;
     resize: none;
     box-sizing: border-box;
 }
 .item {
     border-bottom: 1px solid #ddd;
     padding: 10px;
 }
 .addAssignment {
     margin-top: 0px;
 }
 .idline {
     margin-bottom: 0px;
 }
 .user {
     font-weight: bold;
     margin-right: 10px;
 }
 .handle {
     margin-right: 10px;
     color: #666;
 }
 .time {
     float: right;
     color: #666;
 }
 .red {
     background-color: red;
 }
</style>