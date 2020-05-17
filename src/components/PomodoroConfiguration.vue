<template>
  <div class="pomodoro_configuration_container">
    <h2>Configuração do pomodoro</h2>
    <label for="min">Minutos por sessão</label>
    <input id="min" type="text" :placeholder="minutes + 'min'" v-model="minutes" />
    <label for="short">Pausa pequena</label>
    <input id="short" type="text" placeholder="Pausa" v-model="short_break" />
    <label for>Pausa longa</label>
    <input type="text" name placeholder="Pausa longa" v-model="long_break" />
    <button @click="updatePomodoroConfiguration()">Atualizar pomodoro</button>
  </div>
</template>

<script>
export default {
  name: "PomodoroContainer",
  data() {
    return {
      minutes: 25,
      short_break: 5,
      long_break: 25
    };
  },
  methods: {
    updatePomodoroConfiguration() {
      let pomodoro_conf = {
        minutes: this.minutes,
        short_break: this.short_break,
        long_break: this.long_break
      };
      this.$cookies.set("pomodoro_conf", pomodoro_conf);
    },
    checkCookies() {
      if (this.$cookies.isKey("pomodoro_conf")) {
        this.minutes = this.$cookies.get("pomodoro_conf").minutes;
        this.short_break = this.$cookies.get("pomodoro_conf").short_break;
        this.long_break = this.$cookies.get("pomodoro_conf").long_break;
      }
    }
  },
  mounted() {
    this.checkCookies();
  }
};
</script>

<style>
</style>
