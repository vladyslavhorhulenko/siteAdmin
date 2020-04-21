const mongoose = require('mongoose');
var Topic = require('../models/topic.js')

var createTopic = function(topic, done){
  var newTopic = new Topic(topic);
  newTopic.save(function(err, data){
    if(err){
      return console.log(err);
    }
    done(null, data);
  });
}

var findAllTopics = async function(done){
   await Topic.find({}, null, {sort: {date: -1}}, async function(err, data){
     if(err){
       return console.log(err);
     }
     await done(null, data);
   });
}

var findTopicById = async function(id, done){
  await Topic.find({_id: id}, async function(err, data){
    if(err){
      console.log(err);
    }
    await done(null, data);
  });
}

exports.createTopic = createTopic;
exports.findAllTopics = findAllTopics;
exports.findTopicById = findTopicById;