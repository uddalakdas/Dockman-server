/**
 * Created by rishi on 10/10/15.
 */
var mongoose = require("mongoose");
var Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;
var gfs = new Grid(mongoose.connection.db);
var fs = require('fs-extra')
exports.create = function(file,callback) {

    var writeStream = gfs.createWriteStream({
        filename: file.name,
        metadata : file.metadata
    });
    fs.createReadStream(file.path).pipe(writeStream);

    writeStream.on('close', function(file) {
        callback(null,file);
    });
    writeStream.on('error',function(err){
        callback(err);
    });
};


exports.read = function(id,callback) {
    console.log(id);
    var docId = mongoose.Types.ObjectId(id);
    gfs.files.findOne({_id:docId},function(err,file){
        if(err)
            callback(err,null);
        else {

            var readStream = gfs.createReadStream({
                _id: docId
            });
            console.log(file);
            callback(null,{name:file.filename,stream:readStream});
        }
    });
};