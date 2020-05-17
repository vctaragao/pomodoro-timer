<template>
  <div id="app">
    <div class="pomodoro_configuration"></div>
    <pomodoro-configuration />
    <pomodoro-timer />
  </div>
</template>

<script>
import PomodoroTimer from "./components/PomodoroTimer.vue";
import PomodoroConfiguration from "./components/PomodoroConfiguration.vue";

export default {
  name: "App",
  components: {
    PomodoroTimer,
    PomodoroConfiguration
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
