//Meteor.Collection Template event extend
(function () {
  _.extend(Meteor.Collection.prototype, {
    bindTemplate: function(template, options) {
      var myColl = this;
      if (Meteor.isClient) {
          if (Template[template].bindRecord && Template[template].collectionBinding)
            throw new Error('Template '+template+' is allready binded to collection on data '+Template[template].collectionBinding._name);
          Template[template].bindRecord = new BindRecord(); //Record to update, a list with key as _id, contains array of key and node.
          Template[template].validation = (options)?options.validation:undefined;
          Template[template].collectionBinding = this;
          Template[template].events({
            'click input': function(e, temp) {
              myColl.doBindAction(template, this, e.target);
            },
            'click a.btn': function(e, temp) {
              myColl.doBindAction(template, this, e.target);
            },
            'click button': function(e, temp) {
              myColl.doBindAction(template, this, e.target);
            },
            'keyup input': function(e) {
              //Do live twoway binding or make user press the binded action?
              if ( (options && options.liveUpdate === true) && this._id != undefined)
                myColl.bindUpdateLive(this, e.target) //Live data for _id records, new records require binding action
              else
                myColl.bindToRecord(template, this, e.target);  //Force the binded action
            }
          });
      } //EO isClient  
    },
    bindUpdateLive: function(data, element) {
      var myColl = this;
      var newData = {};
      var bindkey = (element)?element.getAttribute('bindKey'):'';
      if (!bindkey || !data || !element)  //Got to have key, data and an DOM element
        return;
      if (bindkey != '_id' && element)
        if (!data[bindkey] || this.getBindInputValue(element) != data[bindkey])
          newData[bindkey] = this.getBindInputValue(element);
      if (Object.keys(newData).length != 0)
        myColl.update({_id: data._id}, { $set: newData});
    },
    bindToRecord: function(template, data, target) {
      //bindKey=name id=unknown.name
      //bindKey=name id=id.name
      var bindkey = (target)?target.getAttribute('bindKey'):''; //This could be done from id?
      var value = this.getBindInputValue(target);
      //Get the template
      var temp = Template[template];
      //Get the bind record
      var bindRecord = temp.bindRecord;
      //Set unified id
      var unifiedId = (data._id)?data._id:'unknown';
      //Set unified data as existing or empty
      var unifiedData = (data._id)?data:{};
      //If its a new record then set default for key
      if (!unifiedData[bindkey]) unifiedData[bindkey] = ''; //Default value for key
      if (temp && bindRecord && target) { //Is there objects to work with?

        //## VALIDATION
        var validators = (temp.validation&&temp.validation[bindkey])?temp.validation[bindkey].validators:undefined; //Can argue that validation should be in collection, on the other hand this gives freedom
        var dataChanged = (this.getBindInputValue(target) != unifiedData[bindkey]);
        if (this.getBindInputValue(target) == '' || dataChanged) { //If data is altered / dirty then
          var invalid = false; //Start off in a positive mood
   
          for (var key in validators)
            if (typeof(validators[key]) === 'function')
              invalid = (!validators[key](value)); //A validator returns true if its ok, 

          if (dataChanged || invalid) {
            bindRecord.record(unifiedId, bindkey).dirty(dataChanged); //Can be that data isn't dirty but only invalid
            bindRecord.record(unifiedId, bindkey).node(target);
            bindRecord.record(unifiedId, bindkey).invalid(invalid);
            bindRecord.record(unifiedId, bindkey).required( (value == '' && invalid) ); //Pr. definition must all validators accept '' only required may fail
          } else //If data is not changed and still valid then delete
            bindRecord.record(unifiedId, bindkey).del();
        } else //If data is not altered then we delete
          bindRecord.record(unifiedId, bindkey).del();
      } //EO objects to work with
    },
    /*isBindDirty: function(template, id, key) { // key is optional
      return (Template[template] && Template[template].bindRecord.isDirty(id, key) );
    },*/
    //DOM helper
    getBindInputValue: function(target) {
      return (target)?target.value:''; //TODO: Support more than INPUT
    },
    //DOM helper
    setBindInputValue: function(target, value) {
      target.value = value;  //TODO: support more than INPUT
    },
    /*
    doBindAction gets called by binded template events on all likely bindAction events eg. input, button and a.btn for bootstrap

    @param template name as String
    @param data from event handler 'this', contains a getDataContext
    @param target event.target - node who triggered event
     */
    doBindAction: function(template, data, target) {
      //Valid bind actions:
      var validBindAction = {'create':true, 'update':true, 'delete':true, 'cancel':true};
      //bindAction=action id=unknown.action
      //bindAction=action id=id.name
      var bindAction = (target)?target.getAttribute('bindAction'):'';
      //id=id.name id=unknown.name or nothing?
      var bindId = (target)?target.getAttribute('id'):'';
      //Is it a cancel or create? or an exsting then check if ._id isset
      var isExistingRecord = (data._id)?true:false;
      //Set unified id
      var unifiedId = (isExistingRecord)?data._id:'unknown';
      //Check if this is a valid bindAction call else quit
      if (bindAction && validBindAction[bindAction]) {
        //Get the collection we are binded to
        var coll = this;
        //Get the template too
        var temp = Template[template];
        var bindRecord = temp.bindRecord;
        //Get elements from template
        var elements = bindRecord.records[unifiedId];
        //Define carry object for most bindActions
        var newData = {};

        if (isExistingRecord) {
          //Valid actions is update, delete or cancel

          //## UPDATE RECORD
          if (bindAction=='update') {
            //Check if record is dirty if so then update
            if (bindRecord.record(data._id).isDirty()) {
              //We should have some dirty data to update
               bindRecord.record(unifiedId).eachNode(function(node, key) {
                if (coll.getBindInputValue(node) != data[key]) //If data has changed
                  newData[key] = coll.getBindInputValue(node); //set new value 
              });

              if (Object.keys(newData).length != 0) //If data changed
                coll.update({_id: data._id}, { $set: newData}); //Update in database
            } //EO isBindDirty
          } //EO update

          //## DELETE RECORD
          if (bindAction=='delete') {
            //Just delete the record?
            coll.remove({ _id: data._id });
          } //EO delete

          //## UPDATE CANCEL
          if (bindAction=='cancel') {
            //reset the data
            bindRecord.record(unifiedId).eachNode(function(node, key) {
              if (data[key] != undefined && data[key] != null)
                coll.setBindInputValue(node, data[key]); //set old value
            });
          } //EO cancel
        } else {
          //## NEW CREATE
          //Valid actions is create or cancel
          if (bindAction == 'create') {
            //Create the record and empty the form
            if (bindRecord.record(unifiedId).isDirty()) {
              //We should have some dirty data to update
              bindRecord.record(unifiedId).eachNode(function(node, key) {
                newData[key] = coll.getBindInputValue(node); //set new value 
                coll.setBindInputValue(node, ''); //Default?
              });              
              if (Object.keys(newData).length != 0) //If data changed
                coll.insert(newData); //Insert in database
            } //EO isBindDirty          
          } //EO create

          //## NEW CANCEL
          if (bindAction == 'cancel') {
            //Reset the data, go looking in the
            bindRecord.record(unifiedId).eachNode(function(node, key) {
              coll.setBindInputValue(node, ''); //set old value, should bind contain default?  eg, bind 'name' 'John'
            });            
          } //EO cancel
        }
        //Action handled on record - remove it from dirty record

        //## RE-VALIDATION
        for (var bindkey in bindRecord.records[unifiedId]) {
          var validators = (temp.validation && temp.validation[bindkey])?temp.validation[bindkey].validators:undefined; //Can argue that validation should be in collection, on the other hand this gives freedom
          var value = coll.getBindInputValue( bindRecord.record(unifiedId, bindkey).node() );
          var invalid = false; //Start off in a positive mood
     
          for (var key in validators)
            if (typeof(validators[key]) === 'function') //Make sure we are calling a function
              invalid = (!validators[key](value)); //A validator returns true if its ok, 

          if (invalid) { //Keep record updated
            bindRecord.record(unifiedId, bindkey).dirty(false); //Guess that any action would set this off
            bindRecord.record(unifiedId, bindkey).invalid(invalid);
            bindRecord.record(unifiedId, bindkey).required( (value == '' && invalid) ); //Pr. definition must all validators accept '' only required may fail
          } else //If data is not changed and still valid then delete
            bindRecord.record(unifiedId, bindkey).del();

        } //EO for

      } //EO valid bindAction
    } //EO doBindAction
    
  });

})();