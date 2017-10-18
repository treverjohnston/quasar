<template>
  <q-layout ref="layout" view="lHh Lpr fff" :left-class="{'bg-grey-2': true}">
    <q-toolbar slot="header" class="glossy">
      <q-btn flat @click="$refs.layout.toggleLeft()">
        <q-icon name="menu" />
      </q-btn>
      <router-link :to="'/'">
        <q-btn flat color="white">
          <q-icon name="home" />
        </q-btn>
      </router-link>

      <q-toolbar-title>
        <!-- Quasar App
        <div slot="subtitle">Running on Quasar v{{$q.version}}</div> -->
      </q-toolbar-title>
    </q-toolbar>

    <div slot="left">
      <!--
        Use <q-side-link> component
        instead of <q-item> for
        internal vue-router navigation
      -->

      <q-list no-border link inset-delimiter>
        <q-list-header>Boards</q-list-header>
        <div v-for="board in boards">
          <router-link :to="`${board.id}`">
            <q-item>
              <q-item-side icon="dashboard" />
              <q-item-main :label="board.title" :sublabel="board.description" label-lines="1" />
            </q-item>
          </router-link>
        </div>
        <!-- <q-item @click="launch('http://quasar-framework.org')">
          <q-item-side icon="school" />
          <q-item-main label="Docs" sublabel="quasar-framework.org" />
        </q-item>
        <q-item @click="launch('http://forum.quasar-framework.org')">
          <q-item-side icon="record_voice_over" />
          <q-item-main label="Forum" sublabel="forum.quasar-framework.org" />
        </q-item>
        <q-item @click="launch('https://gitter.im/quasarframework/Lobby')">
          <q-item-side icon="chat" />
          <q-item-main label="Gitter Channel" sublabel="Quasar Lobby" />
        </q-item>
        <q-item @click="launch('https://twitter.com/quasarframework')">
          <q-item-side icon="rss feed" />
          <q-item-main label="Twitter" sublabel="@quasarframework" />
        </q-item> -->
      </q-list>
    </div>

    <!--
      Replace following <div> with
      <router-view /> component
      if using subRoutes
    -->
    <!-- <div>
      <router-view />
    </div> -->
    <div v-if="id">
      <router-view />
    </div>
    <div v-else>
      <q-parallax class="relative-position" :src="'statics/seaBackground.jpg'" :speed="1" :height="800">
        <div slot="loading">Loading...</div>
        <div class="layout-padding logo-container non-selectable no-pointer-events">
          <div class="logo" :style="position">
            <h1>Click To Add A Board</h1>
          </div>
        </div>
        <q-btn round link v-for="dialog in form" @click="dialog.handler()" color="purple">
          <q-icon name="note_add" />
        </q-btn>
      </q-parallax>
    </div>
  </q-layout>
</template>

