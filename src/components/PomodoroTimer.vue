<template>
  <div class="pomodoro_timer_container">
    <div class="timer center">
      <span>{{clock}}</span>
    </div>
    <button @click="startAnimation()">Play</button>
  </div>
</template>

<script>
const ProgressBar = require("progressbar.js");
export default {
  name: "PomodoroTimer",
  data() {
    return {
      timer: {
        minutes: "1",
        seconds: 60
      },
      pomodoro: {
        session: 1,
        short_break: 2,
        long_break: "3"
      },
      animation: null,
      newSession: false,
      is_long_break_timer: false,
      is_short_break_timer: false,
      test: 0
    };
  },
  methods: {
    checkCookies() {
      if (this.$cookies.isKey("minutes"))
        this.timer.minutes = this.$cookies.get("minutes");
      if (this.$cookies.isKey("pomodoro_session"))
        this.pomodoro.session = this.$cookies.get("pomodoro_session");
      if (this.$cookies.isKey("short_break"))
        this.pomodoro.short_break = this.$cookies.short_break;
    },
    hasPomodoroFinished() {
      if (this.pomodoro.session <= 4) {
        return false;
      }
      this.pomodoro.session = 1;
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
    stopTimer() {
      window.clearInterval(this.t);
    },
    startAnimation() {
      this.animation.set(0);
      this.animation.animate(1);
    },
    createProgresbar(duration = 1) {
      this.animation = new ProgressBar.Circle(".timer", {
        color: "#000000",
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
      this.startAnimation();
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
    this.createProgresbar();
    this.animation.set(1);
  }
};
</script>

<style>
.timer {
  width: 20%;
  position: relative;
}

.timer span {
  position: absolute;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
}

.center {
  margin-left: auto;
  margin-right: auto;
}
</style>
