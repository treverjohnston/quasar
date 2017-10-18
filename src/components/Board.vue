<template>
    <!-- Don't drop "q-app" class -->
    <div class="board">
        <q-parallax class="pic" :src="'statics/seaBackground.jpg'" :speec="1" :height="800">
            <h1>Add A Board</h1>
            <div slot="loading">Loading...</div>
            <q-btn round color="purple">
                <q-icon name="note_add" />
            </q-btn>
        </q-parallax>
    </div>
</template>

<script>
    import { QParallax, QBtn, QIcon } from 'quasar'
    export default {
      name: 'board',
      components: {
        QParallax,
        QBtn,
        QIcon
      }
    }
</script>

<style scoped>
    /* .pic{
        margin: 0rem 0 20rem 0;
    } */
</style>