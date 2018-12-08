
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

    find (collectionName,json1, json2, json3) {
        let attr = {}
        let slipNum = 0
        let pageSize = 0
        if (arguments.length == 2) {
            attr = {}
            slipNum = 0
            pageSize = 0
        } else if (arguments.length == 3) {
            attr = json2
            slipNum = 0
            pageSize = 0
        } else if (arguments.length == 4) {
            attr = json2
            let page = json3.page || 1
            pageSize = json3.pageSize || 20
            slipNum = (page - 1) * pageSize
        } else {
            console.log('传入参数错误')
        }
        return new Promise((resolve,reject)=>{
           this.connect().then((db)=>{
                /*
                 * DB.find('user', {}) 返回所有数据
                 * DB.find('user', {}, {'title': 1}) 返回所有数据 只返回一列
                 * DB.find('user', {}, {'title': 1}, {'page': 2, 'pageSize': 20}) 返回第二页的数据
                 * */    
                
                
                var result = db.collection(collectionName).find(json1, attr).skip(slipNum).limit(pageSize)
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
