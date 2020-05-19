<template>
  <div id="app">
    <pomodoro-configuration />
    <winning-tasks />
    <inspiring-quotes />
    <task />
    <pomodoro-timer />
  </div>
</template>

<script>
import PomodoroTimer from "./components/PomodoroTimer.vue";
import PomodoroConfiguration from "./components/PomodoroConfiguration.vue";
import WinningTasks from "./components/WinningTasks.vue";
import InspiringQuotes from "./components/InspiringQuotes.vue";
import Task from "./components/Tasks.vue";

export default {
  name: "App",
  components: {
    PomodoroTimer,
    PomodoroConfiguration,
    WinningTasks,
    InspiringQuotes,
    Task
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
body {
  width: 100vw;
  height: 100vh;
}
#app {
  width: 100%;
  height: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
}
</style>
