/**
  * TaskBox
  * Manage view to add a new task
  */

export default class extends HTMLElement {

    // Private fields
    #cssfile = "main.css";
    #shadow;
    #taskbox;
    #newtaskCallbacks = new Map();
    #taskCallbackId = 0;

    constructor() {
        super();

        this.#shadow = this.attachShadow({ mode: 'closed' });
        this.#createLink();
        this.#taskbox = this.#createHTML();

        this.#shadow.querySelector("span").addEventListener("click", this.close.bind(this));
        this.#shadow.querySelector("button").addEventListener("click", this.#addtask.bind(this));
    }

    /**
     * Opens the modal box of view
     * @public
     */
    show() {
        const inputElm = this.#shadow.querySelector("input");
        inputElm.value = "";
        this.#shadow.querySelector("select").selectedIndex = 0;
        this.#taskbox.classList.remove("hidden");

        // Adjust the width of the box to fit its content
        const modalwidth = this.#shadow.querySelector("table").getBoundingClientRect().width;
        const closeelmwidth = this.#shadow.querySelector("span").getBoundingClientRect().width;
        this.#shadow.querySelector("div>div").style.width = `${modalwidth + closeelmwidth + 40}px`;

        inputElm.focus();
    }

    /**
     * Set the list of possible task states
     * @public
     * @param{Array<Object>} statuslist
     */
    set allstatuses(statuslist) {
        const select = this.#shadow.querySelector("select");
        statuslist.forEach((status, i) => {
            const optelement = document.createElement('option')
            optelement.value = i
            optelement.textContent = status
            select.add(optelement)
        })
    }

    /**
     * Add callback to run at click on the "Add task" button
     * @public
     * @param {function} callback
     */
    newtaskCallback(callback) {
        this.#newtaskCallbacks.set(this.#taskCallbackId, callback);
        const prevId = this.#taskCallbackId;
        ++this.#taskCallbackId;
        return prevId;
    }

    /**
     * Closes the modal box
     * @public
     */
    close() {
        this.#taskbox.classList.add("hidden");
    }

    /**
     * Create LINK tag for the CSS file and append to the shadow DOM
     * @privat
     */
    #createLink() {
        const link = document.createElement('link');
        const path = import.meta.url.match(/.*\//)[0];
        link.href = path.concat(this.#cssfile);
        link.rel = "stylesheet";
        link.type = "text/css";
        this.#shadow.appendChild(link);
    }

    /**
     * Create the HTML skeleton of component and append to the shadow DOM
     * @privat
     */
    #createHTML() {
        const wrapper = document.createElement('div');
        wrapper.classList.add("hidden");

        const content = `
        <!-- Modal content -->
        <div>
            <span>&times;</span>
            <table>
                <tr><th>Title:</th><td><input type="text" size="25" maxlength="80" placeholder="Task title"/></td></tr>
                <tr><th>Status:</th><td><select></select></td></tr>
            </table>
           <p><button type="submit">Add task</button></p>
        </div>
        `;

        wrapper.insertAdjacentHTML('beforeend', content);
        this.#shadow.appendChild(wrapper);

        return wrapper;
    }

    /**
     * Create and return a task from the FORM elements of the modal box
     * @private
     * @return {Object}
     */
    get #task() {
        let task = {};
        if (!this.#taskbox.classList.contains("hidden")) {
            task.title = this.#shadow.querySelector("input").value;
            task.status = this.#shadow.querySelector("select").selectedOptions[0].textContent;
        }
        return task;
    }

    /**
     * Event listener to run at click on the "Add task" button
     * @privat
     */
    #addtask() {
        this.#newtaskCallbacks.forEach(
            callback => { callback(this.#task) }
        );
    }
}
