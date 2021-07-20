App = {
  web3Provider: null,
  contracts: {},
  names: new Array(),
  minter:null,
  currentAccount:null,
  transaction:0,
  flag:false,
  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
        // Is there is an injected web3 instance?
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      // If no injected web3 instance is detected, fallback to the TestRPC
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:9545');
    }
    web3 = new Web3(App.web3Provider);
    App.populateLists();
    return App.initContract();
  },

  initContract: function() {
      $.getJSON('Event.json', function(data) {
    // Get the necessary contract artifact file and instantiate it with truffle-contract
        var eventArtifact = data;
        App.contracts.vote = TruffleContract(eventArtifact);

    // Set the provider for our contract
        App.contracts.vote.setProvider(App.web3Provider);
        //App.getMinter();
        App.currentAccount = web3.eth.coinbase;
        App.populateVariables();
        jQuery('#curr_account').text(web3.eth.coinbase);
        return App.bindEvents();
      });
  },

  bindEvents: function() {

    $(document).on('click', '#enter_artist_address', function(){ App.handleArtist(jQuery('#enter_artist_address').val()); });
    $(document).on('click', '#enter_sponsor_address', function(){ App.handleSponsor(jQuery('#enter_sponsor_address').val()); });
    $(document).on('click', '#enter_venue_address', function(){ App.handleVenue(jQuery('#enter_venue_address').val()); });
    $(document).on('click', '#enter_publicitymanager_address', function(){ App.handlePublicitymanager(jQuery('#enter_publicitymanager_address').val()); });
    $(document).on('click', '#participant_register_button', function(){ App.handleParticipantRegistration(jQuery('#num_of_reg').val()); });
    $(document).on('click', '#artist_register_button', function(){ App.handleArtistRegistration(jQuery('#artist_category').val(), jQuery('#artist_quote').val()); });
    $(document).on('click', '#sponsor_register_button', function(){ App.handleSponsorRegistration(jQuery('#sponsor_quote').val()); });
    $(document).on('click', '#venue_register_button', function(){ App.handleVenueRegistration(jQuery('#venue_area').val(), jQuery('#venue_quote').val()); });
    $(document).on('click', '#publicitymanager_register_button', function(){ App.handlePublicityManagerRegistration( jQuery('#publicitymanager_quote').val()); });
    $(document).on('click', '#artist_select_button', function(){ App.handleArtistSelection(jQuery('#enter_artist_address').val()); });
    $(document).on('click', '#sponsor_select_button', function(){ App.handleSponsorSelection(jQuery('#enter_sponsor_address').val()); });
    $(document).on('click', '#venue_select_button', function(){ App.handleVenueSelection(jQuery('#enter_venue_address').val()); });
    $(document).on('click', '#publicitymanager_select_button', function(){ App.handlePublicitymanagerSelection(jQuery('#enter_publicitymanager_address').val()); });
  },


  populateLists : function(){ 
 
    new Web3(new Web3.providers.HttpProvider('http://localhost:9545')).eth.getAccounts((err, accounts) => {
      jQuery.each(accounts,function(i){
        var optionElement = '<option value="'+accounts[i]+'">'+accounts[i]+'</option';
          jQuery('#enter_create_address').append(optionElement);
          if(web3.eth.coinbase != accounts[i]){
            jQuery('#enter_send_address').append(optionElement);  
          }
      });
    });

    var category = ['Dance', 'Music', 'Paint'];
    for(var i=0 ; i<3; i++){
        var optionElement = '<option value='+i+'>'+category[i]+'</option';
        jQuery('#artist_category').append(optionElement);
    }
  },

  populateVariables : function(){ 
 
    jQuery('#current_account').text("Current account : "+web3.eth.coinbase);

    App.contracts.vote.deployed().then(function(contract)
      {contract.eventName.call().then(function(v)
        {jQuery('#event_name').text("Event name : "+v);
      })})

    App.contracts.vote.deployed().then(function(contract)
      {contract.eventDescription.call().then(function(v)
        {jQuery('#event_desc').text(v);
      })})

    App.contracts.vote.deployed().then(function(contract)
      {contract.location.call().then(function(v)
        {jQuery('#event_location').text("Location : "+v);
      })})

    App.contracts.vote.deployed().then(function(contract)
      {contract.fees.call().then(function(v)
        {jQuery('#event_price').text("Ticket per person : "+v);
      })})

      web3.eth.getAccounts((err, accounts) => {
        jQuery.each(accounts,function(i){
          console.log("account: "+accounts[i]);
          App.contracts.vote.deployed().then(function(contract)
            {contract.artists.call(accounts[i]).then(function(v)
              {if(v[1] != ''){
                var optionElement = '<option value="'+accounts[i]+'">'+accounts[i]+'</option';
                jQuery('#enter_artist_address').append(optionElement);
              }
            })})

          App.contracts.vote.deployed().then(function(contract)
            {contract.sponsors.call(accounts[i]).then(function(v)
              {if(v[2] != 0){
                var optionElement = '<option value="'+accounts[i]+'">'+accounts[i]+'</option';
                jQuery('#enter_sponsor_address').append(optionElement);
              }
            })})

          App.contracts.vote.deployed().then(function(contract)
            {contract.venues.call(accounts[i]).then(function(v)
              {if(v[3] != 0){
                var optionElement = '<option value="'+accounts[i]+'">'+accounts[i]+'</option';
                jQuery('#enter_venue_address').append(optionElement);
              }
            })})

          App.contracts.vote.deployed().then(function(contract)
            {contract.publicitymanagers.call(accounts[i]).then(function(v)
              {if(v[2] != 0){
                var optionElement = '<option value="'+accounts[i]+'">'+accounts[i]+'</option';
                jQuery('#enter_publicitymanager_address').append(optionElement);
              }
            })})
        });
      });

      App.contracts.vote.deployed().then(function(contract)
        {contract.eventHead.call().then(function(v)
          {if(v != App.currentAccount){
            document.getElementById("enter_artist_address").disabled = true;
            document.getElementById("enter_sponsor_address").disabled = true;
            document.getElementById("enter_venue_address").disabled = true;
            document.getElementById("enter_publicitymanager_address").disabled = true;
          }
        })})
      
  },

  
  handleArtist : function(value){
    App.contracts.vote.deployed().then(function(contract)
      {contract.artists.call(value).then(function(v)
        {
         jQuery('#artist_selected_category').val(v[1]);
         jQuery('#artist_selected_quote').val(v[2]);
      })})
  },

  handleSponsor : function(value){
    App.contracts.vote.deployed().then(function(contract)
      {contract.sponsors.call(value).then(function(v)
        {
         jQuery('#sponsor_selected_quote').val(v[1]);
      })})
  },

  handleVenue : function(value){
    App.contracts.vote.deployed().then(function(contract)
      {contract.venues.call(value).then(function(v)
        {
         jQuery('#venue_selected_quote').val(v[1]);
         jQuery('#venue_selected_area').val(v[2]);
      })})
  },

  handlePublicitymanager : function(value){
    App.contracts.vote.deployed().then(function(contract)
      {contract.publicitymanagers.call(value).then(function(v)
        {
         jQuery('#publicitymanager_selected_quote').val(v[1]);
      })})
  },
  
  //Participant registration
  handleParticipantRegistration : function(value){
    if(value == ""){
      alert("Please enter valid amount");
      return false;
    }

    var registerInstance;
    App.contracts.vote.deployed().then(function(instance) {
      registerInstance = instance;
      return instance.participantRegister(value, {from:App.currentAccount, gas:3000000});
    }).then( function(result){

      // Watching Events 
      for (var i = 0; i < result.logs.length; i++) {
        var log = result.logs[i];
        
        // Look for the event participantReg
        // Notification 
        if (log.event == "participantReg") {
          var text = 'Participants registered: ' + log.args._count + " " + 
              ' registered by ' + log.args._addr + '.';
          jQuery('#showmessage_text').html(text);
          jQuery('#show_event').animate({'right':'10px'});
          setTimeout(function(){jQuery('#show_event').animate({'right':'-410px'},500)}, 15000);
          break;
        }
      }
      //return registerInstance.balances(App.currentAccount);
	    return registerInstance.address;
    }).catch( function(err){
      if(err.message == "VM Exception while processing transaction: revert"){
        alert("Transaction has been reverted. Either you have already registered or maximum participant limit has been exceeded.");
      }

      console.log(err.message);
    })
  },

  //Artist registration
  handleArtistRegistration : function(category, value){
    if(value == ""){
      alert("Please enter valid amount");
      return false;
    }
    if(category == ""){
      alert("Please enter valid category");
      return false;
    }

    var registerInstance;
    App.contracts.vote.deployed().then(function(instance) {
      registerInstance = instance;
      return instance.artistRegister(category,value, {from:App.currentAccount, gas:3000000});
    }).then( function(result){

      // Watching Events 
      for (var i = 0; i < result.logs.length; i++) {
        var log = result.logs[i];
        
        // Look for the event participantReg
        // Notification 
        if (log.event == "artistReg") {
          var text = 'Artist registered: ' + log.args._addr + " " + 
              ' for category ' + log.args._category + ' with quote as ' + log.args._quote + '.';
          jQuery('#showmessage_text').html(text);
          jQuery('#show_event').animate({'right':'10px'});
          setTimeout(function(){jQuery('#show_event').animate({'right':'-410px'},500)}, 15000);
          break;
        }
      }
	    return registerInstance.address;
    }).catch( function(err){
      if(err.message == "VM Exception while processing transaction: revert"){
        alert("Transaction has been reverted. You have already registered.");
      }

      console.log(err.message);
    })
  },

  //Sponsor registration
  handleSponsorRegistration : function(value){
    if(value == ""){
      alert("Please enter valid amount");
      return false;
    }

    var registerInstance;
    App.contracts.vote.deployed().then(function(instance) {
      registerInstance = instance;
      return instance.sponsorRegister(value, {from:App.currentAccount, gas:3000000});
    }).then( function(result){

      // Watching Events 
      for (var i = 0; i < result.logs.length; i++) {
        var log = result.logs[i];
        
        // Look for the event participantReg
        // Notification 
        if (log.event == "sponsorReg") {
          var text = 'Sponsor registered: ' + log.args._addr + " " + 
          ' with quote as ' + log.args._quote + '.';
          jQuery('#showmessage_text').html(text);
          jQuery('#show_event').animate({'right':'10px'});
          setTimeout(function(){jQuery('#show_event').animate({'right':'-410px'},500)}, 15000);
          break;
        }
      }
      //return registerInstance.balances(App.currentAccount);
	    return registerInstance.address;
    }).catch( function(err){
      if(err.message == "VM Exception while processing transaction: revert"){
        alert("Transaction has been reverted. You have already registered.");
      }

      console.log(err.message);
    })
  },

  //Venue registration
  handleVenueRegistration : function(area, value){
    if(value == ""){
      alert("Please enter valid amount");
      return false;
    }
    if(area == ""){
      alert("Please enter valid area");
      return false;
    }

    var registerInstance;
    App.contracts.vote.deployed().then(function(instance) {
      registerInstance = instance;
      return instance.venueRegister(area,value, {from:App.currentAccount, gas:3000000});
    }).then( function(result){

      // Watching Events 
      for (var i = 0; i < result.logs.length; i++) {
        var log = result.logs[i];
        
        // Look for the event participantReg
        // Notification 
        if (log.event == "venueReg") {
          var text = 'Venue registered: ' + log.args._addr + " " + 
              ' for area ' + log.args._area + ' with quote as ' + log.args._quote + '.';
          jQuery('#showmessage_text').html(text);
          jQuery('#show_event').animate({'right':'10px'});
          setTimeout(function(){jQuery('#show_event').animate({'right':'-410px'},500)}, 15000);
          break;
        }
      }
	    return registerInstance.address;
    }).catch( function(err){
      if(err.message == "VM Exception while processing transaction: revert"){
        alert("Transaction has been reverted. You have already registered.");
      }

      console.log(err.message);
    })
  },

  //Publicity manager registration
  handlePublicityManagerRegistration : function(value){
    if(value == ""){
      alert("Please enter valid amount");
      return false;
    }

    var registerInstance;
    App.contracts.vote.deployed().then(function(instance) {
      registerInstance = instance;
      return instance.publicitymanagerRegister(value, {from:App.currentAccount, gas:3000000});
    }).then( function(result){

      // Watching Events 
      for (var i = 0; i < result.logs.length; i++) {
        var log = result.logs[i];
        
        // Look for the event participantReg
        // Notification 
        if (log.event == "publicitymanagerReg") {
          var text = 'Publicity manager registered: ' + log.args._addr + " " + 
          ' with quote as ' + log.args._quote + '.';
          jQuery('#showmessage_text').html(text);
          jQuery('#show_event').animate({'right':'10px'});
          setTimeout(function(){jQuery('#show_event').animate({'right':'-410px'},500)}, 15000);
          break;
        }
      }
      //return registerInstance.balances(App.currentAccount);
	    return registerInstance.address;
    }).catch( function(err){
      if(err.message == "VM Exception while processing transaction: revert"){
        alert("Transaction has been reverted. You have already registered.");
      }

      console.log(err.message);
    })
  },

  //Artist selection
  handleArtistSelection : function(value){
    if(value == ""){
      alert("Please select valid account.");
      return false;
    }

    var registerInstance;
    App.contracts.vote.deployed().then(function(instance) {
      registerInstance = instance;
      return instance.selectArtist(value, {from:App.currentAccount, gas:3000000});
    }).then( function(result){

      // Watching Events 
      for (var i = 0; i < result.logs.length; i++) {
        var log = result.logs[i];
        
        // Look for the event participantReg
        // Notification 
        if (log.event == "artistSelect") {
          var text = 'Artist selected: ' + log.args._addr + " " + '.';
          jQuery('#showmessage_text').html(text);
          jQuery('#show_event').animate({'right':'10px'});
          setTimeout(function(){jQuery('#show_event').animate({'right':'-410px'},500)}, 15000);
          break;
        }
      }
	    return registerInstance.address;
    }).catch( function(err){
      if(err.message == "VM Exception while processing transaction: revert"){
        alert("Transaction has been reverted.");
      }

      console.log(err.message);
    })
  },

  //Sponsor selection
  handleSponsorSelection : function(value){
    if(value == ""){
      alert("Please select valid account.");
      return false;
    }

    var registerInstance;
    App.contracts.vote.deployed().then(function(instance) {
      registerInstance = instance;
      return instance.selectSponsor(value, {from:App.currentAccount, gas:3000000});
    }).then( function(result){

      // Watching Events 
      for (var i = 0; i < result.logs.length; i++) {
        var log = result.logs[i];
        
        // Look for the event participantReg
        // Notification 
        if (log.event == "sponsorSelect") {
          var text = 'Sponsor selected: ' + log.args._addr + " " + '.';
          jQuery('#showmessage_text').html(text);
          jQuery('#show_event').animate({'right':'10px'});
          setTimeout(function(){jQuery('#show_event').animate({'right':'-410px'},500)}, 15000);
          break;
        }
      }
	    return registerInstance.address;
    }).catch( function(err){
      if(err.message == "VM Exception while processing transaction: revert"){
        alert("Transaction has been reverted.");
      }

      console.log(err.message);
    })
  },

  //Venue selection
  handleVenueSelection : function(value){
    if(value == ""){
      alert("Please select valid account.");
      return false;
    }

    var registerInstance;
    App.contracts.vote.deployed().then(function(instance) {
      registerInstance = instance;
      return instance.selectVenue(value, {from:App.currentAccount, gas:3000000});
    }).then( function(result){

      // Watching Events 
      for (var i = 0; i < result.logs.length; i++) {
        var log = result.logs[i];
        
        // Look for the event participantReg
        // Notification 
        if (log.event == "VenueSelect") {
          var text = 'Venue selected: ' + log.args._addr + " " + '.';
          jQuery('#showmessage_text').html(text);
          jQuery('#show_event').animate({'right':'10px'});
          setTimeout(function(){jQuery('#show_event').animate({'right':'-410px'},500)}, 15000);
          break;
        }
      }
	    return registerInstance.address;
    }).catch( function(err){
      if(err.message == "VM Exception while processing transaction: revert"){
        alert("Transaction has been reverted.");
      }

      console.log(err.message);
    })
  },

  //Publicity manager selection
  handlePublicitymanagerSelection : function(value){
    if(value == ""){
      alert("Please select valid account.");
      return false;
    }

    var registerInstance;
    App.contracts.vote.deployed().then(function(instance) {
      registerInstance = instance;
      return instance.selectPublicitymanager(value, {from:App.currentAccount, gas:3000000});
    }).then( function(result){

      // Watching Events 
      for (var i = 0; i < result.logs.length; i++) {
        var log = result.logs[i];
        
        // Look for the event participantReg
        // Notification 
        if (log.event == "PublicitymanagerSelect") {
          var text = 'Publicity manager selected: ' + log.args._addr + " " + '.';
          jQuery('#showmessage_text').html(text);
          jQuery('#show_event').animate({'right':'10px'});
          setTimeout(function(){jQuery('#show_event').animate({'right':'-410px'},500)}, 15000);
          break;
        }
      }
	    return registerInstance.address;
    }).catch( function(err){
      if(err.message == "VM Exception while processing transaction: revert"){
        alert("Transaction has been reverted.");
      }

      console.log(err.message);
    })
  }
};


$(function() {
  $(window).load(function() {
    App.init();
    console.log('starting app.js');
  });
});
