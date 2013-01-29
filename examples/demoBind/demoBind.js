var testCol = new Meteor.Collection('testcol');
testCol.bindTemplate('hello', {
      liveUpdate: false,        //Set true if should be live update, if false then collective update eg. via button
      validation: {
        name: {
          validators: [ Validators.required ]
        },
        email: {
          validators: [ Validators.email ]
        }
      }
    }); 

if (Meteor.isClient) 
Template.hello.helpers({
  'dstache': function() {
    return '{{';
  }

});