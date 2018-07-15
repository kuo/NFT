var NToken = artifacts.require("./NonfungibleToken.sol");

module.exports = function(deployer) {
    //deployer.deploy(TutorialToken);
    deployer.deploy(NToken);
};