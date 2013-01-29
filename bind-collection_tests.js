var	testCollection = new Meteor.Collection(null);

(function () {

function Element(rec) {
	var self = this;
	self.record = rec;
	self.getAttribute = function(id) { return self.record[id]; };
	self.setAttribute = function(id, value) { return self.record[id] = value; };
}

if (Meteor.isClient) {
	Tinytest.add('Handlebar bind - Collection', function (test) {
		testCollection.remove({});
		//Setup template
		var testTemplateName = 'test_helpers_50';
		var testTemplate = Template[testTemplateName];
		testTemplate.list = function() { return testCollection.find({}); };
		//Test template collection binding
		test.equal(testTemplate.bindRecord, undefined);
		testCollection.bindTemplate(testTemplateName, {
		 	validation: {
		 		name: {
		 			validators: [ Validators.required ]
		 		},
		 		email: {
		 			validators: [ Validators.email ]
		 		}
		 	}
		}); //Validation?
		test.notEqual(testTemplate.bindRecord, undefined);
		//insert data
		testCollection.insert({ name: 'test', email: 'test'});
		//Data this
		var dataThis = testCollection.findOne({});


		var onscreen1 = OnscreenDiv(Meteor.render(testTemplate));

		//get elements from the template
		var elementName = document.getElementsByName(dataThis._id+'.name')[0];
		var elementEmail = document.getElementsByName(dataThis._id+'.email')[0];
		var elementActionUpdate = document.getElementsByName(dataThis._id+'.__update')[0];
		var elementActionDelete = document.getElementsByName(dataThis._id+'.__delete')[0];
		var elementActionCancel = document.getElementsByName(dataThis._id+'.__cancel')[0];

		var newName = document.getElementsByName('unknown.name')[0];
		var newEmail = document.getElementsByName('unknown.email')[0];
		var newActionCreate = document.getElementsByName('unknown.__create')[0];
		var newActionCancel = document.getElementsByName('unknown.__cancel')[0];

		/*console.log(elementName);
		console.log(elementActionUpdate);

		console.log(onscreen1.rawHtml());*/

		test.equal(testTemplate.bindRecord.get(dataThis._id), [{"status":true,"key":{}}]);
		//Simulate field keyup event update
		elementName.value = 'updated';
		testCollection.bindToRecord(testTemplateName, dataThis, elementName);
		test.isTrue(testTemplate.bindRecord.get(dataThis._id, 'name', 'dirty'));

		//Simulate a button click update:
		testCollection.doBindAction(testTemplateName, dataThis, elementActionUpdate);
		test.isFalse(testTemplate.bindRecord.get(dataThis._id, 'name', 'dirty'));

		dataThis = testCollection.findOne({});
		test.equal(dataThis.name, 'updated');

		//Test validation
		test.equal(elementEmail.value, 'test');
		elementEmail.value = 'not an email';
		testCollection.bindToRecord(testTemplateName, dataThis, elementEmail);
		test.isTrue(testTemplate.bindRecord.get(dataThis._id, 'email', 'dirty'));
		test.isTrue(testTemplate.bindRecord.get(dataThis._id, 'email', 'invalid'));
		test.isTrue(testTemplate.bindRecord.get(dataThis._id, 'email', 'warning'));
		//Test cancel
		testCollection.doBindAction(testTemplateName, dataThis, elementActionCancel);
		test.isFalse(testTemplate.bindRecord.get(dataThis._id, 'email', 'dirty'));
		//Test delete
		testCollection.doBindAction(testTemplateName, dataThis, elementActionDelete);
		Meteor.flush();
		test.equal(onscreen1.rawHtml().length, 246);
		var dataCheck = testCollection.findOne({});
		test.isUndefined(dataCheck);
		//Test insert validation required / error
		test.equal(newName.value, ''); //This should fire required
		testCollection.bindToRecord(testTemplateName, {}, newName);
		test.isTrue(testTemplate.bindRecord.get('unknown', 'name', 'invalid'));
		//Set proper data
		newName.value = 'Test';
		testCollection.bindToRecord(testTemplateName, {}, newName);
		test.isFalse(testTemplate.bindRecord.get('unknown', 'name', 'invalid'));
		test.isTrue(testTemplate.bindRecord.get('unknown', 'name', 'dirty'));
		//Test cancel
		testCollection.doBindAction(testTemplateName, {}, newActionCancel);
		test.isTrue(testTemplate.bindRecord.get('unknown', 'name', 'invalid'));
		test.isFalse(testTemplate.bindRecord.get('unknown', 'name', 'dirty'));
		//Test create
		newName.value = 'Test';
		testCollection.bindToRecord(testTemplateName, {}, newName);
		test.isFalse(testTemplate.bindRecord.get('unknown', 'name', 'invalid'));
		test.isTrue(testTemplate.bindRecord.get('unknown', 'name', 'dirty'));
		testCollection.doBindAction(testTemplateName, {}, newActionCreate);
		test.isTrue(testTemplate.bindRecord.get('unknown', 'name', 'invalid')); //this is set to '' but the field is required
		test.isFalse(testTemplate.bindRecord.get('unknown', 'name', 'dirty'));

		var dataCheck = testCollection.findOne({});
		test.isFalse( (dataCheck == undefined) );		

		onscreen1.kill();
	});

} //EO isClient
})();