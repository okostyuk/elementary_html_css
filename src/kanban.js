
let currentDroppable;

let tasks = document.getElementsByClassName("task");

for (let task of tasks) {
    task.draggable = true;
    //onDragStart(item);
    task.ondragstart = function(event) {
        currentDroppable = task;
        //task.style.position = 'absolute';

        //shiftX = event.clientX - task.getBoundingClientRect().left;
        //shiftY = event.clientY - task.getBoundingClientRect().top;
        //task.style.left = event.pageX-shiftX +'px';
        //task.style.top = event.pageY-shiftY + 'px';

        //task.remove();
        //document.body.append(task);

        task.classList.add("draged");
    };

    task.ondragend = function(event) {
        task.classList.remove("draged");
        console.log("ondragend "+ event.target.id) ;
        task.style.position = 'static';

        task.style.left = '';//event.pageX-shiftX +'px';
        task.style.top = '';//event.pageY-shiftY + 'px';

        let dragoverItems = document.getElementsByClassName("dragover");
        for (item in dragoverItems) {
            item.classList.remove("dragover");
        }

    };

    task.ondragenter = function (event) {
        if (task !== currentDroppable) {
            task.classList.add("dragover");
        }
    };
    task.ondrop = function () {
        task.classList.remove("dragover");
    };
    task.ondragleave = function (event) {
        task.classList.remove("dragover");
        task.parent.classList.remove("dragower");
    }
}

columns = document.getElementsByClassName("column");

for (let column of columns) {
    let hierarchyLevel = 0;
    column.ondragenter = function(event) {
        console.log("ondragenter "+ event.target.id);
        hierarchyLevel++;
        if (currentDroppable.parentNode !== column){
            column.classList.add("dragower");
        }
    };

    column.ondragover = function (event) {
        event.preventDefault(); //ugly hack to make ondrop() works
    };

    column.ondrop = function (event) {
        console.log("ondrop " + event.target.id);
        column.classList.remove("dragower");
        column.parentNode.classList.remove("dragower");
        currentDroppable.remove();
        column.append(currentDroppable);
    };

    column.ondragleave = function(event) {
        console.log("ondragleave " + event.target.id);
        if (hierarchyLevel === 1) {
            column.classList.remove("dragower");
        }
        hierarchyLevel--;
    };

}

