var contract = require('./ContractSchema');
var Dates = require('date-math');

module.exports = {

    saveTransRecord: async function(address, createDate, completeDate, gas, transType, chainName) {

        var c = new contract({
            transact_address: address,
            transact_create_date: createDate,
            transact_complete_date: completeDate,
            transact_wasted_time: Dates.second.diff(createDate, completeDate),
            transact_gas: gas,
            transact_type: transType,
            transact_chain: chainName
        });

        c.save();
    }
}