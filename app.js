const express = require('express');
const app = express();
const request = require('request');
const PexelsAPI = require('pexels-api-wrapper');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/queryy", {useNewUrlParser: true});
var querySchema = new mongoose.Schema({
	query: String,
	hits: Number,
	ip: String
});
var pexelsClient = new PexelsAPI("563492ad6f917000010000012b9288effadf4cd59796c5e0d7d1493a");
app.enable('trust proxy');
var hit = 1;
var parsedpix ='';
var Query = mongoose.model("Query", querySchema);
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.get("/", function(req, res){
   res.render("home");
});
var resultt = '';
app.get("/result", function(req, res){
    var queryy = req.query.query;
    var ip= req.ip;   
 Query.create({query: queryy, hits: hit, ip: ip});
    var ab = queryy.split(" ");
    queryy = ab.join("+");
    pexelsClient.searchVideos(queryy, 15, 1)
        .then(function (result) {
            resultt = result;
        }).
        catch(function (e) {
            console.err(e);
        });
    var urlpix = 'https://pixabay.com/api/videos/?key=9494342-0f51f6ed3422203dd259dafaa&q='+ queryy +'&per_page=15&pretty=true';
    var url = 'https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&safeSearch=strict&order=relevance&type=video&q=' + queryy + '&key=AIzaSyA58s6f45ex23jhsW0m54CpjhD71a4bJgc';
    //var urlpix = 'https://pixabay.com/api/videos/?key=9494342-0f51f6ed3422203dd259dafaa&q='+queryy+'&per_page=25&order=latest';
    request(urlpix, function(erro, respo, bod){
        if(!erro && respo.statusCode == 200){
           parsedpix = JSON.parse(bod);
            
        }
    });
    request(url, function(error, response, body){
         if(!error && response.statusCode == 200){
             var parsed = JSON.parse(body);
		hit++;
             res.render("search", {search: parsed, pixx: parsedpix, resu: resultt});
         }
    });

});
app.get("/trend", function(req, res){
    var u = 'https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&regionCode=IN&maxResults=26&key=AIzaSyA58s6f45ex23jhsW0m54CpjhD71a4bJgc';
    request(u, function(erro, respo, bod){
        if(!erro && respo.statusCode == 200){
            var pars = JSON.parse(bod);
            res.render("trend", {bod: pars});
        }
    });
});
app.get("*", function(req, res){
        res.redirect("/");
});
app.listen(process.env.PORT || 80, function(){
  console.log("Searched Queries are:");
});
