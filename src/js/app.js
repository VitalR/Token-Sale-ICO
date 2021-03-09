App = {
    web3Provider: null,
    contracts: {},
    account: '0x0',

    init: function() {
        console.log("App initialized...")
        return App.initWeb3()
    },

    initWeb3: function() {
        if (typeof web3 !== 'undefined') {
            // If a web3 instance is already provided by Meta Mask.
            App.web3Provider = web3.currentProvider;
            web3 = new Web3(web3.currentProvider);
          } else {
            // Specify default instance if no web3 instance provided
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
            web3 = new Web3(App.web3Provider);
        }    

        return App.initContract()
    },

    initContract: function() {
        $.getJSON("TokenSale.json", function(tokenSale) {
            App.contracts.TokenSale = TruffleContract(tokenSale)
            App.contracts.TokenSale.setProvider(App.web3Provider)
            App.contracts.TokenSale.deployed().then(function(tokenSale) {
                console.log('Art Token Sale Contract Address: ', tokenSale.address)
            })
        }).done(function() {
            $.getJSON("ArtToken.json", function(artToken) {
                App.contracts.ArtToken = TruffleContract(artToken)
                App.contracts.ArtToken.setProvider(App.web3Provider)
                App.contracts.ArtToken.deployed().then(function(artToken) {
                    console.log('Art Token Contract Address: ', artToken.address)
                })
            })
        })
            // App.listenForEvents()
        return App.render()
    },
    
    render: function() {
        // Load account data
        web3.eth.getCoinbase(function(err, account) {
            if(err === null) {
                App.account = account
                $('#accountAddress').html('Your Account: ' + account)
            }
        })
    }   
}


$(function() {
    $(window).load(function() {
        App.init()
    })
})