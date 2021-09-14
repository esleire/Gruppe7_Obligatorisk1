import config from './modules/config.js';
import TaskList from './components/tasklist/TaskList.js';
import TaskBox from './components/taskbox/TaskBox.js';

const main = {
    run() {
        customElements.define('task-list', TaskList);
        customElements.define('task-box', TaskBox);

        this.tasklist = document.querySelector("task-list");
        this.taskbox = document.querySelector("task-box");

        this.tasklist.addtaskCallback(this.taskbox.show.bind(this.taskbox));
        this.tasklist.changestatusCallback(this.changeTaskstatus.bind(this));
        this.tasklist.deletetaskCallback(this.deleteTask.bind(this));

        this.taskbox.newtaskCallback(this.addTask.bind(this));

        this.getAllStatuses();
    },

    
    async getAllStatuses() {
        const url = `${config.servicesPath}/allstatuses`;
        try {
            const response = await fetch(url, { method: "GET" });
            try {
                const statusList = await response.json();

                if (statusList.responseStatus) {
                    if (statusList.allstatuses) {
                        this.tasklist.allstatuses = statusList.allstatuses;
                        this.taskbox.allstatuses = statusList.allstatuses;
                        this.getTasks();
                    }
                }
            } catch (error) {
                console.log(error);
            }
        } catch (error) {
            console.log(error);
        }
    },

  
    async getTasks() {
        const url = `${config.servicesPath}/tasklist`;

        try {
            const response = await fetch(url, { method: "GET" });
            try {
                const tasks = await response.json();
                if (tasks.responseStatus) {
                    if (tasks.tasks.length == 0) {
                        this.tasklist.noTask();
                    } else {
                        for (let t of tasks.tasks) {
                            this.tasklist.showTask(t);
                        }
                    }
                    this.tasklist.enableaddtask();               
                }
            } catch (error) {
                console.log(error);
            }
        } catch (error) {
            console.log(error);
        }
    },

  
    async changeTaskstatus(id, newStatus) {
        const url = `${config.servicesPath}/task/${id}`;
        try {
            const response = await fetch(url, {
                method: "PUT",
                headers: { "Content-Type": "application/json; charset=utf-8" },
                body: JSON.stringify({ 'status': newStatus })
            });
            try {
                const task = await response.json();
                if (task.responseStatus) {
                    this.tasklist.updateTask({ 'id': task.id, 'status': task.status });
                }
            } catch (error) {
                console.log(error);
            }
        } catch (error) {
            console.log(error);
        }
    },

   
    async deleteTask(id) {
        const url = `${config.servicesPath}/task/${id}`;
        try {
            const response = await fetch(url, { method: "DELETE" });
            try {
                const deletetask = await response.json();
                if (deletetask.responseStatus) {
                    if (id == deletetask.id) {
                        this.tasklist.removeTask(id);
                    } else {
                        console.log('Something is wrong');
                    }
                }
            } catch (error) {
                console.log(error);
            }
        } catch (error) {
            console.log(error);
        }
    },

   
    async newTask(task) {
        const url = `${config.servicesPath}/task`;
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json; charset=utf-8" },
                body: JSON.stringify(task)
            });
            try {
                const newtask = await response.json();
                if (newtask.responseStatus) {
                    this.tasklist.showTask(newtask.task);
                } else {
                    console.log('Something went wrong, could not add task');
                }
            } catch (error) {
                console.log(error);
            }
        } catch (error) {
            console.log(error);
        }
    },


    addTask(task) {
        if (task.title == "") {
            window.alert("Your task needs a title");
        } else {
            this.taskbox.close();
            this.newTask(task);
        }
    }
};

main.run();