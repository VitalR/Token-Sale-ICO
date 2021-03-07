const ArtToken = artifacts.require("./ArtToken.sol")
const ArtTokenSale = artifacts.require("./ArtTokenSale.sol")

module.exports = function(deployer) {
  deployer.deploy(ArtToken, 1000000).then(function() {
    // Token price is 0.001 Ether
    let tokenPrice = 1000000000000000;
    return deployer.deploy(ArtTokenSale, ArtToken.address, tokenPrice)
  })
}
