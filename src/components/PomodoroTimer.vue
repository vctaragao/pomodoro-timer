<template>
  <div class="pomodoro_timer_container">
    <transition name="fade-in" mode="out-in">
      <h4 v-if="is_short_break_timer" key="short">Vá beber uma água</h4>
      <h4 v-else-if="is_long_break_timer" key="long">
        Você merece um descanso
      </h4>
      <h4 v-else-if="is_pomodoro_running" key="focus">Foco!</h4>
      <h4 v-else key="default">Vamo nessa?</h4>
    </transition>
    <div class="timer center">
      <span>{{ clock }}</span>
    </div>
    <button class="btn waves-effect waves-light" @click="toggleTimer()">
      <span v-if="is_pomodoro_running" class="material-icons">pause</span>
      <span v-else class="material-icons">play_arrow</span>
    </button>
    <button class="btn" @click="resetTimer()">
      <span class="material-icons">stop</span>
    </button>
  </div>
</template>

<script>
export default {
  name: "PomodoroTimer",
  data() {
    return {
      timer: {
        minutes: 25,
        seconds: 60,
        current_time: 0,
      },
      pomodoro: {
        session: 1,
        session_period: 25,
        short_break: 5,
        long_break: 25,
      },
      browser: "",
      notification: null,
      is_long_break_timer: false,
      is_short_break_timer: false,
      is_pomodoro_running: false,
      notification_audio: null,
      finished_audio: null,
      step_counter: null,
      is_reseted: false,
    };
  },
  methods: {
    requestNotificationPermission() {
      if ("Notification" in window) {
        // Otherwise, we need to ask the user for permission
        if (
          Notification.permission !== "denied" &&
          Notification.permission !== "granted"
        ) {
          Notification.requestPermission().then(function (permission) {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
              console.log(permission);
            }
          });
        }
      }
    },
    checkCookies() {
      if (this.$cookies.isKey("pomodoro_conf")) {
        this.pomodoro.session_period = this.$cookies.get(
          "pomodoro_conf"
        ).minutes;
        this.timer.minutes = this.pomodoro.session_period;
        this.pomodoro.short_break = this.$cookies.get(
          "pomodoro_conf"
        ).short_break;
        this.pomodoro.long_break = this.$cookies.get(
          "pomodoro_conf"
        ).long_break;
      }
    },
    startStepCounter() {
      this.step_counter = setInterval(() => {
        this.timer.seconds--;
        if (this.timer.seconds < 1) {
          this.timer.seconds = 60;
        }
      }, 1000);
    },
    toggleTimer() {
      if (this.is_pomodoro_running) {
        this.pauseTimer();
      } else {
        this.startTimer();
        this.requestNotificationPermission();
      }
    },
    hasPomodoroFinished() {
      return this.pomodoro.session < 4 ? false : true;
    },
    startNewSession() {
      ++this.pomodoro.session;
      this.timer.minutes = this.pomodoro.session_period;
      this.generateNotification("Foco!", "Vamos voltar ao trabalho");
    },
    startTimer() {
      if (!this.timer.current_time) {
        this.timer.current_time = 0;
      }
      this.startStepCounter();
      this.is_pomodoro_running = true;
      this.is_reseted = false;
      this.timer.current_time = 0;
    },
    pauseTimer() {
      this.is_pomodoro_running = false;
      clearInterval(this.step_counter);
    },
    stopTimer() {
      this.is_pomodoro_running = false;
      clearInterval(this.step_counter);
    },
    resetTimer() {
      if (this.hasPomodoroFinished()) {
        this.finished_audio.play();
      }
      this.timer.minutes = this.pomodoro.session_period;
      this.pomodoro.session = 1;
      this.is_long_break_timer = false;
      this.is_short_break_timer = false;
      this.timer.current_time = 0;
      this.is_pomodoro_running = false;
      clearInterval(this.step_counter);
      this.timer.seconds = 60;
      this.is_reseted = true;
    },
    startShortBreak() {
      this.timer.minutes = this.pomodoro.short_break;
      this.generateNotification("Pausa pequena", "Vá beber uma água");
    },
    startLongBreak() {
      this.timer.minutes = this.pomodoro.long_break;
      this.generateNotification("Pausa longa", "Você merece um descanço");
    },
    generateNotification(title, body) {
      new Notification(title, {
        body: body,
        icon: window.location.origin + "/logo_white.svg",
      });
    },
  },
  computed: {
    clock() {
      let s = this.timer.seconds === 60 ? 0 : this.timer.seconds;
      if (s < 10) {
        s = "0" + s;
      }
      let m =
        this.timer.minutes < 10 ? "0" + this.timer.minutes : this.timer.minutes;
      return m + ":" + s;
    },
    hasFinished() {
      return this.timer.seconds === 60 && !this.timer.minutes ? true : false;
    },
  },
  watch: {
    clock() {
      document.title = `Sessão ${this.pomodoro.session}ª: ${this.clock}`;
    },
    hasFinished() {
      if (this.hasFinished) {
        this.stopTimer();
        this.notification_audio.play();

        if (this.hasPomodoroFinished()) {
          this.is_long_break_timer = !this.is_long_break_timer;
          if (this.is_long_break_timer) {
            this.startLongBreak();
          } else {
            this.resetTimer();
          }
        } else {
          this.is_short_break_timer = !this.is_short_break_timer;
          if (this.is_short_break_timer) {
            this.startShortBreak();
          } else {
            this.startNewSession();
          }
        }
        if (!this.is_reseted) {
          this.startTimer();
        } else {
          this.is_reseted = false;
        }
      }
    },
    "timer.seconds"() {
      if (this.timer.seconds === 59) {
        this.timer.minutes--;
      }
    },
  },
  mounted() {
    this.checkCookies();
    this.notification_audio = new Audio(require("../assets/notification.mp3"));
    this.finished_audio = new Audio(require("../assets/finished.mp3"));

    let nav = navigator.userAgent.toLowerCase();

    if (nav.indexOf("mozilla") != -1) {
      if (nav.indexOf("firefox") != -1) {
        this.browser = "firefox";
      } else if (nav.indexOf("firefox") != -1) {
        this.browser = "mozilla";
      } else if (nav.indexOf("chrome") != -1) {
        this.browser = "chrome";
      }
    }
    console.log(this.browser);

    if (this.browser === "chrome") {
      this.requestNotificationPermission();
    }
  },
};
</script>

<style>
.timer {
  width: 100%;
  position: relative;
  margin-bottom: 0.5rem;
}

.pomodoro_timer_container {
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20%;
}

.pomodoro_timer_container .btn {
  margin-right: 1rem;
  border-radius: 50%;
  position: relative;
  width: 3rem;
  height: 3rem;
}

.pomodoro_timer_container .btn:last-child {
  margin-right: 0;
}

.pomodoro_timer_container .material-icons {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.timer span {
  font-size: 5rem;
}

.center {
  margin-left: auto;
  margin-right: auto;
}

.fade-in-enter,
.fade-in-leave-to {
  opacity: 0;
}

.fade-in-enter-to,
.fade-in-leave {
  opacity: 1;
}

.fade-in-enter-active,
.fade-in-leave-active {
  transition: opacity 2s ease-in;
  transition-delay: 10s;
}
</style>