<script>
  import {
    dom,
    event,
    openURL,
    QLayout,
    QToolbar,
    QToolbarTitle,
    QBtn,
    QIcon,
    QList,
    QListHeader,
    QItem,
    QItemSide,
    QItemMain,
    QParallax,
    Dialog
  } from 'quasar'

  const
    { viewport } = dom,
    { position } = event,
    moveForce = 30,
    rotateForce = 40,
    RAD_TO_DEG = 180 / Math.PI

  function getRotationFromAccel(accelX, accelY, accelZ) {
    /* Reference: http://stackoverflow.com/questions/3755059/3d-accelerometer-calculate-the-orientation#answer-30195572 */
    const sign = accelZ > 0 ? 1 : -1
    const miu = 0.001

    return {
      roll: Math.atan2(accelY, sign * Math.sqrt(Math.pow(accelZ, 2) + miu * Math.pow(accelX, 2))) * RAD_TO_DEG,
      pitch: -Math.atan2(accelX, Math.sqrt(Math.pow(accelY, 2) + Math.pow(accelZ, 2))) * RAD_TO_DEG
    }
  }

  export default {
    name: 'hello',
    components: {
      QLayout,
      QToolbar,
      QToolbarTitle,
      QBtn,
      QIcon,
      QList,
      QListHeader,
      QItem,
      QItemSide,
      QItemMain,
      QParallax
    },
    data() {
      return {
        orienting: window.DeviceOrientationEvent && !this.$q.platform.is.desktop,
        rotating: window.DeviceMotionEvent && !this.$q.platform.is.desktop,
        moveX: 0,
        moveY: 0,
        rotateY: 0,
        rotateX: 0,
        title: '',
        description: '',
        form: [
          {
            label: 'Textfields',
            icon: 'help',
            handler() {
              Dialog.create({
                title: 'Add Board',
                message: 'What do you want to call your board?',
                form: {
                  title: {
                    type: 'text',
                    label: 'Title',
                    model: ''
                  },
                  description: {
                    type: 'text',
                    label: 'Description',
                    model: ''
                  }
                },
                buttons: [
                  'Cancel',
                  {
                    label: 'Ok',
                    handler(data) {
                      console.log('submitted: ', data)
                    }
                  }
                ]
              })
            }
          }
        ]
      }
    },
    computed: {
      id() {
        return this.$route.params.boardId
      },
      boards() {
        return this.$store.state.boards
      },
      position() {
        const transform = `rotateX(${this.rotateX}deg) rotateY(${this.rotateY}deg)`
        return {
          top: this.moveY + 'px',
          left: this.moveX + 'px',
          '-webkit-transform': transform,
          '-ms-transform': transform,
          transform
        }
      }
    },
    methods: {
      launch(url) {
        openURL(url)
      },
      move(evt) {
        const
          { width, height } = viewport(),
          { top, left } = position(evt),
          halfH = height / 2,
          halfW = width / 2

        this.moveX = (left - halfW) / halfW * -moveForce
        this.moveY = (top - halfH) / halfH * -moveForce
        this.rotateY = (left / width * rotateForce * 2) - rotateForce
        this.rotateX = -((top / height * rotateForce * 2) - rotateForce)
      },
      rotate(evt) {
        if (evt.rotationRate &&
          evt.rotationRate.beta !== null &&
          evt.rotationRate.gamma !== null) {
          this.rotateX = evt.rotationRate.beta * 0.7
          this.rotateY = evt.rotationRate.gamma * -0.7
        }
        else {
          /* evt.acceleration may be null in some cases, so we'll fall back
             to evt.accelerationIncludingGravity */
          const
            accelX = evt.acceleration.x || evt.accelerationIncludingGravity.x,
            accelY = evt.acceleration.y || evt.accelerationIncludingGravity.y,
            accelZ = evt.acceleration.z || evt.accelerationIncludingGravity.z - 9.81,
            rotation = getRotationFromAccel(accelX, accelY, accelZ)

          this.rotateX = rotation.roll * 0.7
          this.rotateY = rotation.pitch * -0.7
        }
      },
      orient(evt) {
        if (evt.beta === null || evt.gamma === null) {
          window.removeEventListener('deviceorientation', this.orient, false)
          this.orienting = false

          window.addEventListener('devicemotion', this.rotate, false)
        }
        else {
          this.rotateX = evt.beta * 0.7
          this.rotateY = evt.gamma * -0.7
        }
      }
    },
    mounted() {
      this.$nextTick(() => {
        if (this.orienting) {
          window.addEventListener('deviceorientation', this.orient, false)
        }
        else if (this.rotating) {
          window.addEventListener('devicemove', this.rotate, false)
        }
        else {
          document.addEventListener('mousemove', this.move)
        }
      })
    },
    beforeDestroy() {
      if (this.orienting) {
        window.removeEventListener('deviceorientation', this.orient, false)
      }
      else if (this.rotating) {
        window.removeEventListener('devicemove', this.rotate, false)
      }
      else {
        document.removeEventListener('mousemove', this.move)
      }
    }
  }
</script>

<style lang="stylus">
  .logo-container {
    width: 50%;
    height: 242px;
    perspective: 800px;
    position: absolute;
    top: 30%;
    left: 55%;
    transform: translateX(-50%) translateY(-50%);
  }

  .logo {
    position: absolute;
    transform-style: preserve-3d;
  }
</style>