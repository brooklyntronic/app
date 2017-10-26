import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ListView,
  Platform,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { connect } from 'react-redux'
import Utilities from '../Services/Utilities'
import io from 'socket.io-client';
import BackArrow from '../Components/BackArrow'
import InCallManager from 'react-native-incall-manager';
import {
  RTCPeerConnection,
  RTCMediaStream,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStreamTrack,
  getUserMedia,
} from 'react-native-webrtc';
import styles from './Styles/VideoChatScreenStyle'
import Icon from 'react-native-vector-icons/FontAwesome'
import { EventRegister } from 'react-native-event-listeners'
const pcPeers = {};
let localStream, remoteStream;
// Styles

let container
let chatSocket
class NewVideoChatContainer extends Component {
  constructor (props) {
    super(props)
    this.state = {
      fetching: true, remoteList: {}
    }

    chatSocket = io.connect(Utilities.baseUrl, {transports: ['websocket']})
    chatSocket.on('hang_call_handle', ()=>{
      this.leave()
    })
    chatSocket.on('exchange', (data)=>{
      this.exchange(data);
    });
    chatSocket.on('leave', (socketId)=>{
      this.leave()
      this.closeStreams()
      if(this.props.navigation.state.params.called !== 'no'){
        this.props.navigation.goBack(this.props.navigation.state.params.called)
      } else{
        this.props.navigation.goBack(null) }
        chatSocket.disconnect();
        // socket = io.connect(Utilities.baseUrl, {transports: ['websocket']})
      });
    // chatSocket.on('connect', function(data) {
      
    // })
  }
  getLocalStream(isFront, callback) {
    let self = this
    let videoSourceId;
    if (Platform.OS === 'ios') {
      MediaStreamTrack.getSources(sourceInfos => {

        for (const i = 0; i < sourceInfos.length; i++) {
          const sourceInfo = sourceInfos[i];
          if(sourceInfo.kind == "video" && sourceInfo.facing == (isFront ? "front" : "back")) {
            videoSourceId = sourceInfo.id;
          }
        }
      });
    }
    getUserMedia({
      audio: true,
      video: {
        mandatory: {
        minWidth: 300, // Provide your own width, height and frame rate here
        minHeight: 300,
        minFrameRate: 30,
      },
      facingMode: (isFront ? "user" : "environment"),
      optional: (videoSourceId ? [{sourceId: videoSourceId}] : []),
    }
  }, function (stream) {
    callback(stream);
  }, this.logError);
  }
  join(roomID, turnServers) {
    const self = this
    chatSocket.emit('join', roomID, function(socketIds){
      for (const i in socketIds) {
        const socketId = socketIds[i];
        self.createPC(socketId, true, turnServers);
      }
    });
  }
  createPC(socketId, isOffer, turnServers) {
    const pc = new RTCPeerConnection(turnServers);
    pcPeers[socketId] = pc;
    const self = this
    self.setState(Object.assign({}, self.state, {connection: pc}))
    pc.onicecandidate = function (event) {
      if (event.candidate) {
        chatSocket.emit('exchange', {'to': socketId, 'candidate': event.candidate });
      }
    };

    function createOffer() {
      pc.createOffer(function(desc) {
        pc.setLocalDescription(desc, function () {
          // console.log('setLocalDescription', pc.localDescription);
          chatSocket.emit('exchange', {'to': socketId, 'sdp': pc.localDescription });
        }, self.logError);
      }, self.logError);
    }

    pc.onnegotiationneeded = function () {
      // console.log('onnegotiationneeded');
      if (isOffer) {
        createOffer();
      }
    }

    // pc.oniceconnectionstatechange = function(event) {
    //   if (event.target.iceConnectionState === 'completed') {
    //     setTimeout(() => {
    //       self.getStats();
    //     }, 1000);
    //   }
    // };
    // pc.onsignalingstatechange = function(event) {
    //   console.log('onsignalingstatechange', event.target.signalingState);
    // };

    pc.onaddstream = function (event) {
      let remoteList = self.state.remoteList;
      remoteList[socketId] = event.stream.toURL();
      remoteStream = event.stream;
      self.setState(Object.assign({}, self.state, { remoteList: remoteList}));
    };
    // pc.onremovestream = function (event) {
    //   console.log('onremovestream', event.stream);
    // };
    pc.addStream(localStream);
    return pc;
  }
  exchange(data) {
    const self = this
    const fromId = data.from;
    let pc;
    if (fromId in pcPeers) {

      pc = pcPeers[fromId];
    } else {
      pc = self.createPC(fromId, false);
    }
    if (data.sdp) {
      console.log('exchange sdp', data);
      pc.setRemoteDescription(new RTCSessionDescription(data.sdp), function () {
        if (pc.remoteDescription.type == "offer")
          pc.createAnswer(function(desc) {
            // console.log('createAnswer', desc);
            pc.setLocalDescription(desc, function () {
              // console.log('setLocalDescription', pc.localDescription);
              chatSocket.emit('exchange', {'to': fromId, 'sdp': pc.localDescription });
            }, self.logError);
          }, self.logError);
      }, self.logError);
    } else {
      console.log('exchange candidate', data);
      pc.addIceCandidate(new RTCIceCandidate(data.candidate));
    }
    self.setState(Object.assign({}, self.state,{fetching: false}));
  }
// leave(socketId) {
//   const self = this
//   let pc = pcPeers[socketId];
//   delete pcPeers[socketId];
//   let remoteList = self.state.remoteList;
//   delete remoteList[socketId]
// }

logError(error) {
  return null
}
mapHash(hash, func) {
  const array = [];
  for (const key in hash) {
    const obj = hash[key];
    array.push(func(obj, key));
  }
  array.length = 1
  return array;
}
getStats() {
  return null
  // const pc = pcPeers[Object.keys(pcPeers)[0]];
  // if (pc.getRemoteStreams()[0] && pc.getRemoteStreams()[0].getAudioTracks()[0]) {
  //   const track = pc.getRemoteStreams()[0].getAudioTracks()[0];
  //   console.log('track', track);
  //   pc.getStats(track, function(report) {
  //     console.log('getStats report', report);
  //   }, this.logError);
  // }
}
componentDidMount () {
  const self =  this
  fetch(Utilities.baseUrl + 'turnservers').then((resp)=>resp.json()).then((JSONresp)=>{
      self.getLocalStream(true, function(stream) {
        localStream = stream;
        const turnServers = JSONresp.v
        self.join(self.props.navigation.state.params.id, turnServers)
        self.setState({selfViewSrc: stream.toURL(), status: 'ready'});
        InCallManager.start('video')
      });
    });
    
    
  
}
leave(socketId) {
  this.closeStreams(socketId) 
}
_goBack () {
  this.closeStreams()
  chatSocket.emit('leave_chat');
}
_cancelCall () {
  chatSocket.emit('cancel_call', this.props.navigation.state.params.toId)
  chatSocket.disconnect()
   this.props.navigation.goBack(null)
}
closeStreams(socketId) {
  EventRegister.emit('offCall')
  if (socketId){
    pcPeers[socketId] ? pcPeers[socketId].close():null
    pcPeers = null
  }
  this.state.connection ? this.state.connection.close():null
  if (localStream){localStream.getTracks().forEach(track => track.stop())}  
    if (remoteStream){remoteStream.getTracks().forEach(track => track.stop())}
      this.setState({remoteList: {}})
    
  }
  render() {
    if (this.state.fetching) {
      return (
        <View style={styles.mainContainer}>
        <View style={styles.content}>
        <Text>Connecting</Text>
        <ActivityIndicator />
        </View>
        </View>
        );
    }
    return (
      <View style={styles.phoneContainer}>

      <View style={styles.mainContainer}>
      {this.state.selfViewSrc?<RTCView streamURL={this.state.selfViewSrc} style={styles.selfView}/>:null}

      {this.mapHash(this.state.remoteList, function(remote, index) {
        return <RTCView key={index} streamURL={remote} style={styles.remoteView}/>
      })
    } 
    </View>
    <View style={{position: 'absolute', bottom: 20, backgroundColor: 'transparent', justifyContent: 'flex-start'}} >
    <TouchableOpacity onPress={() => this._goBack()}><Icon name='ban' style={{color: 'red'}} size={65}/></TouchableOpacity>
    </View>
    </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewVideoChatContainer)
