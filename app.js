const express = require('express');
const app = express();
const request = require('request');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.get("/", function(req, res){
   res.render("home");
});
app.get("/result", function(req, res){
    var query = req.query.user;
    var ab = query.split(" ");
    query = ab.join("+");
    if(query=="ambuj+raj"|| query=="Ambuj+Raj"|| query=="ambuj" || query=="Ambuj" || query=="ambujraj"){
        var url = 'https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=UCNj8krJYML-KG22xyumvMww&order=date&type=video&key=AIzaSyA58s6f45ex23jhsW0m54CpjhD71a4bJgc';
        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var parsed = JSON.parse(body);
                res.render("search", { search: parsed, amb: "Awesome !!" });
            }
        });
    }
    else{
    var url = 'https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&safeSearch=strict&order=relevance&type=video&q=' + query +'&key=AIzaSyA58s6f45ex23jhsW0m54CpjhD71a4bJgc';
    request(url, function(error, response, body){
         if(!error && response.statusCode == 200){
             var parsed = JSON.parse(body);
             res.render("search", {search: parsed, amb: ""});
         }
    });
}
});
app.get("*", function(req, res){
        res.redirect("/");
});
app.listen(process.env.PORT || 80, function(){
  console.log("Server Started");
});