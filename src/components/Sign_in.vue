<template>
    <div class="Sign_in_form">
        <h1>Sign in</h1>
        <label for="username">Username </label>
        <input type="text" name="username" id="" v-model="name" placeholder="Enter a username">
        <label for="password">Password</label>
        <input type="password" name="password" id="" v-model="password" required="true" placeholder="Enter a password">
        <button @click="save_user">Create user</button>
    </div>
    
    <p>{{ message }}</p>
</template>

<script setup>

import { useStore } from 'vuex';
import { computed, ref } from 'vue';

const store = useStore()

const score = computed(()=> store.state.cookies )

const users_count = computed(()=> store.state.user_count)


let name = ref("")
let password = ref("")

let message = ref("")
function save_user(){

    let users = JSON.parse(localStorage.getItem('users')) || [];


    const user_info = {
        id: users.length,
        username: name.value,
        password : password.value,
        saved_file : {}
    }
    for(let single_user of users){
        if (single_user.username == user_info.username){
            message.value= "This username already exists use another one"
            return
        }

    }
    users.push(user_info);
    try {
        localStorage.setItem('users', JSON.stringify(users));
        store.commit('increase_number_of_users')
        
        
        store.commit("set_logged_in")
        store.commit("set_user_info", user_info)
        localStorage.setItem('currentUser', JSON.stringify(user_info));
        message.value = "Account created succesfully"

        
        name.value = ""
        password.value= ""
        

    } catch (error) {
        console.log(error.message)
    }



}


</script>

<style>
    .Sign_in_form{
        display: flex;
        flex-direction: column;
        gap: 5px;
    }
    .Sign_in_form button{
        margin-top: 5px;
    }

    .Sign_in_form input{
        height: 20px;
        border: none;
        border-radius: 5px;
        padding-left: 5px;
        padding-right: 5px;
    }

    .Sign_in_form input:focus{
        border: none;
        outline: none;

    }

    .Sign_in_form button{
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        background-color: #4CAF50;
        color: white;
        transition: background-color 0.3s;
    }
    .Sign_in_form button:hover{
        background-color: #45a049;

    }


</style>