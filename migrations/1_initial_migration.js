const CarSale = artifacts.require("./CarSale.sol")


module.exports = function (deployer) {
  deployer.deploy(CarSale)
}
