const Migrations = artifacts.require('./Migrations.sol')
const CarSale = artifacts.require("./CarSale.sol")


module.exports = function (deployer) {
  deployer.deploy(Migrations)
  deployer.deploy(CarSale)
}
