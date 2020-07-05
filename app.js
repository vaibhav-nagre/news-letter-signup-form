const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/", function(req,res){
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req, res){
    let firstName = req.body.fname;
    let lastName = req.body.lname;
    let email = req.body.email;
    console.log(firstName, lastName, email);

    const data = {
        members : [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    let jsonData = JSON.stringify(data);

    const url = "https://us10.api.mailchimp.com/3.0/lists/3a335f71eb"
   
    const options = {
        method: "POST",
        auth: "vaibhav:80a0869fb9e31724ddb914b3e4cddb95-us10"
    }

    const request = https.request(url, options, function(response){
        
        if(response === 200){
            res.sendFile(__dirname + "/success.html");
        }
        else{
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data){
            console.log(JSON.parse(data));
            
        })
    })
    
    request.write(jsonData);
    request.end();
})

app.post("/failure", function(req,res){
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, function(){
    console.log("server is running on port 3000!");
})

// API Key
// 80a0869fb9e31724ddb914b3e4cddb95-us10

// List ID
// 3a335f71eb