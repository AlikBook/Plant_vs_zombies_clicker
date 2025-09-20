<template>
    <div class="game-container">
        <div class="main-layout">
            <div class="center-section">
                <h2>Collect Suns !</h2>
                <div class="sun-container">
                    <img class="sun-image" src="/images/sun.webp" alt="Sun" @click="()=>store.commit('increment_cookies')">
                </div>
                <h2>You have: {{ my_cookie }} Suns</h2>

                <div class="game-controls">
                    <button @click="save_game">Save game</button>
                    <button @click="load_game">Load game</button>
                </div>
            </div>

            
            <div class="right-section">
                <div class="game-info">
                    <h3>Game Stats</h3>
                    <p>Time: {{ time }}s</p>
                    <p>Suns per minute: {{ Number(average_of_cookie).toFixed(1) }}</p>
                    <div class="game-info-Sun-multi">
                        <p>Sun Multiplier : X{{ my_multiplier}}</p>
                        <img src="/images/sun.webp" alt="Sun" >

                    </div>
                    <div v-if="my_autoclick_activate" class="game-info-Suns-per-s">
                        <p>Suns/Second : X{{ Autoclick_muliplier }}</p>
                        <img src="/images/Girasol.webp" alt="Sunflower Generator" >
                    </div>
                    <div v-if="my_autoclick_activate" class="game-info-production-speed">
                        <p>Production Speed : {{ (1500 / my_production_speed).toFixed(1) }}/s</p>
                        <img src="/images/HD_Twin_Sunflower.webp" alt="Twin Sunflower" >
                    </div>

                </div>

                <div class="store-section">
                    <h3>Store</h3>
                    <div class="sun_multiplier_button">
                        <p>Sun Multiplier</p>
                        <img src="/images/sun.webp" alt="Sun" >
                        <button @click="store.commit('increment_multiplier')">Buy</button>
                    </div>
                    <p>Price: {{ my_click_mulitplier_price}} <img src="/images/sun.webp" alt="Sun" > </p>
                    
                    

                    <div class="auto-production">
                        <div class="sun_multiplier_button">
                            <p v-if="!my_autoclick_activate">Automatic production</p>
                            <p v-if="my_autoclick_activate">Improve autoclick</p>
                            <img src="/images/Girasol.webp" alt="Sunflower Generator" >
                            <button @click="store.commit('buy_automatic_production')" v-if="!my_autoclick_activate">Buy</button>
                            <button @click="store.commit('increment_auto_cookies_multiplier')" v-if="my_autoclick_activate">Upgrade</button>
                        </div>
                        <p>Price: {{ my_automatic_production_price }} <img src="/images/sun.webp" alt="Sun" ></p>
                        
                        <div class="sun_multiplier_button" v-if="my_autoclick_activate">
                            <p>Increase Production Speed</p>
                            <img src="/images/HD_Twin_Sunflower.webp" alt="Twin Sunflower" >
                            <button @click="store.dispatch('upgrade_production_speed')">Upgrade</button>
                        </div>
                        <p v-if="my_autoclick_activate">Price: {{ my_production_speed_cost }} <img src="/images/sun.webp" alt="Sun" ></p>
                    </div>
                </div>

                <div class="achievement-section">
                    <h3>Achievements</h3>
                    <p>Next Objective: {{ my_achievement_limit }}</p>
                    <div v-if="my_achievement">
                        <p>You reached {{ my_achievement_limit/10 }} suns</p>
                    </div>
                </div>

                
            </div>
        </div>

        <div v-if="my_achievement" class="achievement-popup">
            <div class="achievement-content">
                <button class="achievement-close-btn" @click="store.commit('deactivate_achievement')">&times;</button>
                <h2>🏆 Achievement Unlocked! 🏆</h2>
                <p>You reached {{ my_achievement_limit/10 }} suns!</p>
                <p>Keep collecting!</p>
            </div>
        </div>        
    </div>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex'
import {ref} from 'vue'

let time = ref(0)


const store = useStore()

//single click
const my_cookie = computed(() => store.state.cookies)
const my_multiplier = computed(() => store.state.cookie_multiplier)
const my_click_mulitplier_price = computed(() => store.state.click_mulitplier_price)

//Autoclick
const my_automatic_production_price = computed(()=> store.state.auto_click_price)
const my_autoclick_activate = computed(()=> store.state.activate_autoclick)
const show_buy_autoclick = computed(()=>store.state.show_auto_click_button)
const Autoclick_muliplier = computed(()=> store.state.auto_click_multiplier)

//Production Speed
const my_production_speed = computed(()=> store.state.production_speed)
const my_production_speed_cost = computed(()=> store.state.production_speed_cost)

//Achievement
const my_achievement = computed(()=> store.state.display_message)
const my_achievement_limit = computed(()=> store.state.achievement_limit)

//Statistics
const average_of_cookie = computed(()=> store.state.cookie_per_minute)

//Save_game
let logged_in = computed(()=>store.state.Logged_in)
let user_info = computed(()=> store.state.user_info)

watch(my_autoclick_activate, (newVal, OldVal)=>{
    if(newVal){
        store.dispatch('automatic_production')
    }
})

watch(my_cookie,(newVal)=>{
    if(newVal >=my_achievement_limit.value){
        store.dispatch('show_achievement')
    } 
})


onMounted(()=>{
    setInterval(() => {
        time.value++
        if(time.value% 60===0){
            store.commit('set_average_of_cookie', time.value)
        }
    }, 1000)
})

