// Fiddle url: https://jsfiddle.net/okostyuk/u5ch2md7/

let currentDroppable;
let placeholder;

let tasks = document.getElementsByClassName("task");
let headers = document.getElementsByClassName("header");

const classExpand = "expandTask";
const classCollapse = "collapseTask";

function createPlaceholder() {
    let placeholder = document.createElement("div");
    placeholder.className = classExpand;
    placeholder.ondragover = function (e) {
        e.preventDefault();
    };
    return placeholder;
}

for (let task of tasks) {

    //  *** handle drag of this item    *** //
    task.draggable = true;
    task.ondragstart = function(event) {
        console.log("task onDragStart()");
        currentDroppable = task;
        event.dataTransfer.effectAllowed='move';
    };

    task.ondragend = function(event) {
        console.log("task ondragend "+ event.target.id);

        if (placeholder !== undefined) {
            placeholder.parentNode.replaceChild(currentDroppable, placeholder);
            task.style.display = '';
            placeholder = undefined;
        }
        currentDroppable = null;

        let placeholders = document.getElementsByClassName(classCollapse);
        for (let item of placeholders) {
            item.remove();
        }
    };

    //  *** drag over this item events handling   *** //
    task.ondragenter = function (event) {
        console.log("task " + task.id + ": ondragenter");
        if (task === currentDroppable) {
            placeholder = createPlaceholder();
            placeholder.className = "taskPlaceholder";
            task.after(placeholder);
            task.style.display = 'none';
            //do something?
        } else {
            //hide previous placeholder and show new placeholder
            if (placeholder !== undefined) {
                placeholder.className = classCollapse;
            }
            placeholder = createPlaceholder();
            task.dropaplePlaceholder = placeholder;
            task.dropaplePlaceholder.classList.add(classExpand);
            task.after(task.dropaplePlaceholder);
        }
    };

    task.ondragover = function (event) {
        event.preventDefault(); //ugly hack to make this Element dropable
    };
}

for (let header of headers) {

    header.ondragover = function (event) {
        event.preventDefault(); //ugly hack to make ondrop() works
    };

    header.ondragenter = function (event) {
        console.log("header: ondragenter");

        if (placeholder !== undefined) {
            placeholder.className = classCollapse;
        }

        placeholder = createPlaceholder();
        header.after(placeholder);
    };
}

