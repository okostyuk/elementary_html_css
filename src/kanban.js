// Fiddle url: https://jsfiddle.net/okostyuk/u5ch2md7/

let currentDroppable;
let placeholder;

for (let task of document.getElementsByClassName("task")) {
    task.draggable = true;
    task.ondragstart = () => {
        currentDroppable = task;
        setTimeout( () =>
            task.parentNode.replaceChild(createPlaceholder("taskPlaceholder"), currentDroppable), 1);
    };

    task.ondragend = () => {
        placeholder.parentNode.replaceChild(currentDroppable, placeholder);
        placeholder = undefined;
        currentDroppable = undefined;
    };

    task.ondragenter = () => expandPlaceholderBelow(task);
}

for (let header of document.getElementsByClassName("header")) {
    header.ondragenter = () => expandPlaceholderBelow(header);
}

function expandPlaceholderBelow(element) {
    if (currentDroppable === undefined) return;
    element.after(createPlaceholder("expandTask"));
}

function createPlaceholder(className) {
    if (placeholder !== undefined) {
        let previousPlaceholder = placeholder;
        previousPlaceholder.className = "collapseTask";
        setTimeout( () => previousPlaceholder.remove(), 500);
    }

    placeholder = document.createElement("div");
    placeholder.className = className;
    return placeholder;
}

//disable default animations fro DnD
document.ondragover = e => e.preventDefault();