const websocket = require('ws').Server;

const wss = new websocket({port:5000});
chatHistory = [];
initialData = {
    "from":"Brandon",
    "message":"init message"
}
/*chatHistory.push(initialData);
chatHistory.push({"from":"Brandon", "message":"one"});
chatHistory.push({"from":"Brandon", "message":"two"});
chatHistory.push({"from":"Brandon", "message":"three"});
chatHistory.push({"from":"Brandon", "message":"four"});
chatHistory.push({"from":"Brandon", "message":"five"});
chatHistory.push({"from":"Brandon", "message":"six"});
chatHistory.push({"from":"Brandon", "message":"seven"});
chatHistory.push({"from":"Brandon", "message":"eight"});
chatHistory.push({"from":"Brandon", "message":"nine"});
chatHistory.push({"from":"Brandon", "message":"ten"});
chatHistory.push({"from":"Brandon", "message":"eleven"});
chatHistory.push({"from":"Brandon", "message":"twelve"});
chatHistory.push({"from":"Brandon", "message":"thirteen"});
chatHistory.push({"from":"Brandon", "message":"fourteen"});*/

wss.on('connection', ws => {
    console.log("client connected");
    //if chatHistory is not empty
    //if(Object.keys(chatHistory).length>0){
    if(chatHistory.length >0){
        const replyMessage = {
            type : "chathistory",
            data : chatHistory
        }
        console.log(JSON.stringify(replyMessage));
        ws.send(JSON.stringify(replyMessage));
    }
    else{
        const replyMessage = {
            type : "initial",
            data : "hi"
        }
        console.log(replyMessage);
        ws.send(JSON.stringify(replyMessage));
    }
    ws.on('message', message => {
        try{
            const data = JSON.parse(message);
            var replyMessage = {};
            if(checkForLink(data.message)){
                var embedURL = convertToEmbedURL(data.message);
                replyMessage['type'] = "youtubelink";
                replyMessage['data'] = embedURL;
                wss.clients.forEach(clients => {
                    clients.send(JSON.stringify(replyMessage));
                })
            }

            replyMessage['type'] = "message";
            replyMessage['data'] = data;
            chatHistory.push(data);
            wss.clients.forEach(clients => {
                clients.send(JSON.stringify(replyMessage));
            })
        }catch(err){
            const replyMessage = {
                type : "error",
                data : "invalid JSON"
            }
            console.log("ERROR:"+err);
            ws.send(JSON.stringify(replyMessage));
        }
    })
})

checkForLink = (input) => {
    const url = input.split('.');
    if((url.length>2 && url[1].includes("yout")) || (url.length>1 && url[0].includes("yout")) ) {
        return true;
    }
    else{
        return false;
    }
}

convertToEmbedURL = (input) =>{
    let embedURL = input.replace('watch?v=', 'embed/')
    //embedURL = embedURL + '?autoplay=1';
    embedURL+='?autoplay=1';
    return embedURL;
}
