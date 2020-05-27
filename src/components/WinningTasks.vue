<template>
  <div class="winning_tasks_container">
    <h4>Vitórias para o dia!</h4>
    <form>
      <div class="input-field">
        <span
          :class="{'disabled': first.done}"
          @click="checkVictory('first')"
          class="material-icons"
        >done</span>
        <input
          :class="{'disabled': first.done}"
          v-model="first.text"
          type="text"
          placeholder="1ª Vitória"
          :disabled="first.editable"
        />
      </div>
      <div class="input-field">
        <span
          :class="{'disabled': second.done}"
          @click="checkVictory('second')"
          class="material-icons"
        >done</span>
        <input
          :class="{'disabled': second.done}"
          v-model="second.text"
          type="text"
          placeholder="2ª Vitória"
          :disabled="second.editable"
        />
      </div>
      <div class="input-field">
        <span
          :class="{'disabled': third.done}"
          @click="checkVictory('third')"
          class="material-icons"
        >done</span>
        <input
          :class="{'disabled': third.done}"
          v-model="third.text"
          type="text"
          placeholder="3ª Vitória"
          :disabled="third.editable"
        />
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: "WinningTasks",
  data() {
    return {
      first: {
        text: null,
        done: false,
        editable: false
      },
      second: {
        text: null,
        done: false,
        editable: false
      },
      third: {
        text: null,
        done: false,
        editable: false
      }
    };
  },
  computed: {
    wins_of_the_day() {
      return {
        first: this.first,
        second: this.second,
        third: this.third
      };
    }
  },
  methods: {
    checkVictory(victory) {
      this[victory].done = !this[victory].done;
      this[victory].editable = !this[victory].editable;
      this.setWinsOfTheDayCookies();
    },
    setWinsOfTheDayCookies() {
      this.$cookies.set(
        "wins_of_the_day",
        JSON.stringify(this.wins_of_the_day),
        "1d"
      );
    }
  },
  watch: {
    "first.text"() {
      this.setWinsOfTheDayCookies();
    },
    "second.text"() {
      this.setWinsOfTheDayCookies();
    },
    "third.text"() {
      this.setWinsOfTheDayCookies();
    }
  },
  mounted() {
    if (this.$cookies.isKey("wins_of_the_day")) {
      const wins = this.$cookies.get("wins_of_the_day");

      this.first = wins.first;
      this.second = wins.second;
      this.third = wins.third;
    }
  }
};
</script>

<style>
.winning_tasks_container {
  display: flex;
  flex-direction: column;
  margin-right: 5rem;
  margin-top: 2rem;
  margin-left: auto;
  width: 56%;
}

.winning_tasks_container form .input-field {
  display: flex;
  align-items: center;
  margin-bottom: 0;
  margin-top: 0.5rem;
}

.winning_tasks_container form .input-field span {
  margin-right: 1rem;
}

.winning_tasks_container form .input-field span.disabled {
  color: #16cead;
}

.winning_tasks_container form .input-field input.disabled {
  color: #d1d1d1;
}

.winning_tasks_container .material-icons {
  cursor: pointer;
  transition: 0.5s;
}

.winning_tasks_container .material-icons:hover {
  color: #16cead;
}
</style>
