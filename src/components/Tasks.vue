<template>
  <div class="tasks_container">
    <h4>Tarefas do dia</h4>
    <form @submit.prevent>
      <div class="input-field">
        <input type="text" v-model="task.name" placeholder="Adicionar tarefa" />
        <button class="btn" @click="addTask()">Adicionar Tarefa</button>
      </div>
    </form>
    <transition name="fade-in">
      <form v-if="tasks.length" class="tasks" @submit.prevent>
        <transition-group name="fade-in" appear>
          <p
            v-for="task in tasks"
            :key="task.id"
            class="task"
            @change="toggleTask(task)"
          >
            <label>
              <input type="checkbox" :checked="task.completed" />
              <span :class="{ completed: task.completed }">{{
                task.name
              }}</span>
              <span @click="removeTask(task)" class="material-icons"
                >delete</span
              >
            </label>
          </p>
        </transition-group>
      </form>
    </transition>
  </div>
</template>

<script>
export default {
  name: "Tasks",
  data() {
    return {
      tasks: [],
      task: {
        id: null,
        name: "",
        completed: false,
      },
      current_task_id: 0,
      tasks_ids: [],
    };
  },
  methods: {
    addTask() {
      ++this.current_task_id;
      this.task.id = this.current_task_id;
      this.tasks.push({ ...this.task });
      this.$cookies.set("tasks", JSON.stringify(this.tasks));
      this.task.name = "";
    },
    removeTask(task) {
      this.tasks.splice(this.tasks.indexOf(task), 1);
      this.$cookies.set("tasks", JSON.stringify(this.tasks));
    },
    toggleTask(task) {
      const task_index = this.tasks.indexOf(task);
      if (task_index > -1)
        this.tasks[task_index].completed = !this.tasks[task_index].completed;
    },
  },
  mounted() {
    if (this.$cookies.isKey("tasks")) {
      this.tasks = JSON.parse(this.$cookies.get("tasks"));
      if (this.tasks.length)
        this.current_task_id = this.tasks
          .map((task) => task.id)
          .reduce((a, b) => Math.max(a, b));
    }
  },
};
</script>

<style>
.tasks_container {
  margin-left: auto;
  margin-right: 5rem;
  width: 70%;
}

.tasks_container form .input-field {
  display: flex;
  align-items: center;
  margin-bottom: 0;
  margin-top: 0.5rem;
}

.tasks_container form button {
  margin-left: 1rem;
  width: 60%;
}

.tasks_container .tasks {
  margin-top: 1rem;
}

.task {
  display: flex;
  justify-content: center;
}

.task label {
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.task label .material-icons {
  margin-left: 1rem;
  font-size: 1.25rem;
}

.task label .completed {
  color: #d1d1d1;
  text-decoration: line-through;
}

.fade-in-enter {
  opacity: 0;
}

.fade-in-enter-active {
  transition: opacity 1s;
}

.fade-in-enter-to {
  opacity: 1;
}

.fade-in-leave {
  opacity: 1;
}

.fade-in-leave-active {
  transition: opacity 1s;
}

.fade-in-leave-to {
  opacity: 0;
}
</style>
