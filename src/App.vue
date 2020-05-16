<template>
  <div id="app">
    <div class="pomodoro_configuration">
      <h2>Configuração do pomodoro</h2>
      <input type="text" placeholder="Minutos" />
      <input type="text" placeholder="Pausa" />
      <input type="text" name placeholder="Pausa longa" />
    </div>
    <pomodoro-timer />
  </div>
</template>

<script>
import PomodoroTimer from "./components/PomodoroTimer.vue";

export default {
  name: "App",
  components: {
    PomodoroTimer
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
