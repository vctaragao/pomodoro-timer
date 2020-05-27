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
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&family=Roboto:wght@400;700&display=swap");
* {
  margin: 0;
  padding: 0;
}
body {
  width: 100vw;
  height: 100vh;
  font-family: "Roboto", sans-serif;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: "Montserrat", sans-serif;
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
  background: #0f2027; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to right,
    #0f2027,
    #203a43,
    #2c5364
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to right,
    #0f2027,
    #203a43,
    #2c5364
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  color: white;
}

.material-icons {
  cursor: pointer;
  transition: 0.5s;
}
</style>
