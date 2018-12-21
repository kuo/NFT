var mongoose = require('../mongo-connect');

/**
 * transact_address: 合約位址
 * transact_create_date: 發送時間
 * transact_complete_date: 完成時間
 * transact_gas: 手續費
 * transact_type: deploy or transfer
 * transact_chain: eth or dexon
 */
var ContractSchema = new mongoose.Schema({
    transact_address: { type: String },
    transact_create_date: { type: String },
    transact_complete_date: { type: String },
    transact_wasted_time: { type: String },
    transact_gas: { type: String },
    transact_type: { type: String },
    transact_chain: { type: String }
});

module.exports = mongoose.model('tb_trans_record', ContractSchema);