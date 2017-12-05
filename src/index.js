'use strict';

var Alexa = require('alexa-sdk');
var AWS = require('aws-sdk');
var fs = require('fs');
//A set of intents that Alexa processes
var handlers = {
  // Open Inventory
  'LaunchRequest': function() {
    //If the user is new, create a new storage for them
    if (Object.keys(this.attributes).length === 0) {
        this.attributes.storage = {
            'storage': {},
            'previous_storage': {}
        };
        this.response.speak('Welcome to Inventory, You may store, transfer, remove, or ask for location of items');
    } else {
        this.response.speak('Welcome back to Inventory, Your session is now active');
    }
    this.emit(':responseReady');
  },
  //Store a certain amount of an item in a specified location. Items already in storage will
  //result in an addition of volumes.
  'StoringIntent': function() {
    var amount = parseFloat(this.event.request.intent.slots.amount.value);
    var units = this.event.request.intent.slots.units.value;
    var item = this.event.request.intent.slots.item.value;
    var location = this.event.request.intent.slots.location.value;
    var storage = this.attributes.storage.storage;
    this.attributes.storage.previous_storage = JSON.parse(JSON.stringify(storage));
    if (storage[item] === undefined) {
        storage[item] = [amount, units, location];
        this.attributes.storage.storage = storage;
        this.response.speak('Okay, I stored ' + amount + ' ' + units +' of ' + item + ' in ' + location);
    } else {
        var new_amount = volumeadder(storage[item][0], amount, storage[item][1], units);
        storage[item] = [new_amount, 'liters', location];
        this.attributes.storage.storage = storage;
        this.response.speak('I have stored an additional ' + amount + ' ' + units + ' of ' 
        + item);
    }
    this.emit(':responseReady');
  },
  //Returns location of the item
  'LocationIntent': function() {
    var item = this.event.request.intent.slots.item.value;
    var storage = this.attributes.storage.storage;
    if (storage[item] === undefined) {
        this.response.speak(item + ' does not exist in your storage');
    } else {
        var location = storage[item][2];
        this.response.speak(item + ' is in ' + location);
    }
    this.emit(':responseReady');
  },
  //Transfer item in storage to another location
  'TransferIntent': function() {
    var item = this.event.request.intent.slots.item.value;
    var storage = this.attributes.storage.storage;
    this.attributes.storage.previous_storage = JSON.parse(JSON.stringify(storage));
    var newlocation = this.event.request.intent.slots.location.value;
    if (storage[item] === undefined) {
        this.response.speak(item + ' does not exist in your storage');
    } else {
        var oldlocation = storage[item][2];
        storage[item][2] = newlocation;
        this.attributes.storage.storage = storage;
        this.response.speak('I have transferred ' + item + ' from ' + oldlocation + ' to ' + newlocation);
    }
    this.emit(':responseReady');
  },
  //Remove a certain amount of an item from the storage
  'RemoveIntent': function() {
    var amount = parseFloat(this.event.request.intent.slots.amount.value);
    var units = this.event.request.intent.slots.units.value;
    var item = this.event.request.intent.slots.item.value;
    var storage = this.attributes.storage.storage;
    this.attributes.storage.previous_storage = JSON.parse(JSON.stringify(storage));
    if (storage[item] === undefined) {
        this.response.speak('We currently have none');
    } else {
        var new_amount = volumeadder(storage[item][0], -1 * amount, storage[item][1], units);
        if (new_amount < 0) {
            this.response.speak('You do not have enough in your storage. You only have ' + 
            storage[item][0] + ' ' + storage[item][1] + ' of ' + item + ' in your storage.');
        } else {
            storage[item][0] = new_amount;
            storage[item][1] = 'liters';
            this.attributes.storage.storage = storage;
            this.response.speak('I have removed ' + amount + ' ' + units + ' of ' + item 
            + ' from your storage.');
        }
    }
    this.emit(':responseReady');
  },
  //Returns the amount of item in storage
  'AmountIntent': function() {
    var item = this.event.request.intent.slots.item.value;
    var storage = this.attributes.storage.storage;
    if (storage[item] === undefined) {
        this.response.speak('We currently have none');
    } else {
        var amount = storage[item][0];
        var units = storage[item][1];
        this.response.speak('You have ' + amount + ' ' + units + ' of ' + item +' in your storage');
    }
    this.emit(':responseReady');
  },
  //Goes back to the previous state
  'UndoIntent': function() {
    this.attributes.storage.storage = this.attributes.storage.previous_storage;
    this.response.speak('Done');
    this.emit(':responseReady');
  },
  //Removes everything, use for debugging
  'DestructionIntent': function() {
    this.attributes.storage.previous_storage = this.attributes.storage.storage;
    this.attributes.storage.storage = {};
    this.response.speak('I have removed everything!');
    this.emit(':responseReady');
  },
  // Stop
  'AMAZON.StopIntent': function() {
      this.response.speak('Ok, Hope to see you soon.');
      this.emit(':responseReady');
  },
  // Cancel
  'AMAZON.CancelIntent': function() {
      this.response.speak('Ok, Hope to see you soon.');
      this.emit(':responseReady');
  },
  // Save state
  'SessionEndedRequest': function() {
    console.log('session ended!');
    this.emit(':saveState', true);
  }
};
//Allows addition of volumes with different units assuming base is in liters
function volumeadder(a1, a2, u1, u2) {
    if (u1 == 'micro liter' || u1 == 'micro liters') {
        a1 = a1 * Math.pow(10, -6);
    }
    if (u2 == 'micro liter' || u2 == 'micro liters') {
        a2 = a2 * Math.pow(10, -6);
    }
    if (u1 == 'milliliter' || u1 == 'milliliters') {
        a1 = a1 * Math.pow(10, -3);
    }
    if (u2 == 'milliliter' || u2 == 'milliliters') {
        a2 = a2 * Math.pow(10, -3);
    }
    return a1 + a2;
}

//Handles the Alexa voice inputs and performs based on intents
exports.handler = function(event, context, callback){
    var alexa = Alexa.handler(event, context);
    alexa.dynamoDBTableName = 'Inventory';
    alexa.registerHandlers(handlers);
    alexa.execute();
};
 