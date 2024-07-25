if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const { error } = require('console');
const Mysql = require('mysql2');
const express = require('express');
const app = express();
const path = require("path");
const { v4: uuidv4 } = require('uuid');

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views")); 
app.use(express.static(path.join(__dirname, 'public')))

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({extended: true}));
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);
const methodOverride = require("method-override");
const { connect } = require('http2');
app.use(methodOverride("_method"));

const connection = Mysql.createConnection({
    host: 'localhost', // 127.0.0.1
    user: 'root',
    database: 'Marriage_data',
    password : process.env.password,
});

let q = "show tables";



app.get("/users/new", (req, res) => {
    res.render("index1");
    // res.sendFile();
});

app.get("/", (req, res) => {
    let q = 'SELECT * from user';
    try{
        connection.query(q, (err, result) => {
            if (err) throw err;
            console.log(result);
            res.send(result);
        });
    } catch(err) {
        console.log(err);
        res.send("error in db");
    }
});

app.post("/users", (req,res)=>{
    console.log("post user")
    console.log(req.body)
    let {husband_name: husband_name, wife_name: wife_name,marriage_date:marriage_date,marriage_location:marriage_location,husband_aadhar:husband_aadhar,husband_address:husband_address,wife_aadhar:wife_aadhar,wife_address:wife_address,atomic_number:atomic_number,section_number:section_number} = req.body;
    let srno = uuidv4();
    let q2  = `insert into user values('${srno}', '${section_number}', '${husband_name}', '${wife_name}', '${marriage_date}', '${marriage_location}','${husband_aadhar}','${husband_address}','${wife_aadhar}','${wife_address}','${atomic_number}');`
    try{
        connection.query(q2, (err, result) => {
            if(err) throw err;
            let user = result;
            console.log(user); 
        });
        res.redirect("/users")
    } catch(err) {
        console.log(err);
        res.send("error in db");
        

    }

})

//show route
app.get("/users", (Req, res) => {
    let q = 'SELECT * from user';
    try{
        connection.query(q, (err, users) => {
            if (err) throw err;
            res.render("showusers.ejs", {users});
        });
    } catch(err) {
        console.log(err);
        res.send("error in db");
    }
});

app.get("/users/:srno/edit", (req, res) => {
    let { srno } = req.params;
    let q = `select * from user where srno= '${srno}'`;
    try{
        connection.query(q, (err, result) => {
            if(err) throw err;
            let user = result[0];
            //console.log(result);
            res.render("edit.ejs", { user });
        });
    } catch(err) {
        console.log(err);
        res.send("error in db");
    }
});

// app.patch("/users/:srno/:id/:mob", (req, res) => {
app.patch("/users/:srno/", (req, res) => {
    let { srno } = req.params;
    let {husband_name: newHusband_name, wife_name: newWife_name,} = req.body;
    let q = `select * from user where srno= '${srno}'`;
    try{
        connection.query(q, (err, result) => {
            if(err) throw err;
            let user = result[0];
            let q2 = `update user set husband_name = '${newHusband_name}', wife_name = '${newWife_name}' where srno='${srno}'`;
            connection.query(q2, (err, result) => {
                if(err) throw err;
                res.redirect("/users");
            });
        });
    } catch(err) {
        console.log(err);
        res.send("error in db");
    }
});

//delete route
app.delete("/users/:srno", (req, res) => {
    let { srno } = req.params;
    let q = `delete from user where srno= '${srno}'`;
    try{
        connection.query(q, (err, users) => {
            if (err) throw err;
            res.redirect("/users");
        });
    } catch(err) {
        console.log(err);
        res.send("error in db");
    }
});

app.listen("8080", () => {
    console.log('server is listening');
});