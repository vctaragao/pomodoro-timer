<template>
  <div class="tasks_container">
    <h2>Vitórias para o dia!</h2>
    <div class="task_group">
      <input type="text" v-model="task.name" placeholder="Adicionar tarefa" />
      <button @click="addTask()">Adicionar Tarefa</button>
    </div>

    <div v-if="task" class="tasks">
      <div v-for="task in tasks" :key="task.id" class="task">
        <span>{{task.name}}</span>
        <span @click="removeTask(task)">Remove</span>
      </div>
    </div>
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
        name: ""
      },
      current_task_id: 0,
      tasks_ids: []
    };
  },
  methods: {
    addTask() {
      ++this.current_task_id;
      this.task.id = this.current_task_id;
      this.tasks.push({ ...this.task });
      console.log(this.tasks);
      this.$cookies.set("tasks", JSON.stringify(this.tasks));
    },
    removeTask(task) {
      this.tasks.splice(this.tasks.indexOf(task), 1);
      this.$cookies.set("tasks", JSON.stringify(this.tasks));
    }
  },
  mounted() {
    if (this.$cookies.isKey("tasks")) {
      this.tasks = JSON.parse(this.$cookies.get("tasks"));
      if (this.tasks.length)
        this.current_task_id = this.tasks
          .map(task => task.id)
          .reduce((a, b) => Math.max(a, b));
    }
  }
};
</script>

<style>
.winning_tasks_container {
  display: flex;
  flex-direction: column;
  margin: auto;
}
</style>
