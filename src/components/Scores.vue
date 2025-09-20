<template>
    <div class="Score_container">
        <h2>Best scores</h2>
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Username</th>
                    <th>Score</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(value, index) in user_and_scores.slice(0, 5)" :key="value.username">
                    <td>{{ index + 1 }}</td>
                    <td>{{ value.username }}</td>
                    <td>{{ value.score }}</td>
                </tr>
            </tbody>
        </table>
    </div>
    
</template>

<script setup>
import { useStore } from 'vuex';
import { computed, onMounted, ref, watch } from 'vue';

const store = useStore()

let list_of_users = computed(()=> store.state.list_of_users)
let user_and_scores = ref([])

function order_scores(){
    user_and_scores.value = [];
    
    for(let item of list_of_users.value){
        if(item.saved_file && item.saved_file.cookies !== undefined) {
            user_and_scores.value.push(
                {
                    username: item.username,
                    score: item.saved_file.cookies
                }
            )
        }
    }
    user_and_scores.value.sort((a,b)=>b.score - a.score)
    console.log('Ordered scores:', user_and_scores.value)
}

watch(list_of_users, (newUsers) => {
    if(newUsers && newUsers.length > 0) {
        order_scores()
    }
}, { immediate: true, deep: true })

watch(() => store.state.user_info.saved_file, () => {
    order_scores()
}, { deep: true })

onMounted(()=>{
    order_scores()
})

</script>

<style scoped>
    .Score_container{
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    table{
        width: 200px;
        border: 2px solid white;
    }
    td, th {
        border-bottom: 1px solid #ccc;
        text-align: center;
    }

    tr:last-child td {
        border-bottom: none;
    }
</style>