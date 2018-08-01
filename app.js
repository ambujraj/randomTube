const express = require('express');
const app = express();
const request = require('request');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));
var hit=1;
app.get("/", function(req, res){
   res.render("home");
   console.log("HITS= "+hit);
   hit++;
});
app.get("/result", function(req, res){
    var queryy = req.query.query;
    console.log(queryy);
    var ab = queryy.split(" ");
    queryy = ab.join("+");
    if(queryy=="ambuj+raj"|| queryy=="Ambuj+Raj"|| queryy=="ambuj" || queryy=="Ambuj" || queryy=="ambujraj"){
        var url = 'https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=UCNj8krJYML-KG22xyumvMww&order=date&type=video&key=AIzaSyA58s6f45ex23jhsW0m54CpjhD71a4bJgc';
        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var parsed = JSON.parse(body);
                res.render("search", { search: parsed});
            }
        });
    }
    else{
    var url = 'https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&safeSearch=strict&order=relevance&type=video&q=' + queryy +'&key=AIzaSyA58s6f45ex23jhsW0m54CpjhD71a4bJgc';
    request(url, function(error, response, body){
         if(!error && response.statusCode == 200){
             var parsed = JSON.parse(body);
             res.render("search", {search: parsed});
         }
    });
}
});
app.get("/trend", function(req, res){
    var u = 'https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&regionCode=IN&maxResults=26&key=AIzaSyA58s6f45ex23jhsW0m54CpjhD71a4bJgc';
    request(u, function(erro, respo, bod){
        if(!erro && respo.statusCode == 200){
            var pars = JSON.parse(bod);
            res.render("trend", {bod: pars});
        }
    })
});
app.get("*", function(req, res){
        res.redirect("/");
});
app.listen(process.env.PORT || 80, function(){
  console.log("Searched Queries are:");
});
