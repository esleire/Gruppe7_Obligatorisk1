export default class extends HTMLElement {
	constructor() {
		// Ikke nødvendigvis at vi trenger noe her
		this.content = this.content.bind(this);
		const shadow = this.attachShadow({ mode: 'closed' });
		shadow.appendChild(this.content);

		const tasklist = document.querySelector("task-list");
		tasklist._enableaddtask();
	}



}


const taskList;

// Metoder som skal implementeres

// Vet at det er stavet feil her, men siden det er dette navnet Bjarte har brukt så gjør jeg det også
// Denne skal oppdatere view
function enableaddtask() {

	// After button is pushed the task is enabled?
	// Kan være noe vanskelig her da det er vanskelig å tolke hva som ligger i "enabled"
	// Denne metoden skal enable "New task" knappen

	return null;
}

function addtaskCallback() {

	return null;
}

function changestatusCallback() {

	return null;
}

function deletetaskCallback() {

	return null;
}

function noTask() {

	return null;
}

function showTask() {

	return null;
}

function updateTask() {

	return null;
}

// Denne skal oppdatere view

// Skjønner ikke helt hvordan han mener at vi skal kunne fjerne på index uten å ta inn listen som parameter også?
function removeTask(taskID) {

	taskList.splice(taskID, 1);
}

function content() {
	const root = document.createElement('div');
	const content = `
		
		<p> Waiting for server data </p> 
				
		<button type="button" > New Task </button>

		`;

	root.insertAdjacentHTML('beforeend', content);
	return root;

}
















