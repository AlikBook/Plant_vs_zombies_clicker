import { createStore } from "vuex";

const store = createStore({
    state: {
        cookies : 0,
        cookie_multiplier: 1,
        click_mulitplier_price : 10,

        //autoproduction
        activate_autoclick: false,
        auto_click_multiplier: 1,
        auto_click_price: 25,
        show_auto_click_button: true,
        production_speed : 1500,
        production_speed_cost : 150,
        production_interval_id: null,

        //achievement
        display_message:false,
        achievement_limit: 100,
        
        //Statistics
        list_cookie_per_minute: [],
        cookie_per_minute: 0,

        //Users
        user_count : 0,
        Logged_in : false,
        user_info: {},
        list_of_users : [],
        saved_file : {}

        
    },
    mutations: {
        //single click
        increment_cookies(state){
            state.cookies = state.cookies+ 1 * state.cookie_multiplier
           
        },

        increment_multiplier(state){
            if((state.cookies - state.click_mulitplier_price) >=0){
                state.cookie_multiplier*=3
                state.cookies = state.cookies - state.click_mulitplier_price
                state.click_mulitplier_price *= 10
            }
           
        },

        //Autoclick
        buy_automatic_production(state){
             if((state.cookies - state.auto_click_price) >=0){
                state.activate_autoclick = true
                state.cookies = state.cookies - state.auto_click_price
                state.show_auto_click_button = false
                state.auto_click_price *=4
            }
        },

        start_production_interval(state) {
            if (state.production_interval_id) {
                clearInterval(state.production_interval_id);
            }
            if (state.activate_autoclick) {
                state.production_interval_id = setInterval(() => {
                }, state.production_speed);
            }
        },

        clear_production_interval(state) {
            if (state.production_interval_id) {
                clearInterval(state.production_interval_id);
                state.production_interval_id = null;
            }
        },

        increment_auto_cookies(state){
            state.cookies = state.cookies+ 1 * state.auto_click_multiplier
        },
        increment_auto_cookies_multiplier(state){
            if((state.cookies - state.auto_click_price) >=0){
            state.cookies = state.cookies - state.auto_click_price

            state.auto_click_multiplier*= 2
            state.auto_click_price *=4


            }
        },

        increment_speed_production(state){
            if(state.production_speed > 1 && state.cookies >= state.production_speed_cost){
                state.production_speed = Math.max(1, Math.floor(state.production_speed * 0.8));
                state.cookies -= state.production_speed_cost
                state.production_speed_cost *= 2;
            }
        },
        //achievement
        activate_achievement(state){
            state.display_message = true
            state.achievement_limit *= 10
        },
        deactivate_achievement(state) {
            state.display_message = false;
        },

        //Statistics
        set_average_of_cookie(state){
            state.list_cookie_per_minute.push(state.cookies);
            
            if(state.list_cookie_per_minute.length > 1) {
                state.cookie_per_minute = state.list_cookie_per_minute.reduce((sum, num) => sum + num, 0) / state.list_cookie_per_minute.length;
            } else {
                state.cookie_per_minute = state.cookies;
            }
        },

        //Number Useers
        increase_number_of_users(state){
            state.user_count+=1
        },

        //User logged-in
        set_logged_in(state){
            state.Logged_in = true
        },

        set_log_out(state){
            state.Logged_in = false
            state.user_info = {}
        },

        set_user_info(state, name){
            state.user_info = name
        },
        //Save file
                                
        save_game(state){
            state.saved_file = {
                cookies: state.cookies,
                cookie_multiplier: state.cookie_multiplier,
                click_mulitplier_price: state.click_mulitplier_price,
                activate_autoclick: state.activate_autoclick,
                auto_click_multiplier: state.auto_click_multiplier,
                auto_click_price: state.auto_click_price,
                show_auto_click_button: state.show_auto_click_button,
                production_speed: state.production_speed,
                production_speed_cost: state.production_speed_cost,
                display_message: state.display_message,
                achievement_limit: state.achievement_limit,
                list_cookie_per_minute: state.list_cookie_per_minute,
                cookie_per_minute: state.cookie_per_minute,
            }
            state.user_info.saved_file = state.saved_file 
            state.saved_file = {}
        },



        load_file(state,file){
            if(!file || Object.keys(file).length === 0) {
                return; 
            }
            state.cookies = file.cookies
            state.cookie_multiplier = file.cookie_multiplier
            state.click_mulitplier_price = file.click_mulitplier_price
            state.activate_autoclick = file.activate_autoclick
            state.auto_click_multiplier = file.auto_click_multiplier
            state.auto_click_price = file.auto_click_price
            state.show_auto_click_button = file.show_auto_click_button
            state.production_speed = file.production_speed || 1500
            state.production_speed_cost = file.production_speed_cost || 150
            state.display_message = file.display_message
            state.achievement_limit = file.achievement_limit
            state.list_cookie_per_minute = file.list_cookie_per_minute
            state.cookie_per_minute = file.cookie_per_minute
        },

        update_list_of_users(state, list_users){
            state.list_of_users = list_users
        },

        

    
        
        
        
    },
    actions: {
        automatic_production ({state, commit}){
            if(state.activate_autoclick){
                if (state.production_interval_id) {
                    clearInterval(state.production_interval_id);
                }
                
                state.production_interval_id = setInterval(() => {
                    commit('increment_auto_cookies')
                }, state.production_speed);
            }    
        },

        upgrade_production_speed({commit, dispatch}) {
            commit('increment_speed_production');
            dispatch('automatic_production');
        },

        show_achievement({commit}){
            commit('activate_achievement')
            setTimeout(()=> commit ('deactivate_achievement')
                ,5000)
        },

        
    },
    getters:{

    }
})

export default store
