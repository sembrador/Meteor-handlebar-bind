(function () {

	Tinytest.add('BindRecord - Basic IO', function (test) {
		var br = new BindRecord();
		//br.records[][]
		//Test get/setters for attributes:
		test.isFalse(br.get(1, 1, 'dirty'));
		br.record(1, 1).invalid(1);
		test.equal(br.record(1, 1).invalid(), 1);
		test.isTrue(br.get(1, 1, 'warning'));
		test.isFalse(br.get(1, 1, 'error'));
		test.isTrue(br.get(1, 1, 'dirty'));
		br.record(1, 1).node(2);
		test.equal(br.record(1, 1).node(), 2);
		br.record(1, 1).required(3);
		test.equal(br.record(1, 1).required(), 3);
		test.isTrue(br.get(1, 1, 'error'));
		test.isFalse(br.get(1, 1, 'warning'));
		//Test new key
		br.record(1, 2).invalid(1);
		test.equal(br.record(1, 2).invalid(), 1);
		//Test new record
		br.record(2, 1).invalid(1);
		test.equal(br.record(2, 1).invalid(), 1);
		//Test deletion
		test.equal(Object.keys(br.record().data()).length, 2);
     	br.record(1, 1).del();
		test.equal(Object.keys(br.record().data()).length, 2);
     	br.record(1, 2).del();
		test.equal(Object.keys(br.record().data()).length, 1);
     	br.record(2).del();
		test.equal(Object.keys(br.record().data()).length, 0);
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