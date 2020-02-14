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

    processParam: function(node, bindingParamName, viewModelPropertyName) {
        console.log('processParam ' + node + ' ' + bindingParamName + ' ' + viewModelPropertyName);
        if ('change' === bindingParamName) {
            node.addEventListener('change', e => this.viewModel[viewModelPropertyName].call(this, e.target.value));
        } else if ('text' === bindingParamName) {
            this.property2node.set(viewModelPropertyName, node);
            let modelProperty =  this.viewModel[viewModelPropertyName];
            if (typeof modelProperty === 'function') {
                node.innerHTML = modelProperty.call(this);
            } else {
                node.innerHTML = modelProperty;
            }
        }
    },

    observable: function (propertyName) {
        console.log('observable('+ propertyName + ')');
        let valueHolder = {
            value: undefined
        };

        let resultFunctionHolder = { value: 'asd'};
        let resultFunction =  function (updatedValue) {
            if (arguments.length > 0) {
                valueHolder.value = updatedValue;
                console.log(propertyName + ' = ' + updatedValue);
                let inputNode = binder.property2node.get(propertyName);
                binder.parseNode(inputNode);
            }
            return valueHolder.value;
        };
        resultFunctionHolder.value = resultFunction;

        return resultFunction;
    }
};

const viewModel = {

    model: {
        hotels: [
            {id: '1', name: 'hotel_1', price: '1'},
            {id: '2', name: 'hotel_2', price: '2'},
            {id: '3', name: 'hotel_3', price: '3'},
            {id: '4', name: 'hotel_4', price: '4'},
            {id: '5', name: 'hotel_5', price: '5'}
        ]
    },

    displayedHotels: [],
    selectedHotel: undefined,
    checkinDate: '55555',
    checkoutDate: '',

    nightsCount: binder.observable('nightsCount'),
    totalPrice: 0,

    checkinDateChanged: function (updatedValue) {
        console.log('checkinDateChanged ' + updatedValue);
        viewModel.checkinDate = updatedValue;
        viewModel.nightsCount(updatedValue);
        console.log("nightsCountTest = " + viewModel.nightsCount());
    },

    checkoutDateChanged: function (updatedValue) {

    },

    selectHotel: function (hotelId) {

    }

};

binder.applyBindings(viewModel);
