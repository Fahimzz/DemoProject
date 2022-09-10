const express = require('express');
var cors = require('cors');
const app = express();
const fs = require('fs');
app.use(cors());
const dump_collection= require("./Model/dump_collection");
const hourly_worker_count= require("./Model/hourly_worker_count");
const User= require("./Model/User");
const path = require('path');
const mongoose = require('mongoose');
app.use('/css', express.static('css'));
app.use('/img', express.static('img'));
app.use('/js', express.static('js'));
app.use('/lib', express.static('lib'));
app.use('/scss', express.static('scss'));
var validator = require("email-validator");
const upload = require('./config/uploadConfig');



const dburl= "mongodb+srv://Fahimzzz:Fahim0011@metawirks.eptg1.mongodb.net/Workers?retryWrites=true&w=majority"

app.use(express.urlencoded({ extended: true }));  

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
mongoose.connect(dburl, { useNewUrlParser: true, useUniFiedTopology: true })
  .then((result) =>  app.listen(4444, () => {
  console.log('Listening on port 4444');
}))
  .catch((err) => console.log(err));


app.get('/',function(req,res){
    res.sendFile(path.join(__dirname+'/signin.html'));
    
  });
  app.get('/signup',function(req,res){
    res.sendFile(path.join(__dirname+'/signup.html'));
   
  });
  app.get('/index',function(req,res){
    res.sendFile(path.join(__dirname+'/index.html'));
    
  });
  app.post('/registration',async(req,res)=>{
   try{
    const{userName,Password,Email}= req.body;
    let exists = false;
            
    let validate= validator.validate(Email);
    if (validate) {
      await User.find({ Email: Email })
          .then((result) => {
              if (result.length != 0) {
                  exists = true;
              }
      
          }).catch((err) => {
              console.log(err);
          })
      if (exists) {
          res.status(201).json({ message: "Already Exists", response: false });
  
      }
      else {
          const user = new User({

              Email: Email.toLowerCase(),
              Passwords: Password,
              Role:"Admin",
              UserName:userName
          })
          user.save()
              .then((result) => {
                  res.status(201).json({ response: true, result });
              })
              .catch((err) => {
                  console.log(err);
              })
      }
  }
  else {
       res.status(201).json({ response: false, message: "Invalid Email address" });
  }





   }catch(err){

   }

  });

  app.post('/login',async(req,res)=>{
    try{
      const{Email,Password}= req.body;
      const user = await User.findOne({ Email:Email });

            if (user!=null) {
                if (user.Passwords != Password) {
                    res.status(201).json({message:"Invalid Email or Password",response:false})
                
                }
                else {
                    let data = {
                        username: user.UserName, 
                        email: user.Email, 
                        Gasthreshold: user.Role
                    }

                    res.status(201).json({message:"Valid User",response:true, data})
                
                }
            
            } else {
                res.status(201).json({message:"Invalid Email or Password",response:false})
            }

    }catch(e){

    }
  })
  
app.post('/uploaddata',upload.single('txt'),async(req,res) =>{
    

try {
    const { filename } = req.file;
    const data = fs.readFileSync(filename, 'utf8');
    var s = JSON.stringify(data);
    var p = data.split("\r\n");
    var arr = [];
    for (let i = 1; i < p.length; i++)
    {
        var k = p[i].split(" ");
        var d = {
            "Entry": k[0],
            "Exit": k[8],
            "DateTime": k[12].split("-"),
            "Time":k[13].split(":")
        }
        arr.push(d);
    }
    console.log(arr);
    for(let i=0;i<arr.length;i++){
      const dumpcollection = new dump_collection({
        entry:parseInt(arr[i].Entry),
        exit:parseInt(arr[i].Exit),
        dateTime:{
          year:parseInt(arr[i].DateTime[0]),
          month:parseInt(arr[i].DateTime[1]),
          day:parseInt(arr[i].DateTime[2]),
          hour:parseInt(arr[i].Time[0])
        }

      
      })
      await dumpcollection.save()
          .then((result) => {
              console.log(result);
          })
          .catch((err) => {
              console.log(err);
          })

    }
    let v= await eventTrigger(arr);
    res.status(200).json({message:"ok", response:v})
}
 catch (err) {
  console.error(err);
}
});

async function eventTrigger(arr){
 for(let items of arr){
  var newArray = arr.filter(function (el)
    {
      return el.Time[0] == items.Time[0];
    })
    let totalWorkerCount=0;
    if(newArray.length>0){
          for(let i= 0;i<newArray.length;i++){
            totalWorkerCount=totalWorkerCount+(parseInt( newArray[i].Entry)-parseInt(newArray[i].Exit));

          }
  
          const workerCount = new hourly_worker_count({
            worker_count:totalWorkerCount,
            dateTime:{
              year:parseInt(items.DateTime[0]),
              month:parseInt(items.DateTime[1]),
              day:parseInt(items.DateTime[2]),
              hour:parseInt(items.Time[0])
            }

          
          })
          await workerCount.save()
              .then((result) => {
                  console.log(result);
              })
              .catch((err) => {
                  console.log(err);
              })

  
      }
      let filterarray= arr.filter(function (el)
      {
        return el.Time[0] != items.Time[0];
      })
      arr=filterarray;
  
  
  
  
  


 }

}
app.get('/allWorkersCount',async(req,res)=>{
  try{
    const perennials = await hourly_worker_count.find({});
    let workercount=[];
    let hours=[];
    for(i in perennials)
    {
      workercount.push(perennials[i].worker_count);
      hours.push(perennials[i].dateTime.hour)
    }
    let data={
      WorkersCount:workercount,
      Hours:hours
    }
    res.status(200).json({message:"data Found",body:data});

  }catch(e){

  }
})
app.get('/allUser',async(req,res)=>{
  try{
    const perennials = await User.find({});
    let data=[];
    
    for(i in perennials)
    {
      let item={
        Email:perennials[i].Email,
        userName:perennials[i].UserName,
        Role:perennials[i].Role
      }
      data.push(item);
    }
    
    res.status(200).json({message:"data Found",body:data});

  }catch(e){

  }
})
app.delete('/deleteUser',async(req,res)=>{
  try{
    const {email}= req.body;
    const query = { Email: email };
    const result = await User.deleteOne(query);
    if (result.deletedCount === 1) {
      res.status(202).json({message:"deleted"})
    } else {
      res.status(204).json({message:"Error Occured"})

    }

  }catch(e){
    res.status(204).json({message:e})


  }
})