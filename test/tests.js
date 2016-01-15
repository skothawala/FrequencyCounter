var assert = require('assert');
var TextUtils = require('../TextUtils.js');

describe('TextUtils', function() {
  describe('#removeStems', function () {
    it('shoudl remove elementary stems from root words', function () {
    	assert.equal('queen', TextUtils.removeStems('queens'));
    	assert.equal('talk', TextUtils.removeStems('talks'));
    	assert.equal('talk', TextUtils.removeStems('talking'));
    	assert.equal('talk', TextUtils.removeStems('talked'));//I know
		
    	assert.equal('we', TextUtils.removeStems('we?'));    
    	
    	assert.equal('saad', TextUtils.removeStems('saad\'s!'));//Final, all encompassing    	
    });
  });
});

describe('TextUtils', function() {
  describe('#getMostFrequentWords', function () {
    it('should return an object/has of the most frequent words', function () {
    	
    	var test = 'Hello! My name is hello. I think that hello\'s a great name.';
    	assert.equal('{"hello":3,"my":1,"name":2}', JSON.stringify(TextUtils.getMostFrequentWords(3, test)));
    });
  });
});
