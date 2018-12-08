
const MongoDB = require('mongodb'),
      MongoClient = MongoDB.MongoClient,
      ObjectID = MongoDB.ObjectID;

var Config=require('./config.js');

class Db{

    static getInstance () {
        if(!Db.instance){
            Db.instance=new Db();
        }
        return  Db.instance;
    }

    constructor(){
        this.dbClient='';
        this.connect();
    }

    connect () { 
        let _that=this;
        return new Promise((resolve,reject)=>{
            if(!_that.dbClient){ 
                // let authDbUrl = `mongodb://${Config.username}:${Config.password}@${Config.dbUrl}`
                let authDbUrl = `mongodb://${Config.username}:${Config.password}@${Config.dbUrl}?authSource=admin`
                console.log(authDbUrl)
                MongoClient.connect(authDbUrl, { useNewUrlParser: true },(err,client)=>{
                    if(err){
                        reject(err)
                        return
                    }else{
                        _that.dbClient=client.db(Config.dbName);
                        resolve(_that.client)
                    }
                })
            }else{
                resolve(_that.dbClient);
            }
        })

    }

    find(collectionName,json1,json2,json3){
        if(arguments.length==2){
            var attr={};
            var slipNum=0;
            var pageSize=0;

        }else if(arguments.length==3){
            var attr=json2;
            var slipNum=0;
            var pageSize=0;
        }else if(arguments.length==4){
            var attr=json2;
            var page=json3.page ||1;
            var pageSize=json3.pageSize||20;
            var slipNum=(page-1)*pageSize;

            if(json3.sortJson){
                var sortJson=json3.sortJson;
            }else{
                var sortJson={}
            }
        }else{
            console.log('传入参数错误')
        }

        return new Promise((resolve,reject)=>{
            this.connect().then((db)=>{
                //var result=db.collection(collectionName).find(json);
                var result =db.collection(collectionName).find(json1,{fields:attr}).skip(slipNum).limit(pageSize).sort(sortJson);
                result.toArray(function(err,docs){
                    if(err){
                        reject(err);
                        return;
                    }
                    resolve(docs);
                })

            })
        })
    }
    update (collectionName, json1, json2) {
        return new Promise((resolve, reject) => {
            this.connect().then(db => {
                db.collection(collectionName).updateOne(json1, {
                    $set: json2
                }, function(err, result) {
                    if (err) {
                        reject(err)
                        return
                    } else {
                        resolve(result)
                    }
                })
            })
        })
    }
    insert (collectionName, json) {
        return new Promise((resolve, reject) => {
            this.connect().then(db => {
                db.collection(collectionName).insertOne(json, function(err, result) {
                    if (err) {
                        reject(err)
                        return
                    } else {
                        resolve(result)
                    }
                })
            })
        })
    }
    remove (collectionName, json){
        return new Promise((resolve, reject) => {
            this.connect().then(db => {
                db.collection(collectionName).removeOne(json, function(err, result) {
                    if (err) {
                        reject(err)
                        return
                    } else {
                        resolve(result)
                    }
                })
            })
        })
    }
    getObjectID (id) {
        return new ObjectID(id)
    }
    count(collectionName,json){
        return new  Promise((resolve,reject)=> {
            this.connect().then((db)=> {
                var result = db.collection(collectionName).countDocuments(json);
                result.then(function (count) {

                    resolve(count);
                })
            })
        })

    }
}


module.exports=Db.getInstance();
