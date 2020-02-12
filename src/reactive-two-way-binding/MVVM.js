class ViewModel {

    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.printModel();
        this.subscribeForViewEvents();
        this.updateView();
    }

    updateModelProperty(name, value) {
        this.model[name] = value;
        this.printModel();
    }

    updateView() {
        for (let propName of Object.getOwnPropertyNames(this.model)) {
            let viewProp = document.getElementById(propName);
            if (viewProp.tagName === 'INPUT') {
                viewProp.value = this.model[propName];
            }
        }
    }

    printModel() {
        console.log('user.fname = '+ this.model.fname + ' user.lname = ' + this.model.lname);
    }

    subscribeForViewEvents() {
        for (let item of this.view.getElementsByClassName('bindable')) {
            console.log("subscribeForViewEvents() " + item.id);
            if (item.tagName === 'INPUT') {
                item.addEventListener('change', e=> this.updateModelProperty(item.id, e.target.value));
            }
        }
    }
}

document.addEventListener("DOMContentLoaded", function() {
    let userModel = {
        fname: 'oleg',
        lname: 'kostiuk'
    };

    let userView = document.getElementById('user');
    let viewModel = new ViewModel(userModel, userView);
});