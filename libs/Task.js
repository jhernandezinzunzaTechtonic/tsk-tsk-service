
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

export const calcDaysOld = (dateAdded, currentDate) => {
  var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  dateAdded = new Date(dateAdded).getTime();
  currentDate = new Date().getTime();
  var daysOld = currentDate - dateAdded;
  var difference = (daysOld / oneDay);

  // If it isnt a full 24 hours old, return 0,  we can add range to this in the future.
  if (difference < .99) {
    return 0;
  } else {
    return Math.round(daysOld / oneDay);
  }
};

const sortByLevel = (taskList) => {
  return taskList.sort((a, b) => {
    let aDate = new Date(a.dateAdded);
    let bDate = new Date(b.dateAdded);

    if (a.level > b.level) return -1;
    if (a.level < b.level) return 1;

    if (a.level === 1 && b.level === 1) {
      if (aDate.getTime() > bDate.getTime()) return 1;
      if (aDate.getTime() < bDate.getTime()) return -1;
      if (a.dueDate > b.dueDate) return 1;
      if (a.dueDate < b.dueDate) return -1;
    }

    if (aDate.getTime() > bDate.getTime()) return -1;
    if (aDate.getTime() < bDate.getTime()) return 1;
    if (a.dueDate > b.dueDate) return -1;
    if (a.dueDate < b.dueDate) return 1;
  });
};

export const sortTasks = (taskList) => {

  let sortedTaskList = taskList.map(task => {

    let currentDate = new Date().toDateString();
    var daysOld = calcDaysOld(task.dateAdded, currentDate);
    var daysPastDue = calcDaysOld(task.dueDate, currentDate);
    var dueDate = new Date(task.dueDate).toDateString();
    var dateAdded = new Date(task.dateAdded).toDateString();
    var updatedTask = Object.assign({}, task);
    var level;

    if (task.completed === true) {
      level = 1;
    }

    if (dueDate > dateAdded && daysPastDue < 1) {
      level = 1;
      // return level;
    }

    if (task.dueDate === undefined && daysOld <= 3) {
      level = 1;
    } else if (task.dueDate) {
      level = 1;
    }

    if (task.dueDate === undefined && daysOld > 3) {
      level = 2;
    } else if (task.dueDate && daysPastDue >= 1) {
      level = 2;
    }

    if (task.dueDate === undefined && daysOld > 6) {
      level = 3;
    } else if (task.dueDate && daysPastDue >= 2) {
      level = 3;
    }

    if (task.dueDate === undefined && daysOld > 9) {
      level = 4;
    } else if (task.dueDate && daysPastDue >= 3) {
      level = 4;
    }

    if (task.dueDate === undefined && daysOld > 13) {
      level = 5;
    } else if (task.dueDate && daysPastDue >= 4) {
      level = 5;
    }

    updatedTask._doc.level = level;
    updatedTask._doc.daysOld = daysOld;
    updatedTask._doc.daysPastDue = daysPastDue;

    return updatedTask;
  });

  let finalSort = sortedTaskList.map(taskObj => taskObj._doc);

  return sortByLevel(finalSort);
};
