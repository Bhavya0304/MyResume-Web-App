const User = require('../models/User');
const Response = require('../classes/Response');
const MapPaths = require('../classes/Mappaths');


module.exports = { 
    post:(req,res)=>{
        var username = req.params.id;
        if(!username){
            username = "bhavya0304";
        }
        var number = req.body.length == undefined ? 5 : parseInt(req.body.length);
        var skip = req.body.offset == undefined ? 1 : (parseInt(req.body.offset)-1) * parseInt(req.body.length);
        User.getUserId(username).then((user)=>{
            if(!user){
                var responseData = new Response({Status:404,Error:"No user found!"});
                res.send(responseData.getResponse());
            }
            else{
                User.getUserTimeline(user._id,number,skip).then((data)=>{
                    var mp = new MapPaths(req.protocol+"://"+ req.get('host'));
                    data.map((value)=>{
                        value.Image = value.Image != undefined ? mp.getTimelineImages(value.Image) : "";
                        if(value.Icon != undefined && value.Icon != ""){
                            value.Icon.Icon  =  mp.getTimelineImages(username,value.Icon.Icon);
                        }
                        return value;  
                    });
                    var responseData = new Response({Status:200,Data:{Data:data}});
                    res.send(responseData.getResponse());
                }).catch((error)=>{
                    var responseData = new Response({Status:501,Error:error});
                    res.send(responseData.getResponse());
                })
            }
        }).catch((error)=>{
            var responseData = new Response({Status:501,Error:error});
            res.send(responseData.getResponse());
        });
    }
};  