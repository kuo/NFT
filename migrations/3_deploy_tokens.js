var NToken = artifacts.require("./EtenToken.sol");

module.exports = function(deployer) {
    deployer.deploy(NToken);
};