//Handlebar helper
(function () {
  if (typeof Handlebars !== 'undefined') {
    //{{getSession 'key'}}

    /*
    bind - Binds data to input - not yet tested for textarea, checkbox, option etc.
     */
    Handlebars.registerHelper('bind', function (key, defaultValue) {
      //Test if key found?
      if (!key || key=='_id' || key instanceof Object)
        return; // {{bind}} lacks user intend for bind action, cannot alter _id
      isSetDefaultValue = typeof(defaultValue) != 'object';
      
      var testDataString = (this[key])?this[key].slice(0, Math.min(5, this[key].length)):'';
      //Ok, if we got 'data:' as a beginning and a long string +300 we wont set a value...
      //This must be some kind of larger data, so we let the user deside
      //If we knew and template we could check to se if the user had changed this data
      //This could be solved by changing the {{find}} and {{findOne}} functionallity to include
      //validation / the bindRecord?
      if (testDataString == 'data:' && this[key].length > 300)
        /* NOP */
        defaultValue = undefined
      else
        defaultValue = (isSetDefaultValue)?defaultValue:this[key];

      if (typeof(defaultValue) == 'object') defaultValue = undefined; //in case a fileobject is handed

      var setValue = (defaultValue)?(' value="'+_.escape(defaultValue)+'"'):'value=""'; //Only set value if key found
      //If key not found then the binding could be on new data set or fail use
      var setBindKey = 'bindKey="'+key+'"';                                //Attach bind to data key in collection record
      var unifiedId = (this._id)?this._id:'unknown';
      var setId = 'id="'+unifiedId+'.'+key+'"';      //Preserve input
      var setName = 'name="'+unifiedId+'.'+key+'"';      //Preserve input
      var setChecked = (isSetDefaultValue && this[key] == defaultValue)?'checked="checked"':'';
      return new Handlebars.SafeString(setValue+setBindKey+setId+setName+setChecked);          //Output element's: [value] bindKey id
    });

    Handlebars.registerHelper('bindSelected', function (key, defaultValue) {
      //Test if key found?
      if (!key || key=='_id' || key instanceof Object)
        return; // {{bindSelect}} lacks user intend for bind action, cannot alter _id
      defaultValue = (typeof(defaultValue) != 'object')?defaultValue:undefined;
      return new Handlebars.SafeString((this[key] == defaultValue)?'selected="selected"':'');          //Output element's: [value] bindKey id
    });  

    Handlebars.registerHelper('bindFile', function (key, types, maxSizeBytes) {
      //Test if key found?
      if (!key || key=='_id' || key instanceof Object)
        return; // {{bindSelect}} lacks user intend for bind action, cannot alter _id
      //Reset types as array of extensions and maxSizeBytes as number
      types = (typeof(types) != 'object' && types)?types:undefined;
      maxSizeBytes = (maxSizeBytes === +maxSizeBytes)?+maxSizeBytes:undefined;

      var setBindKey = 'bindKey="'+key+'"';                                //Attach bind to data key in collection record
      var unifiedId = (this._id)?this._id:'unknown';
      var setId = 'name="'+unifiedId+'.'+key+'"';      //Preserve input
      var types = (types)?'bindFileTypes="'+types+'"':'';
      var setSizeMax = (maxSizeBytes)?'bindFileSizeMax="'+maxSizeBytes+'"':'';

      return new Handlebars.SafeString(setId+setBindKey+types+setSizeMax);          //Output element's: [value] bindKey id
    });   
    /*
    bindAction - Binds input/button or anchor to a bind action eg. create, update, delete, cancel
     */
    Handlebars.registerHelper('bindAction', function (action, bindkey, paramA) {
      var carry = '';
      if (action == 'upload') {
        //Test if key found?
        if (!bindkey || bindkey=='_id' || bindkey instanceof Object)
          return;
        carry = 'bindKey="'+bindkey+'"'+((paramA)?'bindFileSizeMax="'+paramA+'"':'');
      }      
      return new Handlebars.SafeString(carry+'bindAction="'+action+'" name="'+((this._id)?this._id:'unknown')+'.__'+action+'"');
    });

    Handlebars.registerHelper('bindStatus', function (template, bindKey, attribute) {
      if (template && Template[template] && Template[template].bindRecord) {
        //Template is binded to collection
        var unifiedId = (this._id)?this._id:'unknown';
        return Template[template].bindRecord.get(unifiedId, bindKey, attribute);

      } else {
        //Template is not binded?
        throw new Error('Template '+template+' is not binded to Collection, cannot get bindStatus');
      }
    });

    Handlebars.registerHelper('bindState', function (template) {
      if (template && Template[template] && Template[template].bindRecord) {
        //Template is binded to collection
        var unifiedId = (this._id)?this._id:'unknown';
        return Template[template].bindRecord.get(unifiedId, undefined, undefined)[0].key;

      } else {
        //Template is not binded?
        throw new Error('Template '+template+' is not binded to Collection, cannot get bindStatus');
      }
    });

    Handlebars.registerHelper('bindStatusReport', function (template) {
      if (template && Template[template] && Template[template].bindRecord) {
        //Template is binded to collection
        return Template[template].bindRecord.get();
      } else {
        //Template is not binded?
        throw new Error('Template '+template+' is not binded to Collection, cannot get bindStatus');
      }
    });

    //TODO: Replace all document.getElementByName with template in scope findAll
    //TODO: Validation errors should contain a state eg. 1 warning 2 if required then its an error
    //TODO: Create validationMessage template [key] make a blok that gives an object:
    //        Error count, status (error/warning)
    //TODO: Checkup on Template.help.validationErrors - seems empty
    //BUG: seems as if validationsErrors is sluggish / a step behind?
    //TODO: try validationMsg or make a ValidationFailed
  }
})();