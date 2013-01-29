(function () {
	Tinytest.add('Handlebar bind helper - init test templates', function (test) {
	  var frag = Meteor.render(Template.test_helpers_00);
	  test.equal(canonicalizeHtml(DomUtils.fragmentToHtml(frag)), "Hi");
	});

	//bind
	Tinytest.add('Handlebar bind helper - Helper {{bind}}', function (test) {
		var onscreen1 = OnscreenDiv(Meteor.render(Template.test_helpers_10));
		test.notEqual(Template.test_helpers_10, undefined, 'Test template 10');
		test.equal(onscreen1.rawHtml(), '<input value="" bindkey="name" name="unknown.name">', '1');
							
		onscreen1.kill();

		Session.set('data', 'test');
		Template.test_helpers_11.testCol = function () { return {_id:'1', name:Session.get('data')}; };
		var onscreen2 = OnscreenDiv(Meteor.render(Template.test_helpers_11));
		test.notEqual(Template.test_helpers_11, undefined, 'Test template 11');
		Meteor.flush();
		test.equal(onscreen2.rawHtml(), '<input value="test" bindkey="name" name="1.name">', '2');
		Session.set('data', 'ok');
		Meteor.flush();
		test.equal(onscreen2.rawHtml(), '<input value="ok" bindkey="name" name="1.name">', '3');

		onscreen2.kill();

	});
		
	//bindAction
	Tinytest.add('Handlebar bind helper - Helper {{bindAction}}', function (test) {
		var onscreen1 = OnscreenDiv(Meteor.render(Template.test_helpers_20));
		test.notEqual(Template.test_helpers_20, undefined, 'Test template 20');
		test.equal(onscreen1.rawHtml(), '<button bindaction="create" name="unknown.__create"></button>', '1');

		onscreen1.kill();

		Template.test_helpers_21.testCol = function () { return {_id:'1', name:'data' }; };
		var onscreen2 = OnscreenDiv(Meteor.render(Template.test_helpers_21));
		test.notEqual(Template.test_helpers_21, undefined, 'Test template 21');
		Meteor.flush();
		test.equal(onscreen2.rawHtml(), '<button bindaction="create" name="1.__create"></button>', '2');

		onscreen2.kill();		
	});
		
	//bindStatus Attribute level
	Tinytest.add('Handlebar bind helper - Helper {{bindStatus}} - Level: Attribute', function (test) {
		var	testCollection = new Meteor.Collection(null);
		//Test binding template to collection
		var testTemplateName = 'test_helpers_30';
		var testTemplate = Template[testTemplateName];

		test.equal(testTemplate.bindRecord, undefined);
		testCollection.bindTemplate(testTemplateName);
		test.notEqual(testTemplate.bindRecord, undefined);
		//Setup test template
		var onscreen1 = OnscreenDiv(Meteor.render(testTemplate));
		test.notEqual(testTemplate, undefined, testTemplateName);
		//Test helper - no validation set so should expect empty reply
		test.equal(onscreen1.rawHtml(), '<!--empty-->', '1');
		//Test Set validation
		testTemplate.bindRecord.record('unknown', 'name').invalid(true);
		test.isTrue(testTemplate.bindRecord.record('unknown', 'name').invalid());
		//Reactivity
		Meteor.flush();
		//Test reply should expect dirty, warning and invalid 'dwi' - dweir  (dirty, warning, error, invalid, required)
		test.equal(onscreen1.rawHtml(), 'dwi', '2');

		//Test Set validation
		testTemplate.bindRecord.record('unknown', 'name').required(true);
		test.isTrue(testTemplate.bindRecord.record('unknown', 'name').required());
		//Reactivity
		Meteor.flush();
		//Test reply should expect dirty, error, invalid and required 'deir' - dweir  (dirty, warning, error, invalid, required)
		test.equal(onscreen1.rawHtml(), 'deir', '3');

		onscreen1.kill();		
	});

	//bindStatus key level
	Tinytest.add('Handlebar bind helper - Helper {{bindStatus}} - Level: Key', function (test) {
		var	testCollection = new Meteor.Collection(null);
		//Test binding template to collection
		var testTemplateName = 'test_helpers_31';
		var testTemplate = Template[testTemplateName];

		test.equal(testTemplate.bindRecord, undefined);
		testCollection.bindTemplate(testTemplateName);
		test.notEqual(testTemplate.bindRecord, undefined);
		//Setup test template
		var onscreen1 = OnscreenDiv(Meteor.render(testTemplate));
		test.notEqual(testTemplate, undefined, testTemplateName);
		//Test helper - no validation set so should expect empty reply
		test.equal(onscreen1.rawHtml(), '<!--empty-->', '1');

		//Test Set validation
		testTemplate.bindRecord.record('unknown', 'name').invalid(true);
		test.isTrue(testTemplate.bindRecord.record('unknown', 'name').invalid());
		//Reactivity
		Meteor.flush();
		//Test reply should expect dirty, warning and invalid 'dwi' - dweir  (dirty, warning, error, invalid, required)
		test.equal(onscreen1.rawHtml(), 'dwi', '2');

		//Test Set validation
		testTemplate.bindRecord.record('unknown', 'name').required(true);
		test.isTrue(testTemplate.bindRecord.record('unknown', 'name').required());
		//Reactivity
		Meteor.flush();
		//Test reply should expect dirty, error, invalid and required 'deir' - dweir  (dirty, warning, error, invalid, required)
		test.equal(onscreen1.rawHtml(), 'deir', '3');

		onscreen1.kill();		
	});

	//bindStatus record level
	Tinytest.add('Handlebar bind helper - Helper {{bindStatus}} - Level: Record', function (test) {
		var	testCollection = new Meteor.Collection(null);
		//Test binding template to collection
		var testTemplateName = 'test_helpers_32';
		var testTemplate = Template[testTemplateName];

		test.equal(testTemplate.bindRecord, undefined);
		testCollection.bindTemplate(testTemplateName);
		test.notEqual(testTemplate.bindRecord, undefined);
		//Setup test template
		var onscreen1 = OnscreenDiv(Meteor.render(testTemplate));
		test.notEqual(testTemplate, undefined, testTemplateName);
		//Test helper - no validation set so should expect empty reply
		test.equal(onscreen1.rawHtml(), '<!--empty-->', '1');

		//Test Set validation
		testTemplate.bindRecord.record('unknown', 'name').invalid(true);
		test.isTrue(testTemplate.bindRecord.record('unknown', 'name').invalid());
		//Reactivity
		Meteor.flush();
		//Test reply should expect name as dirty, warning and invalid 'dwi' - dweir  (dirty, warning, error, invalid, required)
		test.equal(onscreen1.rawHtml(), 'dwinamedwi', '2');

		//Test Set validation
		testTemplate.bindRecord.record('unknown', 'email').required(true);
		testTemplate.bindRecord.record('unknown', 'name').required(true);
		test.isTrue(testTemplate.bindRecord.record('unknown', 'name').required());
		//Reactivity
		Meteor.flush();
		//Test reply should expect name as dirty, error, invalid and required 'deir' - dweir  (dirty, warning, error, invalid, required)
		//Test reply should expect email as dirty and required 'dr' - dweir  (dirty, warning, error, invalid, required)
		test.equal(onscreen1.rawHtml(), 'deirnamedeiremaildr', '3');

		onscreen1.kill();		
	});

	//bindReport
	Tinytest.add('Handlebar bind helper - Helper {{bindReport}}', function (test) {
	});
		

	//bindStatusReport template level
	Tinytest.add('Handlebar bind helper - Helper {{bindStatusReport}} - Level: Template', function (test) {
		var	testCollection = new Meteor.Collection(null);
		//Test binding template to collection
		var testTemplateName = 'test_helpers_40';
		var testTemplate = Template[testTemplateName];

		test.equal(testTemplate.bindRecord, undefined);
		testCollection.bindTemplate(testTemplateName);
		test.notEqual(testTemplate.bindRecord, undefined);
		//Setup test template
		var onscreen1 = OnscreenDiv(Meteor.render(testTemplate));
		test.notEqual(testTemplate, undefined, testTemplateName);
		//Test helper - no validation set so should expect empty reply
		test.equal(onscreen1.rawHtml(), '<!--empty-->', '1');

		//Test Set validation
		testTemplate.bindRecord.record('unknown', 'name').invalid(true);
		test.isTrue(testTemplate.bindRecord.record('unknown', 'name').invalid());
		//Reactivity
		Meteor.flush();
		//Test reply should expect name as dirty, warning and invalid 'dwi' - dweir  (dirty, warning, error, invalid, required)
		test.equal(onscreen1.rawHtml(), 'd1,w1,e,i1,rd1,w1,e,i1,rnamed1,w1,e,i1,r', '2');

		//Test Set validation
		testTemplate.bindRecord.record('unknown', 'email').required(true);
		testTemplate.bindRecord.record('unknown', 'name').required(true);
		test.isTrue(testTemplate.bindRecord.record('unknown', 'name').required());
		//Reactivity
		Meteor.flush();
		//Test reply should expect name as dirty, error, invalid and required 'deir' - dweir  (dirty, warning, error, invalid, required)
		//Test reply should expect email as dirty and required 'dr' - dweir  (dirty, warning, error, invalid, required)
		test.equal(onscreen1.rawHtml(), 'd2,w,e1,i1,r2d2,w,e1,i1,r2named1,w,e1,i1,r1emaild1,w,e,i,r1', '3');

		onscreen1.kill();		
	});

}());

//Test API:
//test.isFalse(v, msg)
//test.isTrue(v, msg)
//test.equalactual, expected, message, not
//test.length(obj, len)
//test.include(s, v)
//test.isNaN(v, msg)
//test.isUndefined(v, msg)
//test.isNotNull
//test.isNull
//test.throws(func)
//test.instanceOf(obj, klass)
//test.notEqual(actual, expected, message)
//test.runId()
//test.exception(exception)
//test.expect_fail()
//test.ok(doc)
//test.fail(doc)