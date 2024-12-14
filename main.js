const express = require("express")
const path = require("path")
const bodyParser = require("body-parser")
const admin = require("firebase-admin");
app = express();
PORT = 8005;

const serviceAccount = require("./serviceaccountkey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });


const db = admin.firestore();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended : true}));
app.use(express.static(path.join(__dirname,"public")));



app.get("/", async (req,res)=>{
    const tasks = [];
    const snapshot = await db.collection("tasks").get();
    snapshot.forEach((doc)=>{
        tasks.push({id: doc.id, ...doc.data()}); 

    });
    res.render("index", { tasks });
});

app.post("/add", async (req,res)=>{
    const task = req.body.task;
    if(task){
        await db.collection("tasks").add({task: task,completed: false});
    }
    res.redirect("/");
});

app.post("/delete/:id", async (req,res)=>{
    const id = req.params.id;
    await db.collection("tasks").doc(id).delete();
    res.redirect("/");
});

app.post("/complete/:id", async (req,res)=>{
    const id = req.params.id;
    await db.collection("tasks").doc(id).update({completed:true});
    res.redirect("/");
});



app.listen(PORT,()=>{
    console.log("Server Started at http://localhost:${PORT}")
})






