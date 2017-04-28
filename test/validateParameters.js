var chai = require("chai"),
    expect = chai.expect;

var paqCPointerTypes = require("../");


describe('paramSchema', function() {
    var schema = paqCPointerTypes.paramSchema;

    var validates = require('ajv')({
        //useDefaults: true,
        v5: true,
        allErrors: true,
        verbose: true,
        format: 'full',
    }).compile(schema);
    var validateParameters = function(params) {
        return validates(params) ? [] : validates.errors;
    }

	it('should be an object', function() {
		expect(schema).to.be.an('object');
	});
	describe('when parameters is an empty object', function() {
		it('should be valid', function() {
			expect(validateParameters({})).to.eql([]);
		});
	});

});
