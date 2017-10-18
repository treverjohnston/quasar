<template>
    <!-- Don't drop "q-app" class -->
    <div class="fullboard">
        <q-parallax class="relative-position" :src="'statics/seaBackground.jpg'" :speed="1" :height="800">
            <h1>Hello world</h1>
            <h1>
                {{id}}
            </h1>
        </q-parallax>

    </div>
</template>

<script>
    import { QParallax } from 'quasar'
    export default {
        name: 'fullboard',
        // data() {
        //     return {

        //     }
        // }
        mounted() {
            // this.$store.dispatch('getFullboard', this.$route.params.boardId)

        },
        computed: {
            id() {
                this.$route.params.boardId
            }
        },
        components: {
            QParallax
        }
    }
</script>

<style></style>