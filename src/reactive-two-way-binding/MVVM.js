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
        && e.tagName === 'FORM'
        && e.hasAttribute('bindTo')
    );

    for (let element of elements) {
        let propertyName = element.getAttribute('bindTo');
        console.log('bind ' + element.id + ' to ' + propertyName);

        if (element.tagName === 'FORM') {
            element.addEventListener('listChanged', function () {
                console.log("listChanged handled");
                for (let inputElement of element.getElementsByTagName('input')) {
                    inputElement.addEventListener('change', function () {
                        console.log("input element change");
                    });
                }
            });

            modelChangesHandler.listeners.set(propertyName, function (hotelsList) {
                for (let hotel of hotelsList) {
                    element.append(hotelToInputElement(hotel));
                }
                element.trigger('listChanged');
            });
        }

        element.addEventListener('change', function (e) {
            if (e.isTrusted) {
                model[propertyName] = e.target.value;
            }
        });

    }

    return new Proxy(model, modelChangesHandler);
}

function hotelToInputElement(hotel) {
    return '<input type="radio" id="contactChoice1\" name="contact" value="email" checked>' +
        '<label for="contactChoice1">Email</label>';
}

class ViewModel {

    constructor(view, model) {
        this.view = view;
        this.model = bind(view, {});

        this.repository = {
            getHotels: function () {
                let result = [];
                for (let i=0; i<10; i++) {
                    result[i] = { name: "Hotel " + i, price: Math.random() * 100 }
                }
            }
        };

        model.hotels = this.repository.getHotels();
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