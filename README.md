# Frequency Counter
This simple web server accepts a text document from the user, counts how often each word is used in it, and then reports the top results in a nice table

- - - -
#### How it works

Basically, I use two data structures. First, I keep track of all the words and their frequency. I also keep a second hash/object that keeps track of the most frequent words. This allows me to save some time in the end where I don't have to worry about looping through the allWords to get the words with the highest frequency. I can optimize this further by making the frequent words structure a min-heap, but ultimately, I decided that would be over optimization.

I go through the input file word by word and add all the words/increment the frequency in the "allWords" structure. I also check if the current word being looked at has a frequency greated than the word with the lowest frequency in the most common frequency structure and if so I replace it with the word that I'm looking at now.

The only library that I really use is formidable, which allows me to easily integrate file uploads in my application without me having to worry about parsing headers and such. I also use mocha for testing.
- - - -
#### How to Use

Clone the repo, and hit node server.

- - - -
#### How to Test

If you have mocha instaled, just type go to the directory and type "mocha".

- - - -
#### Live Demo

https://frequencycounter.herokuapp.com/


