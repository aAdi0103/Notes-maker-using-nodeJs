const express=require('express')
const app=express();
const path=require('path');
const fs=require('fs');

app.set('view engine','ejs');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));

// To create a file in the folter ./file when we click on submit to crete new note and new file in ./files

app.post("/create",function(req,res){
    fs.writeFile(`./files/${req.body.title.split(' ').join('')}`,req.body.details,function(err){
        res.redirect("/");
    });
})


// to show the created notes

app.get("/",function(req,res){

    var arr=[];
  fs.readdir(`./files`,function(error,files){
   
   // fs.readdir read the files of directory ./files asynchronysoly 
    //files contains a array of files created in  in the  ./files   folder

        files.forEach(function(file){

            var data=fs.readFileSync(`./files/${file}`,"utf-8");
            // fs.readFilesync() used to read data of the file

            arr.push({name:file,content:data});
        })
        res.render("index",{files:arr});

    })

     })


// to show the content of the folder

app.get("/read/:filename",function(req,res){

    // fs.readfile() asynchronsly read the data of the file

    fs.readFile(`./files/${req.params.filename}`,"utf-8",function(err,data){

        // to extract values and data from url we use 'req.params'

        res.render('show',{name:req.params.filename,filedata:data});
    })
})


// to delete the folder

app.get("/delete/:filename",function(req,res){
   fs.unlink(`./files/${req.params.filename}`,function(err){
    res.redirect("/")
   })
})



app.get("/edit/:filename", function(req, res) {
    fs.readFile(`./files/${req.params.filename}`, "utf-8", function(err, data) {
     res.render('edit', { topic: req.params.filename, data: data })
    })
 })
 app.post("/edit/:filename", function (req, res) {
    const filename = req.params.filename;
    fs.writeFile(`./files/${filename}`, req.body.details, function (err) {
        res.redirect("/")
    });
});
 
 
 
app.listen(3000);


