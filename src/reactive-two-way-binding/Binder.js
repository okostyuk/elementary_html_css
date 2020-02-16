const binder = {
    viewModel: undefined,

    property2node: new Map(),

    applyBindings: function (viewModel) {
        this.viewModel = viewModel;
        document.querySelectorAll('[data-bind]').forEach(inputNode => binder.parseNode(inputNode));
    },

    parseNode: function(inputNode) {
        inputNode.getAttribute('data-bind').split(",").map(value => {
                let param = value.split(':');
                binder.processParam(inputNode, param[0], param[1].trim());
            })
    },

    processParam: function(node, bindingParamName, bindingParamValue) {
        console.log('processParam ' + node + ' ' + bindingParamName + ' ' + bindingParamValue);
        switch (bindingParamName.trim()) {
            case 'change':
                node.addEventListener('change', e => this.viewModel[bindingParamValue].call(this, e.target.value));
                break;
            case 'items':
            case 'text':
                this.property2node.set(bindingParamValue, node);
                let modelPropertyValue =  this.viewModel[bindingParamValue];
                this.updateNodeValue(node,  modelPropertyValue);
                break;
            default:
                console.error("Unsupported binding param: " + bindingParamName);
        }
    },

    updateNodeValue: function(node, nodeValue) {
        let computedValue = (typeof nodeValue === 'function') ? nodeValue.call() : nodeValue;
        console.log('updateNodeValue() ' + node.tagName + " " + computedValue);
        switch (node.tagName) {
            case 'P':
            case 'B':
                node.innerHTML = computedValue;
                break;
            case 'SELECT':
                node.innerHTML = '';
                let placeholder = document.createElement('option');
                placeholder.disabled = true;
                placeholder.text = "Choose ...";
                placeholder.selected = true;
                node.add(placeholder);
                nodeValue.forEach(item => {
                    let option = document.createElement("option");
                    option.text = item.name;
                    option.value= item.price;
                    node.add(option);
                });
                break;
            default:
                console.error("Unsupported tag: " + node.tagName);
        }
    },

    observable: function (initialValue) {
        let valueHolder = { value: initialValue };
        let selfHolder = { value: undefined};
        let self = function (updatedValue) {
            if (arguments.length === 0) { //means function called to get value
                return valueHolder.value;
            }

            valueHolder.value = updatedValue;
            Object.keys(this).forEach( propertyName => {
                if (this[propertyName] === selfHolder.value) {
                    let inputNode = binder.property2node.get(propertyName);
                    binder.updateNodeValue(inputNode, updatedValue);
                }
            });
        };
        selfHolder.value = self;
        return self;
    }
};

class ViewModel {

    selectedRoomPrice = undefined;
    checkinDate = undefined;
    checkoutDate = undefined;

    displayedRooms = [
        {name: 'hotel_1 1 Bed', price: 1.00},
        {name: 'hotel_2 2 Bed', price: 2.00},
        {name: 'hotel_3 3 Bed', price: 3.00},
        {name: 'hotel_4 7 Bed', price: 7.00},
        {name: 'hotel_5 9 Bed', price: 9.00}
    ];

    nightsCount = binder.observable(0);
    totalPrice = binder.observable(0);

    checkinDateChanged(updatedValue) {
        this.viewModel.checkinDate = new Date(updatedValue);
        this.viewModel.calculateDays();
        this.viewModel.calculate();
    };

    checkoutDateChanged(updatedValue) {
        this.viewModel.checkoutDate = new Date(updatedValue);
        this.viewModel.calculateDays();
        this.viewModel.calculate();
    };

    roomChanged(selectedRoomPrice) {
        console.log("price = " + selectedRoomPrice);
        this.viewModel.selectedRoomPrice = selectedRoomPrice;
        this.viewModel.calculate();
    }

    calculateDays() {
        if (this.checkinDate === undefined || this.checkoutDate === undefined) {
            return;
        }

        let diffDays = Math.ceil(Math.abs(this.checkinDate - this.checkoutDate) / (1000 * 60 * 60 * 24));
        this.nightsCount(diffDays);
    };

    calculate() {
        if (this.checkinDate === undefined || this.checkoutDate === undefined || this.selectedRoomPrice === undefined) {
            console.log(this.checkinDate + " " + this.checkoutDate + " " + this.selectedRoomPrice);
            return;
        }

        this.totalPrice(this.selectedRoomPrice * this.nightsCount());
    };
}

binder.applyBindings(new ViewModel());
