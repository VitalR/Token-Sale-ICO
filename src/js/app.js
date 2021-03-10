App = {
    web3Provider: null,
    contracts: {},
    account: '0x0',
    loading: false,
    tokenPrice: 1000000000000000,
    tokensSold: 0,
    tokensAvailable: 750000,

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
                App.listenForEvents() 
                return App.render()
            })
        })           
    },

    // Listen for events emitted from the contract
    listenForEvents: function() {
        App.contracts.TokenSale.deployed().then(function(instance) {
            instance.Sell({}, {
                fromBlock: 0,
                toBlock: 'latest'
            }).watch(function(error, event) {
                console.log('event triggered', event)
                App.render()
            })
        })
    },

    
    render: function() {
        if(App.loading) {
            return;
        }
        App.loading = true;

        let loader =  $('#loader')
        let content = $('#content')

        loader.show()
        content.hide()

        // Load account data
        web3.eth.getCoinbase(function(err, account) {
            if(err === null) {
                App.account = account
                $('#accountAddress').html('Your Account: ' + account)
            }
        })

        // Load token sale contract
        App.contracts.TokenSale.deployed().then(function(instance) {
            console.log('instance: ', instance)
            tokenSaleInstance = instance
            return tokenSaleInstance.tokenPrice()
        }).then(function(tokenPrice) {
            console.log('tokenPrice: ', tokenPrice)
            App.tokenPrice = tokenPrice
            $('.token-price').html(web3.fromWei(App.tokenPrice, 'ether').toNumber())
            return tokenSaleInstance.tokensSold()
        }).then(function(tokensSold) {
            App.tokensSold = tokensSold.toNumber()
            // App.tokensSold = 500000
            $('.tokens-sold').html(App.tokensSold)
            $('.tokens-available').html(App.tokensAvailable)

            let progressPercent = (Math.ceil(App.tokensSold) / App.tokensAvailable) * 100
            $('#progress').css('width', progressPercent + '%')

            // Load token contract
            App.contracts.ArtToken.deployed().then(function(instance) {
                tokenInstance = instance
                return tokenInstance.balanceOf(App.account)
            }).then(function(balance) {
                $('.art-balance').html(balance.toNumber())
                
                App.loading = false
                loader.hide()
                content.show()
            })
        })
    },

    buyTokens: function() {
        $('#content').hide()
        $('#loader').show()
        let numberOfTokens = $('#numberOfTokens').val()
        App.contracts.TokenSale.deployed().then(function(instance) {
            return instance.buyTokens(numberOfTokens, {
                from: App.account,
                value: numberOfTokens * App.tokenPrice,
                gas: 700000 // Gas limit
            })
        }).then(function(result) {
            console.log('Tokens bought...')
            $('form').trigger('reset') // reset number of tokens in form
            // Wait fot sell event
            // $('#loader').hide()
            // $('#content').show()
        })
    }  
}


$(function() {
    $(window).load(function() {
        App.init()
    })
})