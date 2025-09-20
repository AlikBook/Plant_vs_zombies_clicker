<template>

    <div class="menu">
        
        <button @click="show_scores = true" class="scores_button"> Table of scores</button>
        <img class="logo" src="/images/Plants-Vs-Zombies-Logo-PNG-Photo-Image.png" alt="">

        <div class="user_buttons" v-if="logged_in==false">
            <button @click="showSignIn = true">Sign in</button>
            <button @click="showLogIn = true">Log in</button>
        </div>
        <div class="user_info" v-if="logged_in== true">
            <p >{{ user.username }}</p>
            <button @click="log_out">Log out</button>
        </div>
        

    </div>

    <div v-if="showSignIn" class="modal-overlay" @click="showSignIn = false">
        <div class="modal-content" @click.stop>
            <button class="close-btn" @click="showSignIn = false">&times;</button>
            <Sign_in></Sign_in>
        </div>
    </div>

    <div v-if="showLogIn" class="modal-overlay" @click="showLogIn = false">
        <div class="modal-content" @click.stop>
            <button class="close-btn" @click="showLogIn = false">&times;</button>
            <Log_in></Log_in>
        </div>
    </div>
    
    <div v-if="show_scores" class="modal-overlay">
        <div class="modal-content" @click.stop>
            <button class="close-btn" @click="show_scores = false">&times;</button>
            <Scores></Scores>

        </div>
        
    </div>



   

</template>

<script setup> 
import Sign_in from './Sign_in.vue';
import Log_in from './Log_in.vue';
import Scores from './Scores.vue';

import { useStore } from 'vuex';
import {computed, ref} from "vue"

const store = useStore()


let logged_in = computed(()=>store.state.Logged_in)
let user = computed(()=>store.state.user_info)

function log_out(){
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if(currentUser != null){
        localStorage.removeItem('currentUser')
        store.commit('set_log_out')
        window.location.reload();
    }
}

let showSignIn = ref(false)
let showLogIn = ref(false)
let show_scores = ref(false)
</script>

<style>
.menu{
    background-color: #326b2f;
    color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 70px;
    padding: 0 20px;
}

.logo{
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    height: 50px;
    width: auto;
}

.user_buttons, .user_info {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-left: auto;
}

.user_buttons button, .user_info button {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    background-color: #4CAF50;
    color: white;
    transition: background-color 0.3s;
}

.user_buttons button:hover, .user_info button:hover {
    background-color: #45a049;
}

.user_info p {
    margin: 0;
    font-weight: bold;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal-content {
    background: #923F0D;
    padding: 2rem;
    border-radius: 8px;
    min-width: 400px;
    position: relative;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border: 5px solid #AC703D;
    color: white;
}

.close-btn {
    position: absolute;
    top: 10px;
    right: 15px;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: red;
}


.scores_button{
    background: #923F0D;
    color: white;
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
    cursor: pointer;
}

.scores_button:hover{
    background: #6f310a;
}




</style>