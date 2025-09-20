<template>
    <div class="Log_in_form">
        <h1>Login</h1>
        <label for="username">Username</label>
        <input type="text" name="username" placeholder="Enter your username" v-model="user_name">
        <label for="password">Password</label>
        <input type="password" name="password" placeholder="Enter your password" v-model="password">
        <button @click="log_in">Log in</button>
        <p>{{ message }}</p>
    </div>
</template>

<script setup>
    import { useStore } from 'vuex';
    import {computed, ref} from 'vue';

    const store = useStore();

    let message = ref("")

    //user information
    let user_name = ref("");
    let password = ref("")
    

    let user = ref()
    let user_found = ref(false)

    function log_in(){
        let users = JSON.parse(localStorage.getItem('users')) || [];
        
        
        for(let item of users){
            if(item.username == user_name.value){
                user.value = item;
                user_found.value = true;
                break;
            }
        }
        if(user_found.value){
            if(user.value.password == password.value){
                store.commit("set_logged_in")
                message.value = "Succesfully logged in"
                store.commit("set_user_info", user.value)
                localStorage.setItem('currentUser', JSON.stringify(user.value));
                
            }
            else{
                message.value = "Incorrect Password"
            }
        }else{
            message.value = "No user found"
        }
    }
</script>

<style>
    .Log_in_form{
        display: flex;
        flex-direction: column;
        gap: 5px;
    }
    .Log_in_form button{
        margin-top: 5px;
    }

    .Log_in_form input{
        height: 20px;
        border: none;
        border-radius: 5px;
        padding-left: 5px;
        padding-right: 5px;
    }

    .Log_in_form input:focus{
        border: none;
        outline: none;
    }

    .Log_in_form button{
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        background-color: #4CAF50;
        color: white;
        transition: background-color 0.3s;
    }
    .Log_in_form button:hover{
        background-color: #45a049;
    }
</style>