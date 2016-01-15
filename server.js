var formidable = require('formidable'),
    http = require('http'),
    util = require('util'),
    fs   = require('fs-extra'),
    TextUtils = require('./TextUtils.js'); 

/**
 * @author Saad Kothawala
**/

var htmlHead = '<!DOCTYPE html><html lang="en"><head><!-- view-source:http://ironsummitmedia.github.io/startbootstrap-bare/ --> <meta charset="utf-8"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <meta name="viewport" content="width=device-width, initial-scale=1"> <meta name="description" content=""> <meta name="author" content=""> <title>Frequency Counter</title> <!-- Bootstrap Core CSS --> <link href="http://ironsummitmedia.github.io/startbootstrap-bare/css/bootstrap.min.css" rel="stylesheet"> <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries --> <!-- WARNING: Respond.js doesn\'t work if you view the page via file:// --> <!--[if lt IE 9]> <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script> <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script> <![endif]--></head><body> <nav class="navbar navbar-inverse navbar-fixed-top" role="navigation"> <div class="container"> <div class="navbar-header"> <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1"> <span class="sr-only">Toggle navigation</span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span> </button> <a class="navbar-brand" href="/">Frequency Counter</a> </div><div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1"> <ul class="nav navbar-nav"> <li> <a href="#">Home</a> </li></ul> </div></div></nav><div class="container" style="padding-top:100px;">';
var htmlForm = '<form class="" action="/upload" enctype="multipart/form-data" method="post"><div class=row><div clas=col-md-4><input class="form-control" type=file name=upload multiple></div><br><div clas=col-md-4><input min=1 type=number name=numFreq class="col-md-4" placeholder="Number of frequent words to get"></div><div class=col-md-4><input class="btn btn-large btn-success" type=submit value=Upload></div></div></form>';
var htmlFoot = '</div><!-- jQuery Version 1.11.1 --> <script src="http://ironsummitmedia.github.io/startbootstrap-bare/js/jquery.js"></script> <!-- Bootstrap Core JavaScript --> <script src="http://ironsummitmedia.github.io/startbootstrap-bare/js/bootstrap.min.js"></script></body></html>';

//handles errors
handleError = function (err, res){
	res.writeHead(200, {'content-type': 'text/html'});
	res.write(htmlHead);
	res.write('<span style="color:red; font-size:18px">Error: ' + err + "</span>");
	res.write(htmlForm);
	res.end(htmlFoot);
}

//handles successfully posted
handleSuccess = function (data, mostCommon, res){
	res.writeHead(200, {'content-type': 'text/html'});
	res.write(htmlHead);
	res.write('<p>Input: </p><pre>' + data + '</pre>');
	res.write('<table class="table table-hover"><thead><tr><th>Word</th><th>Frequency</th></tr></thead><tbody>')

	//because I'm not using a min heap or a sorted structure, I need to sort the most common
	var sorted = [];
	for(word in mostCommon)
		sorted.push([word, mostCommon[word]]);
	sorted.sort(function(a, b) {return b[1] - a[1]})

	
	for (var i = 0; i < sorted.length; i++) {
		res.write('<tr>');
			res.write('<td>');
			res.write(String(sorted[i][0]));//res.write needs to be string
			res.write('</td>');
			res.write('<td>');
			res.write(String([sorted[i][1]]));//res.write needs to be string
			res.write('</td>');
		res.write('</tr>');
	};
	res.write('</tbody></table>');
	res.write(htmlForm);
	res.end(htmlFoot);

}

//handles all requests
requestHandler = function (req, res) {

	if (req.url === '/upload' && req.method.toLowerCase() === 'post') {
		var form = new formidable.IncomingForm();

		form.parse(req, function(err, fields, files) {
			if(err)
				return handleError(err, res);

			if (files.upload.type !== 'text/plain')			
				return handleError('You can only upload txt files', res);

			fs.readFile(files.upload.path, 'utf8', function (err, data) {
				if (err)
					return handleError(err, res);

				return handleSuccess(data, TextUtils.getMostFrequentWords(fields.numFreq ? fields.numFreq : 25, data), res);
			});
		});//end form parse
		return;
	}
 
 	//show the form
	res.writeHead(200, {'content-type': 'text/html'});
	res.end(htmlHead + htmlForm + htmlFoot);

};


var port = process.env.PORT || config.port;//for heroku
var server = http.createServer(requestHandler);
server.listen(port);

console.log('Listening on ' + port);