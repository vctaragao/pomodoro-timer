<template>
  <div class="pomodoro_configuration_container">
    <h4>Configuração do pomodoro</h4>
    <form>
      <div class="input-field">
        <label for="min">Minutos por sessão</label>
        <input id="min" type="text" :placeholder="minutes + 'min'" v-model="minutes" />
      </div>
      <div class="input-field">
        <label for="short">Pausa pequena</label>
        <input id="short" type="text" placeholder="Pausa" v-model="short_break" />
      </div>
      <div class="input-field">
        <label for>Pausa longa</label>
        <input type="text" name placeholder="Pausa longa" v-model="long_break" />
      </div>
      <button
        class="btn-small waves-effect waves-light"
        @click="updatePomodoroConfiguration()"
      >Atualizar pomodoro</button>
    </form>
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
.pomodoro_configuration_container {
  display: flex;
  flex-direction: column;
  width: 56%;
  margin-left: 5rem;
  margin-top: 2rem;
}

.pomodoro_configuration_container form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.pomodoro_configuration_container form button {
  align-self: center;
}

form input {
  color: white;
}

input[type="text"] {
  padding: 0.2rem 0.5rem;
}
</style>
