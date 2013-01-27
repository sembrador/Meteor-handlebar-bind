function BindRecord() {
  var self = this;
  self.records = [];
  self.listeners = {};
  
  self.handleListeners = function(doCreate) {
    if (doCreate) {
      /* Implement listener - Value just changed.. */
      for (var contextId in self.listeners)
        self.listeners[contextId].invalidate();
    } else {
      /* Implement listener - Value just read */
      var main = self;
      var context = Meteor.deps.Context.current;
      if (context && !self.listeners[context.id]) {
        self.listeners[context.id] = context;
        context.onInvalidate(function () {
          delete main.listeners[context.id];
        });
      } //EO Context
    }
  };
  self.record = function(unifiedId, bindkey) {
    getSetter = {};



    function initRecord(doCreate) {
      //Init record
      if (self.records && unifiedId && !self.records[unifiedId])
        if (doCreate) self.records[unifiedId] = {}
          else
        return { dirty: false }; //Not found so data is not dirty
      return self.records[unifiedId];
    };

    function initKey(doCreate) {
      //Init key
      if (self.records && unifiedId && self.records[unifiedId] && !self.records[unifiedId][bindkey])
        if (doCreate)
          self.records[unifiedId][bindkey] = { dirty: true }
        else
          return {};
      return self.records[unifiedId][bindkey];
    };

    function getRecord(doCreate) {
      if (unifiedId === undefined)
        return self.records; //doCreate?
      var result = initRecord(doCreate);
      if (bindkey != undefined)
        result = initKey(doCreate);
      self.handleListeners(doCreate);
      return result;
    }

    function getKey(doCreate) {
      initRecord(doCreate);
      var result = initKey(doCreate);
      self.handleListeners(doCreate);
      return result;
    }
    getSetter.dirty = function(dirty) {
      if (dirty != undefined)
        return getKey(true).dirty = dirty
      else
        return getKey().dirty;
    };
    getSetter.node = function(node) {
      if (node != undefined)
        return getKey(true).node = node
      else
        return getKey().node;
    };     
    getSetter.invalid = function(isInvalid) {
      if (isInvalid != undefined) {
        var key = getKey(true);
        key.error = (isInvalid && key.required)?true:false;
        key.warning = (isInvalid && !key.required)?true:false;
        return key.invalid = isInvalid;

      } else
        return getKey().invalid || 0;
    };
    getSetter.required = function(isRequired) {
      if (isRequired != undefined) {
        var key = getKey(true);
        key.error = (isRequired && key.invalid)?true:false;
        key.warning = (!isRequired && key.invalid)?true:false;
        return key.required = isRequired;
      } else
        return getKey().required;
    };
    getSetter.data = function(recordSet) {
      if (recordSet != undefined && unifiedId != undefined)
        return getRecord(true) = recordSet
      else
        return getRecord();
    };

    //.del(unifiedId, [bindkey]) deletes record key and if last one then deletes the record for cleanup
    getSetter.del = function() {
      if (unifiedId && self.records[unifiedId])           //If record exists then test bindkey
        if (bindkey && self.records[unifiedId][bindkey])  //If bindkey set and found then delete it
          delete self.records[unifiedId][bindkey];
      //If empty record or no bindkey then delete the whole record
      if (unifiedId && self.records[unifiedId] && (Object.keys(self.records[unifiedId]).length === 0 || !bindkey))
        delete self.records[unifiedId]; 

      /* Implement listeners, data just changed..  */
      self.handleListeners(true);
    }; 

    getSetter.isDirty = function(unifiedId, bindKey) { /* bindKey is optional */
      return (self.get(unifiedId) != undefined && (bindKey === undefined || self.get(unifiedId, bindKey) != undefined) );
    };

    getSetter.eachNode = function(func) { //func gets (value, key)
      var elements = self.records[unifiedId];
      if (unifiedId && elements)
        for (var key in elements) { 
          var element = elements[key].node; //Get dirty nodes
          if (key != '_id' && element) //execute function if not _id and element exists
            func(element, key);
        } //EO for
    };

    return getSetter;
  };

  //Used by {{bindStatus}} {{bindStatusReport}}
  self.get = function(unifiedId, bindKey, attribute) {
      var self = this;
      //Handle input - none is required, so we check for object status
      attribute = (typeof(attribute) != 'object')?attribute:undefined;
      bindKey = (typeof(bindKey) != 'object')?bindKey:undefined;
      unifiedId = (typeof(unifiedId) != 'object')?unifiedId:undefined;
      //Set resulting data
      var statusRecord = 
        (self.records && unifiedId != undefined && self.records[unifiedId])?
                                          self.records[unifiedId]:undefined;
      var statusKey = 
        (statusRecord && bindKey != undefined)?
                                          statusRecord[bindKey]:undefined;
      var statusAttribute = 
        (statusKey && attribute != undefined)?
                                          statusKey[attribute]:undefined; 
      /* Implement listener values read */
      self.handleListeners();
      if (unifiedId != undefined){
        if (bindKey != undefined) {
          if (attribute != undefined) {
            return statusAttribute;
          } else {
            return statusKey;
          }  
        } else {
          var carry = []; //Arrayify statusRecord, handlebars each want true array 
          for (var id in statusRecord)
            carry.push({ 'name': id, 'key': statusRecord[id] });
          return carry;
        }  
      } else {
        //Cycle all ids, for each key count invalid, 
        var buffer = [];
        var totals = {};
        for (var id in self.records) 
          for (var key in self.records[id]) {
            if (!buffer[key]) buffer[key] = {};
            for (var attr in self.records[id][key]) {
              if (self.records[id][key][attr] == true) {
                buffer[key][attr] = (buffer[key][attr])?buffer[key][attr]+1:1; //Count
                totals[attr] = (totals[attr])?totals[attr]+1:1; //Count
              }  
            }
          }
        var carry = []; //Arrayify buffer, handlebars each want true array
        if (Object.keys(buffer).length > 0)
          carry.push({ 'total': totals }); //Add data for the total invalids etc. on template
        for (var id in buffer)
          carry.push({ 'name': id, 'key': buffer[id] }); //Add data for counts pr. key
        return carry;
      }
  }; //EO self.get
} //EO function BindRecord