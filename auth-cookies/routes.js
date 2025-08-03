const cookieParser = require("cookie-parser");
const express = require("express")
//encrypt and decrypt password
const bycrypt = require("bcrypt")
const app = express();
const jwt = require("jsonwebtoken")
const path = require("path")
const usermodel = require("./models/userModel");





app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));


//by this we can read cookies in console log
app.use(cookieParser())

app.get("/", (req, res) => {
    res.render("index")
})



app.post("/create",  (req, res) => {
    const { name, email, password } = req.body;
    bycrypt.genSalt(10, (err, salt) => {
        bycrypt.hash(password, salt, async (err, hash) => {
            req.body.password = hash;
            const user = await usermodel.create(req.body);
            const token = jwt.sign({email}, "shhhhhhh_its_a_secret");
            //for user to be in website to do something without logging on every request
            res.cookie("token", token);
            res.send(user)
        })
    })
})

//for logout
app.get("/logout", (req, res) => {

    res.cookie("token", "")
    res.redirect("/login")
})

app.get("/login", (req, res) => {
    res.render("login")
})



app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await usermodel.findOne({email});
    if(user){
        bycrypt.compare(password, user.password, (err, result) => {
            if(result){
                const token = jwt.sign({email}, "shhhhhhh_its_a_secret");
                res.cookie("token", token);
                res.redirect("/")
            }else{
                res.send("invalid password")
            }
        })
    }else{
        res.send("invalid email")
     }
})

































//cookie is setup something from server to local browser
//setup cookies and if we go any page we will get cookie automatically
// app.get("/", (req, res) => {
//     //to set cookies we use response
//     res.cookie("name", "Abhi");
//     res.send("cookie done")
// })
//ENCRYPTION
// or any other page
// app.get("/login", (req, res) => {
//     // salt is a random string which mix with password to generate un readable password string
//     bycrypt.genSalt(10, (err, salt) => {
//         bycrypt.hash("mypassword", salt, (err, hash) => {
//             console.log(hash);
            
//         })
//     })
//     res.send("login page")
// })

//DECRYPTION
app.get("/register", (req, res) => {
    // the encoded string from database will be campared with user password(mypassword) from frontend
    bycrypt.compare("mypassword", "$2b$10$H1Y3sqPQql7y6C8FUl7LguK.zlnpipS30YPDS/PokD6QmiMPT1IYK", (err, result) => {
        //will print true if password is correct else false
        console.log(result);
        
    })
})


app.get("/about", (req, res) => {
    res.send("about page")
    //to read cookies we use request
    console.log(req.cookies);
    
})



//jwt
// app.get("/", (req, res) => {
//                         //can be anything name, email etc.......
//                         //name will be encrypted on basis of `secretkey`
//                         //and can be decrypted on basis of `secretkey` so choose strong secretkey     
//     const token = jwt.sign({name: "abhi"}, "secretkey");
//     //send token in cookies
//     res.cookie("token", token);
//     res.send(token)
// })

// app.get("/user", (req, res) => {
    
//     //decrypt token which is stored in cookies
//     const user = jwt.verify(req.cookies.token, "secretkey");
//     console.log(user);
//     res.send(user)
// })

app.listen(3000, () => {
    console.log("Server is running on port 3000")
})