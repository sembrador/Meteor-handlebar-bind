(function () {
	
	Tinytest.add('Validators - required', function (test) {
		test.isFalse(Validators.required('')); //Only required may return false at empty input ''
		test.isTrue(Validators.required(' ')); //Any input is ok
	});

	Tinytest.add('Validators - email', function (test) {
		test.isTrue(Validators.email(''), "Only required may return false at empty input ''");
		test.isTrue(Validators.email('mh@gi2.dk'));
		test.isFalse(Validators.email('mh@gi2'));
		test.isFalse(Validators.email('mhgi2.dk'));
	});

	Tinytest.add('Validators - shouldBeLongerThan', function (test) {
		test.isTrue(Validators.shouldBeLongerThan(-1)(''), "Only required may return false at empty input ''"); //
		test.isTrue(Validators.shouldBeLongerThan(0)(''), "Only required may return false at empty input ''");
		test.isTrue(Validators.shouldBeLongerThan(10)(''), "Only required may return false at empty input ''");
		test.isFalse(Validators.shouldBeLongerThan(10)('1234567890')); //is 10
		test.isTrue(Validators.shouldBeLongerThan(10)('12345678901')); //is 11
		test.isFalse(Validators.shouldBeLongerThan(20)('12345678901234567890')); //is 20
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