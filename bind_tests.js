var	testCollection = new Meteor.Collection(null);

(function () {

	Tinytest.add('Handlebar bind - General test', function (test) {
	});

//TODO: write tests for all the code...

	/*Tinytest.addAsync("Handlebar helpers - test {{findOne}} and {{find}}", function (test, onComplete) {
		testCollection.insert({ a: 1, b:2 });

		var onscreen1 = OnscreenDiv(Meteor.render(Template.test_helpers_30)); //findOne
		var onscreen2 = OnscreenDiv(Meteor.render(Template.test_helpers_31)); //find
		var onscreen3 = OnscreenDiv(Meteor.render(Template.test_helpers_32)); //with find
		var onscreen4 = OnscreenDiv(Meteor.render(Template.test_helpers_33)); //with find return a
		var onscreen5 = OnscreenDiv(Meteor.render(Template.test_helpers_34)); //each find return a

		test.notEqual(Template.test_helpers_30, undefined, 'findOne');
		test.notEqual(Template.test_helpers_31, undefined, 'find');
		test.notEqual(Template.test_helpers_32, undefined, 'with');
		test.notEqual(Template.test_helpers_33, undefined, 'with return a');
		test.notEqual(Template.test_helpers_34, undefined, 'each return a');

		test.equal(onscreen1.rawHtml(), '[object Object]', '{{findOne}}');
		test.equal(onscreen2.rawHtml(), '[object Object]', '{{find}}');
		test.equal(onscreen3.rawHtml(), 'ok', 'with {{findOne}}');
		test.equal(onscreen4.rawHtml(), '1', 'with {{findOne}}');
		test.equal(onscreen5.rawHtml(), '1', 'each {{find}}');
		//console.log(onscreen5.rawHtml());

		testCollection.remove({}); //Remove all
		Meteor.flush();
		test.equal(onscreen1.rawHtml(), '<!--empty-->', '{{findOne}}');
		test.equal(onscreen2.rawHtml(), '[object Object]', '{{find}}'); //Guess this allways returns an object
		//test.equal(onscreen3.rawHtml(), 'ok', 'with {{findOne}}');
		test.equal(onscreen4.rawHtml(), '<!--empty-->', 'with {{findOne}}');
		test.equal(onscreen5.rawHtml(), 'none', 'each {{find}}');
		//console.log(onscreen5.rawHtml());
		onscreen1.kill();
		onscreen2.kill();
		onscreen3.kill();
		onscreen4.kill();
		onscreen5.kill();
		onComplete();
	});*/

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