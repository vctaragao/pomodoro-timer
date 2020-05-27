<template>
  <div class="pomodoro_timer_container">
    <div class="timer center">
      <span>{{clock}}</span>
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
        current_time: 0
      },
      pomodoro: {
        session: 1,
        short_break: 5,
        long_break: 25
      },
      animation: null,
      newSession: false,
      is_long_break_timer: false,
      is_short_break_timer: false,
      is_pomodoro_running: false
    };
  },
  methods: {
    checkCookies() {
      if (this.$cookies.isKey("pomodoro_conf")) {
        this.timer.minutes = this.$cookies.get("pomodoro_conf").minutes;
        this.pomodoro.short_break = this.$cookies.get(
          "pomodoro_conf"
        ).short_break;
        this.pomodoro.long_break = this.$cookies.get(
          "pomodoro_conf"
        ).long_break;
      }
    },
    toggleTimer() {
      if (this.is_pomodoro_running) this.stopTimer();
      else this.startTimer();
    },
    hasPomodoroFinished() {
      if (this.pomodoro.session <= 4) {
        return false;
      }
      this.pomodoro.session = 1;
      this.is_pomodoro_running = false;
      return true;
    },
    startLongBreak() {
      this.timer.minutes = +this.pomodoro.long_break;
    },
    startNewSession() {
      ++this.pomodoro.session;
      this.timer.minutes = 1;
    },
    startNewPomodoro() {
      this.timer.minutes = 1;
    },
    startTimer() {
      if (this.timer.current_time) this.animation.set(this.timer.current_time);
      else {
        this.timer.current_time = 0;
        this.animation.set(0);
      }
      this.animation.animate(1);
      this.is_pomodoro_running = true;
    },
    stopTimer() {
      this.timer.current_time = this.animation.value();
      this.animation.set(this.timer.current_time);
      this.is_pomodoro_running = false;
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
        }
      });
    },
    toggleBreakTimer() {
      this.animation.destroy();
      if (this.is_long_break_timer)
        this.timer.minutes = this.pomodoro.long_break;
      else if (this.is_short_break_timer)
        this.timer.minutes = this.pomodoro.short_break;
      else this.timer.minutes;

      this.createProgresbar(this.timer.minutes);
      this.startTimer();
    },
    resetTimer() {
      this.animation.set(1);
      this.timer.minutes = this.$cookies.isKey("pomodoro_conf")
        ? this.$cookies.get("pomodoro_conf").minutes
        : 25;
      this.pomodoro.short_break = this.$cookies.isKey("pomodoro_conf")
        ? this.$cookies.get("pomodoro_conf").short_break
        : 5;
      this.pomodoro.long_break = this.$cookies.isKey("pomodoro_conf")
        ? this.$cookies.get("pomodoro_conf").long_break
        : 25;
      this.timer.current_time = 0;
      this.is_pomodoro_running = false;
    }
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
    }
  },
  watch: {
    is_short_break_timer() {
      this.toggleBreakTimer();
    },
    is_long_break_timer() {
      this.toggleBreakTimer();
    },
    "timer.seconds"() {
      if (this.timer.seconds === 60 && !this.timer.minutes) {
        this.newSession = true;
        this.animation.set(0);
        if (this.hasPomodoroFinished()) {
          this.is_long_break_timer = !this.is_long_break_timer;
          if (!this.is_long_break_timer) {
            this.startNewPomodoro();
            this.stopTimer();
          }
        } else {
          this.is_short_break_timer = !this.is_short_break_timer;
          if (!this.is_short_break_timer) {
            this.startNewSession();
          }
        }
        this.newSession = false;
      } else if (this.timer.seconds === 59) {
        --this.timer.minutes;
      }
    }
  },
  mounted() {
    this.checkCookies();
    this.createProgresbar(this.timer.minutes);
    this.animation.set(1);
  }
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
  top: 50%;
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
</style>
