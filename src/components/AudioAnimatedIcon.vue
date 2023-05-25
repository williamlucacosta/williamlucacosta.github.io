<template>
    <div class="playing">
        <div class="rect rect1"></div>
        <div class="rect rect2"></div>
        <div class="rect rect3"></div>
        <div class="rect rect4"></div>
        <div class="rect rect5"></div>
    </div>
</template>

<script setup lang="ts">
  
</script>

<script lang="ts">
    export default {
      props: {
        color: {
          type: String,
          default: "#88feb7"
        }
      }
    }
</script>

<style scoped>
.rect {
    margin-right: 2px;
    background-color: v-bind(color);
}

.playing {
  /* position: absolute; */
  right: 5%;
  top: 50%;
  margin: -20px auto;
  width: 50px;
  height: 40px;
  text-align: center;
  font-size: 10px;
  -webkit-transition: all 0.2s ease;
  transition: all 0.2s ease;
}
.playing > div {
  /* background-color: #fff; */
  height: 100%;
  width: 6px;
  display: inline-block;
  -webkit-transition: all 0.2s ease;
  transition: all 0.2s ease;
  -webkit-animation: wavy 1s ease infinite forwards;
  animation: wavy 1.3s ease infinite forwards;
  -webkit-transform-origin: 50% 50%;
  transform-origin: 50% 50%;
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.33);
}
.playing .rect2 {
  -webkit-animation-delay: 0.25s;
  animation-delay: 0.25s;
}
.playing .rect3 {
  -webkit-animation-delay: 0.5s;
  animation-delay: 0.5s;
}
.playing .rect4 {
  -webkit-animation-delay: 0.75s;
  animation-delay: 0.75s;
}
.playing .rect5 {
  -webkit-animation-delay: 1s;
  animation-delay: 1s;
}
@-webkit-keyframes wavy {
  0% {
    -webkit-transform: scaleY(1);
    transform: scaleY(1);
  }
  50% {
    -webkit-transform: scaleY(0.6);
    transform: scaleY(0.6);
  }
  100% {
    -webkit-transform: scaleY(1);
    transform: scaleY(1);
  }
}
@keyframes wavy {
  0% {
    -webkit-transform: scaleY(1);
    transform: scaleY(1);
  }
  50% {
    -webkit-transform: scaleY(0.6);
    transform: scaleY(0.6);
  }
  100% {
    -webkit-transform: scaleY(1);
    transform: scaleY(1);
  }
}

</style>