// Fiddle url: https://jsfiddle.net/okostyuk/u5ch2md7/

let currentDroppable;

let tasks = document.getElementsByClassName("task");
let headers = document.getElementsByClassName("header");

function hidePreview(dragStartEvent) {
    var copyItem = this.cloneNode(true);
    copyItem.style.display = "none";
    dragStartEvent.dataTransfer.setDragImage(copyItem, 0, 0);
}

function initStaticPos(dragStartEvent, task) {
    task.shiftX = dragStartEvent.clientX - task.getBoundingClientRect().left;
    task.shiftY = dragStartEvent.clientY - task.getBoundingClientRect().top;
    task.style.left = dragStartEvent.pageX-task.shiftX +'px';
    task.style.top = dragStartEvent.pageY-task.shiftY + 'px';
}

function updateStaticPos(event, task) {
    task.style.left = event.pageX-task.shiftX +'px';
    task.style.top = event.pageY-task.shiftY + 'px';
}

const draggedClass = "draged";
const expandClass = "expandTask";
const classCollapse = "collapseTask";

function createPlaceholder() {
    return document.createElement("div");
}

function createDragPreview(task) {
    //make preview and move it off the screen
    let preview = task.cloneNode(true);
    preview.style.position = 'absolute';
    preview.style.left = '-500px';
    return preview;
}

for (let task of tasks) {

    //  *** handle drag of this item    *** //
    task.draggable = true;
    task.ondragstart = function(event) {
        console.log("task onDragStart()");
        currentDroppable = task;
        task.dragPreview = createDragPreview(task);
        document.body.appendChild(task.dragPreview);
        event.dataTransfer.setDragImage(task.dragPreview, 0, 0);
        task.classList.add(draggedClass);
    };

    task.ondragend = function(event) {
        console.log("task ondragend "+ event.target.id);
        task.classList.remove(draggedClass);
        task.dragPreview.remove();
        currentDroppable = null;
    };

    //  *** drag over this item events handling   *** //
    task.ondragenter = function (event) {
        console.log("task " + task.id + ": ondragenter");
        if (task === currentDroppable) {
            //do something?
        } else {
            //hide previous placeholder and show new placeholder
            task.dropaplePlaceholder = createPlaceholder();
            task.dropaplePlaceholder.classList.add(expandClass);
            task.after(task.dropaplePlaceholder);
        }
    };

    task.ondragover = function (event) {
        event.preventDefault(); //ugly hack to make this Element dropable
    };

    task.ondragleave = function (event) {
        console.log("task " + task.id + ": ondragleave ph=" + task.dropaplePlaceholder);
        if (task.dropaplePlaceholder !== undefined) {
            task.dropaplePlaceholder.classList.replace(expandClass, classCollapse);
            task.dropaplePlaceholder = undefined;
        }
    };

    task.ondrop = function () {
        console.log("task " + task.id + ": ondrop ph=" + task.dropaplePlaceholder);
        if (task.dropaplePlaceholder !== undefined) {
            task.dropaplePlaceholder.remove();
            task.after(currentDroppable);
        }
    };
}

for (let header of headers) {

    header.ondragover = function (event) {
        event.preventDefault(); //ugly hack to make ondrop() works
    };

    header.ondragenter = function (event) {
        console.log("header: ondragenter");

        header.dropaplePlaceholder = createPlaceholder();
        header.dropaplePlaceholder.classList.add(expandClass);
        header.after(header.dropaplePlaceholder);
    };

    header.ondragleave = function (event) {
        console.log("header: ondragleave ph=" + header.dropaplePlaceholder);
        if (header.dropaplePlaceholder !== undefined) {
            header.dropaplePlaceholder.classList.replace(expandClass, classCollapse);
            header.dropaplePlaceholder = undefined;
        }
    };

    header.ondrop = function () {
        console.log("header: ondrop");
        if (header.dropaplePlaceholder !== undefined) {
            header.dropaplePlaceholder.remove();
            header.after(currentDroppable);
        }
    }
}

