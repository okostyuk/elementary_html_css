const userModel = {
    fname: 'oleg',
    lname: 'kostiuk'
};

function printModel() {
    console.log('user.fname = '+ userModel.fname + ' user.lname = ' + userModel.lname);
}

function bind(view, model) {
    let modelChangesHandler = {
        listeners: new Map(),

        set: function(obj, prop, value) {
            console.log('Model changed: ' + prop + ' = ' + value);
            obj[prop] = value;
            if (this.listeners.has(prop)) {
                this.listeners.get(prop).call(this, value);
            }
            return true;
        }
    };

    let elements = Array.from(view.getElementsByClassName('bindable')).filter( e =>
        e !== undefined
        && e.tagName === 'INPUT'
        && e.hasAttribute('bindTo')
    );

    for (let element of elements) {
        let propertyName = element.getAttribute('bindTo');
        console.log('bind ' + element.id + ' to ' + propertyName);
        element.addEventListener('change', function (e) {
            if (e.isTrusted) {
                model[propertyName] = e.target.value;
            }
        });
        modelChangesHandler.listeners.set(propertyName, function (updatedValue) {
            element.value = updatedValue;
        });
    }

    return new Proxy(model, modelChangesHandler);
}

class ViewModel {

    constructor(view, model) {
        this.view = view;
        this.model = bind(view, model);
    }
}



document.addEventListener("DOMContentLoaded", function() {
    let userView = document.getElementById('user');

    let viewModel = new ViewModel(userView, userModel);
    document.getElementById('testButton').addEventListener('click', function () {
        console.log("click");
        viewModel.model.fname = "Changed Name";
    })
});