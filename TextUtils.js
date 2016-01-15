/**
 * @author Saad Kothawala
**/

var TextUtils  = {
	/**
	 * This basically trys to remove basic punctuation and conjugations to the word
	 * This is not the best approach, it'd be better to use a library that analyzes sentence
	 *		structure and based on that returns the stem.
	 *
	 * @param word -> the word to analyze
	 * @return -> returns a string containing the stripped word
	**/
	removeStems: function(word){
		if(word == null)
			throw 'Word can not be null';

		word = word.toLowerCase();

		//it's actually more efficient to do the regex twice that combine them (per testing)
		//first we remove all punctutation but the apostrophe (used to remove possesive 's)
		word = word.replace(/[!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]/g, '');
		word = word.replace('\'s', '');
		word = word.replace(/(ed|ing|en)\b/g, '')


		var len = word.length;
		//3 because "his" is not plurarl, but ends in s
		if(len > 2 && word[len - 1] == 's')
			word = word.substring(0, len - 1);
		return word;
	},

	/**
	 * This methods return an object containing X many the most frequent words
	 * Please read the readme for more info on how this works
	 *
	 * @param word -> the text to analyze
	 * @param numToKeep -> The number of frequent words to keep
	 * @return -> returns an object similar to 
	 		{
				the: 10,
				is: 6,
				to: 9,
				and: 8,
				McQueen: 6 
			}

	**/
	getMostFrequentWords: function (numToKeep, text){
		if(text == null)
			throw 'Text to analyze can not be null';
		else if(numToKeep < 1)
			throw 'numToKeep must be greater than 0';

		text = text.split(' ');


		var allWords = Object();
		var mostCommonWords = Object();//max lenght should be 5
		mostCommonWords['00_length'] = 0;//00 used to prevent confusion with the actual word "length"
		mostCommonWords['00_smallestWordHere'] = -1;

		/*First add the word to the words object*/

		for (var i = 0; i < text.length; i++) {
			var workingWord = TextUtils.removeStems(text[i]);

			/*First, we check if this is a uniq word or not*/
			if(allWords[workingWord] != null){
				//it's a unique word, so update the count
				allWords[workingWord] += 1;

				//is this unique word a common word?
				if(mostCommonWords[workingWord]){
					//if so, the count must be updated in mostCommonWords hash as well
					mostCommonWords[workingWord] += 1;

					//was that word the smalles word in mostCommonWords? If so, it might not be anymore
					//but we take care of that next, not here.
				}//end is this unique word a common word?

			}else{
				//word is not unique, add it to the hash/object
				allWords[workingWord] = 1;
			}


			/*Next we check to see if this word can be a common word*/


			var frequencyOfWorkingWord = allWords[workingWord];

			//first check to see if the word is a common word.
			if(mostCommonWords[workingWord] == null){
				//if it's not a common word, can it be? Does it have potential?

				//to initially populat ethe mostCommonWords, we have to add the first five words in
				if(mostCommonWords['00_length'] < numToKeep){

					mostCommonWords[workingWord] = frequencyOfWorkingWord;

					//if this was the first word we added, we have to initialize smallestWordHere to be the only word there
					if(mostCommonWords['00_smallestWordHere'] == -1){
						mostCommonWords['00_smallestWordHere'] = workingWord;
					}else{
						//else calculate the smallest word
						for(commonWord in mostCommonWords)
							if(commonWord != 'length' && commonWord != 'smallestIndex')
								if(mostCommonWords[commonWord] < mostCommonWords[mostCommonWords['00_smallestWordHere']])
									mostCommonWords['00_smallestWordHere'] = commonWord;

					}
					mostCommonWords['00_length'] += 1;
				}else{
					//we already have mostCommonWords.length > numToKeep
					var leastFreqMostFreqWord = mostCommonWords['00_smallestWordHere'];
					var freqOfleastFreqMostFreqWord = mostCommonWords[leastFreqMostFreqWord];

					//is the frequency of the current word greated that frequency of smallest word in the mostCommonWords
					if(frequencyOfWorkingWord > freqOfleastFreqMostFreqWord){
						//if so, delete the smallest word in mostCommonWords and add the current one
						delete mostCommonWords[leastFreqMostFreqWord];
						mostCommonWords[workingWord] = frequencyOfWorkingWord;
						mostCommonWords['00_smallestWordHere'] = workingWord;
					}
				}
			}else{
				//this was a common word
				//if the common word was the smallest word there, it might not be anymore (because we have one more occurennce)
				if(mostCommonWords['00_smallestWordHere'] === workingWord)//recalculate smallest word only if smalles word is the working word
					for(commonWord in mostCommonWords)
						if(commonWord != '00_length' && commonWord != '00_smallestIndex')
							if(mostCommonWords[commonWord] < mostCommonWords[mostCommonWords['00_smallestWordHere']])
								mostCommonWords['00_smallestWordHere'] = commonWord;
			}
			
		};

		//we don't need to send those book keeping variables
		delete mostCommonWords['00_smallestWordHere'];
		delete mostCommonWords['00_length'];

		return mostCommonWords;
	}
}

//actually return the "class" when require is called.
module.exports = TextUtils;
