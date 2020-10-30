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
const ProgressBar = require("progressbar.js");
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
      animation: null,
      is_long_break_timer: false,
      is_short_break_timer: false,
      is_pomodoro_running: false,
      notification_audio: null,
      finished_audio: null,
    };
  },
  methods: {
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
    toggleTimer() {
      if (this.is_pomodoro_running) {
        this.stopTimer();
      } else {
        this.startTimer();
      }
    },
    hasPomodoroFinished() {
      return this.pomodoro.session < 4 ? false : true;
    },
    startNewSession() {
      ++this.pomodoro.session;
      this.timer.minutes = this.pomodoro.session_period;
      this.notification_audio.play();
      this.startTimer();
    },
    startTimer() {
      if (this.timer.current_time) {
        this.animation.set(this.timer.current_time);
      } else {
        this.timer.current_time = 0;
        this.animation.set(0);
      }
      this.animation.animate(1);
      this.is_pomodoro_running = true;
      this.timer.current_time = 0;
    },
    stopTimer() {
      this.is_pomodoro_running = false;
      this.timer.current_time = this.animation.value();
      this.animation.set(this.timer.current_time);
    },
    createProgresbar(duration = 25) {
      this.animation = new ProgressBar.Circle(".timer", {
        color: "#16CEAD",
        strokeWidth: 3,
        duration: parseInt(duration) * 60000,
        step: (state, animation) => {
          let seconds_past = Math.floor(duration * 60 * animation.value());
          this.timer.seconds =
            60 - (seconds_past - Math.floor(seconds_past / 60) * 60);
        },
      });
    },
    toggleBreakTimer() {
      this.animation.destroy();
      if (this.is_long_break_timer)
        this.timer.minutes = this.pomodoro.long_break;
      else if (this.is_short_break_timer)
        this.timer.minutes = this.pomodoro.short_break;
      else this.timer.minutes = this.pomodoro.session_period;

      this.createProgresbar(this.timer.minutes);
      this.startTimer();
    },
    resetTimer() {
      if (this.hasPomodoroFinished()) {
        this.finished_audio.play();
      }
      this.animation.destroy();
      this.timer.minutes = this.$cookies.isKey("pomodoro_conf")
        ? this.$cookies.get("pomodoro_conf").minutes
        : this.pomodoro.session_period;
      this.pomodoro.short_break = this.$cookies.isKey("pomodoro_conf")
        ? this.$cookies.get("pomodoro_conf").short_break
        : this.pomodoro.short_break;
      this.pomodoro.long_break = this.$cookies.isKey("pomodoro_conf")
        ? this.$cookies.get("pomodoro_conf").long_break
        : this.pomodoro.long_break;

      this.pomodoro.session = 1;
      this.is_long_break_timer = false;
      this.is_short_break_timer = false;
      this.timer.current_time = 0;
      this.is_pomodoro_running = false;
      this.createProgresbar(this.timer.minutes);
      this.animation.set(1);
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
  },
  watch: {
    is_short_break_timer() {
      if (this.is_short_break_timer) {
        this.toggleBreakTimer();
        this.notification_audio.play();
      }
    },
    is_long_break_timer() {
      if (this.is_long_break_timer) {
        this.toggleBreakTimer();
        this.notification_audio.play();
      }
    },
    "timer.seconds"() {
      if (this.timer.seconds === 60 && !this.timer.minutes) {
        this.animation.set(0);
        if (this.hasPomodoroFinished()) {
          this.is_long_break_timer = !this.is_long_break_timer;

          if (!this.is_long_break_timer) {
            this.resetTimer();
          }
        } else {
          this.is_short_break_timer = !this.is_short_break_timer;
          if (!this.is_short_break_timer) {
            this.startNewSession();
          }
        }
      } else if (this.timer.seconds === 59) {
        --this.timer.minutes;
      }
    },
    clock() {
      document.title = `Sessão ${this.pomodoro.session}ª: ${this.clock}`;
    },
  },
  mounted() {
    this.checkCookies();
    this.createProgresbar(this.timer.minutes);
    this.animation.set(1);

    this.notification_audio = new Audio(require("../assets/notification.mp3"));
    this.finished_audio = new Audio(require("../assets/finished.mp3"));
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
  position: absolute;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
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
