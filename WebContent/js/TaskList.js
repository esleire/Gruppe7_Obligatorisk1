/**
 * TaskList from exercise on components
 */

class TaskList {
	constructor(task) {
		// Ikke nødvendigvis at vi trenger noe her
		this.task = task;
	}
	
}

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
	
	const taskList = this.shadow.querySelector("task-list");
	
	taskList.remove(taskID);
}















