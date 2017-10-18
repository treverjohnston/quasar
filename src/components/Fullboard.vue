<template>
    <!-- Don't drop "q-app" class -->
    <div class="fullboard">
       <h1>Hello world</h1>
    </div>
</template>

<script>
    export default {
        name: 'fullboard',
        // data() {
        //     return {

        //     }
        // }
        mounted(){
            // this.$store.dispatch('getFullboard', this.$route.params.boardId)

        },
        computed:{
            id(){
                this.$route.params.boardId
            }
        }
    }
</script>

<style></style>