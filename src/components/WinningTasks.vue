<template>
  <div class="winning_tasks_container">
    <h2>Vitórias para o dia!</h2>
    <div class="task_group">
      <input type="checkbox" />
      <input type="text" placeholder="Objetivo 1" />
    </div>
    <div class="task_group">
      <input type="checkbox" />
      <input type="text" placeholder="Objetivo 2" />
    </div>
    <div class="task_group">
      <input type="checkbox" />
      <input type="text" placeholder="Objetivo 3" />
    </div>
  </div>
</template>

<script>
export default {
  name: "WinningTasks"
};
</script>

<style>
.winning_tasks_container {
  display: flex;
  flex-direction: column;
  margin: auto;
}
</style>