function save_game(){
    if(logged_in.value == true){
        store.commit("save_game")
        
        let users = JSON.parse(localStorage.getItem('users')) || [];
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
        users = users.map(user => {
            if(user.id === currentUser.id) {
                user.saved_file = user_info.value.saved_file;
                return user;
            }
            return user;
        });
        
        localStorage.setItem('users', JSON.stringify(users));
        currentUser.saved_file = user_info.value.saved_file;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        store.commit("update_list_of_users", users);
        
        alert("Game saved successfully!")
    }else{
        alert("Login before saving your game")
    }
}

function load_game(){

    if(logged_in.value == true){
        if(user_info.value.saved_file && Object.keys(user_info.value.saved_file).length > 0) {
            store.commit("load_file", user_info.value.saved_file)
            alert("Game loaded successfully!")
        } else {
            alert("No saved game found. Save your progress first!")
        }
    }else{
        alert("Login before loading your game")
    }

}

</script>

<style scoped>
.game-container {
    min-height: 100vh;
    background-image: url('/images/plants-vs-zombies-background.webp');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    position: relative;
}

.game-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 1;
}

.game-container > * {
    position: relative;
    z-index: 2;
}

.main-layout {
    display: flex;
    min-height: 80vh;
    padding: 20px;
}

.center-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    text-align: center;
    
    
}

.center-section h2 {
    color: white;
    font-size: 2.5rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 1);
    margin-bottom: 30px;
}

.sun-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0;
}

.sun-image {
    width: 250px;
    height: 250px;
    cursor: pointer;
    transition: transform 0.2s ease;
    filter: drop-shadow(0 0 20px rgba(255, 255, 0, 0.5));
}

.sun-image:hover {
    transform: scale(1.1);
}

.sun-image:active {
    transform: scale(0.95);
}

.right-section {
    width: 350px;
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.game-info {
    background: #923F0D;
    padding: 15px;
    border-radius: 10px;
    text-align: center;
    color:  white;
    border: 5px solid #AC703D;
}

.game-info h3 {
    margin-top: 0;
    color: white;
    font-size: 1.3rem;
}


.store-section {
    background: #923F0D;
    padding: 20px;
    border-radius: 10px;
    color: white;
    border: 5px solid #AC703D;
}

.store-section h3 {
    margin-top: 0;
    color: white;
    font-size: 1.3rem;
    text-align: center;
}

.auto-production {
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid #AC703D;
}

.achievement-section {
    background: #923F0D;
    padding: 15px;
    border-radius: 10px;
    text-align: center;
    color: white;
    border: 5px solid #AC703D;
}

.achievement-section h3 {
    margin-top: 0;
    color: white;
    font-size: 1.3rem;
}

.game-controls {
    text-align: center;
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 10px;
}

.game-controls button {
    background: #4CAF50;
    color: white;
    border: none;
    
    border-radius: 5px;
    cursor: pointer;
    font-size: 20px;
    transition: background-color 0.3s;
    height: 50px;
    width: 100px;
    margin-bottom: 10px;
}

.game-controls button:hover {
    background: #45a049;
}

.store-section button, .auto-production button {
    background: #2196F3;
    color: white;
    border: none;
    padding: 10px 20px;
    margin: 5px 0;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
    width: 100%;
}

.store-section button:hover, .auto-production button:hover {
    background: #1976D2;
}

.sun_multiplier_button{
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(255, 255, 255, 0.1);
    padding: 10px;
    border-radius: 8px;
    margin: 10px 0;
    border: 2px solid #AC703D;
}

.sun_multiplier_button p {
    margin: 0;
    flex: 1;
    font-weight: bold;
    color: white;
}

.sun_multiplier_button img {
    width: 40px;
    height: 40px;
    margin: 0 10px;
}

.sun_multiplier_button button {
    background: #4CAF50;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
    width: 150px;
}

.sun_multiplier_button button:hover {
    background: #45a049;
}

.store-section p img, .auto-production p img {
    width: 20px;
    height: 20px;
    vertical-align: middle;
    margin-left: 5px;
}

.game-info-Sun-multi{
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
}

.game-info-Sun-multi img{
    width: 15px;
    height: 15px;
    vertical-align: middle;
    transform: translateY(-3px);
}

.game-info-Suns-per-s{
    display: flex;
    justify-content: center;
    gap: 5px
}

.game-info-Suns-per-s img{
    width: 15px;
    height: 15px;
}

.game-info-production-speed{
    display: flex;
    justify-content: center;
    gap: 5px
}

.game-info-production-speed img{
    width: 15px;
    height: 15px;
}


.achievement-popup {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
    animation: achievementSlide 0.5s ease-out;
}

.achievement-content {
    background: linear-gradient(135deg, #FFD700, #FFA500);
    color: #2C1810;
    padding: 30px;
    border-radius: 15px;
    box-shadow: 0 0 30px rgba(255, 215, 0, 0.8);
    text-align: center;
    border: 3px solid #FFD700;
    min-width: 300px;
}

.achievement-content h2 {
    margin: 0 0 15px 0;
    font-size: 1.8rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.achievement-content p {
    margin: 10px 0;
    font-size: 1.2rem;
    font-weight: bold;
}

.achievement-close-btn {
    position: absolute;
    top: 10px;
    right: 15px;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #2C1810;
    font-weight: bold;
}

.achievement-close-btn:hover {
    color: #000;
    transform: scale(1.1);
}

@keyframes achievementSlide {
    0% {
        transform: translate(-50%, -200%);
        opacity: 0;
    }
    100% {
        transform: translate(-50%, -50%);
        opacity: 1;
    }
}



</style>