let peerConnection;
let localStream;
let remoteStream;

// set up google stun server
let servers = {
    iceServers: [
        {
            urls:['stun:stun1.1.google.com:19302', 'stun:stun2.1.google.com:19302']
        }
    ]
}


let init = async () => {
    localStream = await navigator.mediaDevices.getUserMedia({video: true, audio: false});

    document.getElementById("user-1").srcObject = localStream;
    
}

let createOffer = async () => {
    // create peerconnectioin instance with ICE servers
    peerConnection = new RTCPeerConnection(servers);

    // set up a remote stream
    remoteStream = new MediaStream();
    document.getElementById("user-2").srcObject = remoteStream;

    localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream);
    })

    peerConnection.ontrack = async (event) => {
        event.streams[0].getTracks().forEach((track) => {
            remoteStream.addTrack(track);
        })
    }

    peerConnection.onicecandidate = async (event) => {
        if(event.candidate){
            document.getElementById('offer-sdp').value = JSON.stringify(peerConnection.localDescription);
        }
    }

    // create SDP offer
    let offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    document.getElementById('offer-sdp').value = JSON.stringify(offer);
    
}

let createAnswer = async () => {
     // create peerconnectioin instance with ICE servers
     peerConnection = new RTCPeerConnection(servers);

     // set up a remote stream
     remoteStream = new MediaStream();
     document.getElementById("user-2").srcObject = remoteStream;
 
     localStream.getTracks().forEach((track) => {
         peerConnection.addTrack(track, localStream);
     })
 
     peerConnection.ontrack = async (event) => {
         event.streams[0].getTracks().forEach((track) => {
             remoteStream.addTrack(track);
         })
     }
 
     peerConnection.onicecandidate = async (event) => {
         if(event.candidate){
             document.getElementById('offer-sdp').value = JSON.stringify(peerConnection.localDescription);
         }
     }

    let offer = document.getElementById("offer-sdp").value;
    if(!offer) return alert("Retrieve offer from peer first ...");

    offer = JSON.parse(offer)
    await peerConnection.setRemoteDescription();

    let answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    document.getElementById('answer-sdp').value = JSON.stringify(answer)

}

init();

// add on click event listener to create-offer button
document.getElementById('create-offer').addEventListener('click', createOffer)
document.getElementById('create-answer').addEventListener('click', createAnswer)