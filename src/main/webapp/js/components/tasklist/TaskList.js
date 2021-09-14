// Implementering taskbox
export default class extends HTMLElement {
	
	// Private
    #cssfile = "tasklist.css";
    #shadow;
    #newtaskCallbacks = new Map();
    #taskCallbackId = 0;

    #changestatusCallbacks = new Map();
    #statusCallbackId = 0;

    #deletetaskCallbacks = new Map();
    #deleteCallbackId = 0;

    #listContainer;
    #messageContainer;

    constructor() {
        super();

        this.allstatuses = null

        this.#shadow = this.attachShadow({ mode: 'open' });
        this.#createLink();
        this.#createHTML();
        this.#listContainer = this.#shadow.getElementById("tasklist");
        this.#messageContainer = this.#shadow.getElementById("message");

        this.#shadow.querySelector("button").addEventListener("click", this.#addtask.bind(this));
    }

	// Metoder som skal implementeres
	
	// Denne skal oppdatere view
	enableaddtask() {
	
		this.#shadow.querySelector("button").disabled = false;
	}
	
	addtaskCallback(callback) {
	
		this.#newtaskCallbacks.set(this.#taskCallbackId, callback);
        const prevId = this.#taskCallbackId;
        ++this.#taskCallbackId;
        return prevId;
	}
	
	changestatusCallback(callback) {
	
		this.#changestatusCallbacks.set(this.#statusCallbackId, callback);
        const prevId = this.#statusCallbackId;
        ++this.#statusCallbackId;
        return prevId;
	}
	
	deletetaskCallback(callback) {
	
		this.#deletetaskCallbacks.set(this.#deleteCallbackId, callback);
        const prevId = this.#deleteCallbackId;
        ++this.#deleteCallbackId;
        return prevId;
	}
	
	noTask() {
	
		if (this.#numtasks == 0) {
            this.#listContainer.textContent = "";
            this.#showMessage("No tasks were found.");
        }
	}
	
	showTask(task) {
	
		if (!this.allstatuses) return;
		
        if (task.title.trim() == "") return;

        if (this.#shadow.querySelectorAll('table').length == 0) {
            this.#initHTMLTable();
        }

        const tbody = this.#listContainer.querySelector("tbody");
        const row = tbody.insertRow(0);
        row.setAttribute("data-identity", task.id);
        row.insertCell(-1).textContent = task.title;
        row.insertCell(-1).textContent = task.status;

        const selectcell = row.insertCell(-1);
        const selectElm = document.createElement("select");
        selectElm.addEventListener('change', this.#statusUpdate.bind(this));
        const optElm = document.createElement("option");
        optElm.value = "0";
        optElm.textContent = "<Modify>";
        optElm.defaultSelected = true;
        selectElm.add(optElm);
        this.allstatuses.forEach((status) => {
            const optElm = document.createElement("option");
            optElm.value = status;
            optElm.text = status;

            if (status == task.status) optElm.disabled = true
            selectElm.add(optElm);

        });
        selectcell.appendChild(selectElm);

        const deletecell = row.insertCell(-1)
        const deleteElm = document.createElement("button")
        deleteElm.type = "button"
        deleteElm.addEventListener('click', this.#deleteTask.bind(this))
        deleteElm.textContent = "Remove"
        deletecell.appendChild(deleteElm)

        this.#numtaskMessage();
	}
	
	updateTask(task) {
	
		const row = this.#listContainer.querySelector(`tr[data-identity="${task.id}"]`);
		
        if (!row) return;

        row.cells[1].textContent = task.status;
        const selectElm = row.cells[2].firstElementChild;
        selectElm.selectedIndex = 0;
        Array.from(selectElm.options).forEach(
            (optElm) => {
	
                if (optElm.value == task.status) {
                    optElm.disabled = true;

                } else {
                    optElm.disabled = false;
                }
            }
        )
	}
	
	// Denne skal oppdatere view

	removeTask(id) {
	
		const row = this.#listContainer.querySelector(`tr[data-identity = "${id}"]`);
        row.remove();

        if (this.#numtasks == 0) {
            this.noTask();
        }
        this.#numtaskMessage();
	}

    #initHTMLTable() {
        this.#listContainer.innerHTML = `
        <table>
            <thead><tr><th>Task</th><th>Status</th></tr></thead>
            <tbody></tbody>
        </table>`;
    }

    #createLink() {
        const link = document.createElement('link');
        const path = import.meta.url.match(/.*\//)[0];
        link.href = path.concat(this.#cssfile);
        link.rel = "stylesheet";
        link.type = "text/css";
        this.#shadow.appendChild(link);
    }

    #createHTML() {
        const wrapper = document.createElement('div');
        wrapper.classList.add("hidden");

        const content = `
        <div>
            <div id="message"><p>Waiting for server data.</p></div>
            <div id="newtask"><button type="button" disabled>New task</button></div>
            <div id="tasklist"></div>
        </div>
        `;

        wrapper.insertAdjacentHTML('beforeend', content);
        this.#shadow.appendChild(wrapper);
        return wrapper;
    }

    #addtask() {
        this.#newtaskCallbacks.forEach(
            callback => { callback() }
        );
    }

    get #numtasks() {
	
        if (this.#shadow.querySelectorAll('table').length == 0) return 0;
        if (this.#shadow.querySelector('table').tBodies.length == 0) {
            console.log("TBODY exist, but with no rows. This should not have happened.");
            return 0;
        }
        return this.#shadow.querySelector('table').tBodies[0].rows.length;
    }

    #showMessage(message) {
        this.#messageContainer.textContent = "";
        const messageElement = document.createElement("p");
        messageElement.textContent = message;
        this.#messageContainer.appendChild(messageElement);
    }

    #statusUpdate(event) {
        const elm = event.target;
        const newStatus = elm.value;

        if (elm.value == 0) return;
        //const id=this.getTaskIdOfRow(elm.parentNode.parentNode)
        const id = elm.parentNode.parentNode.getAttribute("data-identity");
        if (window.confirm(`Set '${elm.parentNode.parentNode.cells[0].textContent}' to ${newStatus}?`)) {
            this.#changestatusCallbacks.forEach(callback => callback(id, newStatus))
        } else {
            elm.selectedIndex = 0;
        }
    }

    #numtaskMessage() {
        const numtasks = this.#numtasks;

        if (this.numtasks == 0) {
            this.#showMessage("No tasks were found.");
        } else if (numtasks == 1) {
            this.#showMessage("Found 1 task.");
        } else {
            this.#showMessage(`Found ${numtasks} tasks.`);
        }
    }

    #deleteTask(event) {
        const elm = event.target;
        const id = elm.parentNode.parentNode.getAttribute("data-identity");
        const taskTitle = elm.parentNode.parentNode.cells[0].textContent;

        if (window.confirm(`Delete task '${taskTitle}'?`)) {
            this.#deletetaskCallbacks.forEach(callback => callback(id));
        }
    }

}



















