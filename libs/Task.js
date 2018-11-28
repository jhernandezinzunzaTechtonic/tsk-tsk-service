
export function filterTasks(path, list) {
  console.log(path);
  if (path == '/') { // Display tasks that are not yet complete.
    let filteredTasks = list.filter((tasks) => {
    return tasks.completed === false;
    })
    return filteredTasks;
  } else if (path == '/archived') { // Display completed tasks.
    let filteredTasks = list.filter((tasks) => {
    return tasks.completed === true;
    })
    return filteredTasks;
  }
}
