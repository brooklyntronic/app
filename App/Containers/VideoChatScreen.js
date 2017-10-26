'use strict';

import React, { Component } from 'react'
import {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  TextInput,
  ListView,
  Platform,
} from 'react-native'
import { connect } from 'react-redux'
import Utilities from '../Services/Utilities'
import io from 'socket.io-client'
import BackArrow from '../Components/BackArrow'
let socket

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
const configuration = {"iceServers": [{"url": "stun:stun.l.google.com:19302"}]};

const pcPeers = {};
let localStream;

function getLocalStream(isFront, callback) {

  let videoSourceId, container;

  // on android, you don't have to specify sourceId manually, just use facingMode
  // uncomment it if you want to specify
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
        minHeight: 360,
        minFrameRate: 30,
      },
      facingMode: (isFront ? "user" : "environment"),
      optional: (videoSourceId ? [{sourceId: videoSourceId}] : []),
    }
  }, function (stream) {
    callback(stream);
  }, logError);
}

function join(roomID) {
  container.socket.emit('join', roomID, function(socketIds){
    for (const i in socketIds) {
      const socketId = socketIds[i];
      createPC(socketId, true);
    }
  });
}

function createPC(socketId, isOffer) {
  container.pc = new RTCPeerConnection(configuration);
  pcPeers[socketId] = container.pc;

  container.pc.onicecandidate = function (event) {
    console.log('onicecandidate', event.candidate);
    if (event.candidate) {
      container.socket.emit('exchange', {'to': socketId, 'candidate': event.candidate });
    }
  };

  function createOffer() {
    container.pc.createOffer(function(desc) {
      container.pc.setLocalDescription(desc, function () {
        console.log('setLocalDescription', pc.localDescription);
        container.socket.emit('exchange', {'to': socketId, 'sdp': container.pc.localDescription });
      }, logError);
    }, logError);
  }

  container.pc.onnegotiationneeded = function () {
    console.log('onnegotiationneeded');
    if (isOffer) {
      createOffer();
    }
  }

  container.pc.oniceconnectionstatechange = function(event) {
    if (event.target.iceConnectionState === 'completed') {
      setTimeout(() => {
      }, 1000);
    }
    if (event.target.iceConnectionState === 'connected') {
      createDataChannel();
    }
  };
  container.pc.onsignalingstatechange = function(event) {
    console.log('onsignalingstatechange', event.target.signalingState);
  };

  container.pc.onaddstream = function (event) {
    console.log('onaddstream', event.stream);
    container.setState({info: 'One peer join!'});

    const remoteList = container.state.remoteList;
    remoteList[socketId] = event.stream.toURL();
    container.setState({ remoteList: remoteList });
  };
  container.pc.onremovestream = function (event) {
    console.log('onremovestream', event.stream);
  };

  container.pc.addStream(localStream);

  return container.pc;
}

function exchange(data) {
  const fromId = data.from;
  let pc;
  if (fromId in pcPeers) {
    pc = pcPeers[fromId];
  } else {
    pc = createPC(fromId, false);
  }

  if (data.sdp) {
    console.log('exchange sdp', data);
    pc.setRemoteDescription(new RTCSessionDescription(data.sdp), function () {
      if (pc.remoteDescription.type == "offer")
        pc.createAnswer(function(desc) {
          console.log('createAnswer', desc);
          pc.setLocalDescription(desc, function () {
            console.log('setLocalDescription', pc.localDescription);
            container.socket.emit('exchange', {'to': fromId, 'sdp': pc.localDescription });
          }, logError);
        }, logError);
    }, logError);
  } else {
    console.log('exchange candidate', data);
    pc.addIceCandidate(new RTCIceCandidate(data.candidate));
  }
}

function leave(socketId) {
  const pc = pcPeers[socketId];  
  delete pcPeers[socketId];
  getLocalStream(container.isFront, (stream)=>{
    pc.removeStream(stream)
  })
  pc.close();
  delete remoteList[socketId]
}



function logError(error) {
  console.log("logError", error);
}

function mapHash(hash, func) {
  const array = [];
  for (const key in hash) {
    const obj = hash[key];
    array.push(func(obj, key));
  }
  return array;
}
const VideoChatScreen = React.createClass({
  getInitialState: function() {
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => true});
    return {
      info: 'Initializing',
      status: 'init',
      roomID: '',
      isFront: true,
      selfViewSrc: null,
      remoteList: {},
      textRoomConnected: false,
      textRoomData: [],
      textRoomValue: '',
    };
  },
  componentDidMount: function() {
    this.socket = io.connect(Utilities.baseUrl, {transports: ['websocket']})
    this.socket.on('exchange', function(data){
      exchange(data);
    });
    this.socket.on('leave', function(socketId){
      leave(socketId);
      container.props.navigation.goBack(null)
    });

    this.socket.on('connect', function(data) {
      getLocalStream(true, function(stream) {
        localStream = stream;
        container.setState({});
        container.setState({selfViewSrc: stream.toURL(), status: 'ready', info: 'Please enter or create room ID'},
          ()=>{
            join(container.props.navigation.state.params.id)
          });
      });
    });
    container = this;
  },
  _press(event) {
    this.refs.roomID.blur();
    this.setState({status: 'connect', info: 'Connecting'});
    join(this.state.roomID);
  },
  _switchVideoType() {
    const isFront = !this.state.isFront;
    this.setState({isFront});
    getLocalStream(isFront, function(stream) {
      if (localStream) {
        for (const id in pcPeers) {
          const pc = pcPeers[id];
          pc && pc.removeStream(localStream);
        }
        localStream.release();
      }
      localStream = stream;
      container.setState({selfViewSrc: stream.toURL()});

      for (const id in pcPeers) {
        const pc = pcPeers[id];
        pc && pc.addStream(localStream);
      }
    });
  },

  _goBack () {
    socket.disconnect()
    this.props.navigation.goBack(null)
  },
  render() {
    return (
      <View style={styles.container}>
      <BackArrow onPress={() => this._goBack()}/>
      <View style={styles.mainContainer}>
      
      <View style={{flexDirection: 'row'}}>
      <Text>
      {this.state.isFront ? "Use front camera" : "Use back camera"}
      </Text>
      <TouchableHighlight
      style={{borderWidth: 1, borderColor: 'black'}}
      onPress={this._switchVideoType}>
      <Text>Switch camera</Text>
      </TouchableHighlight>
      </View>
    <RTCView streamURL={this.state.selfViewSrc} style={styles.selfView}/>
    {
      mapHash(this.state.remoteList, function(remote, index) {
        return <RTCView key={index} streamURL={remote} style={styles.remoteView}/>
      })
    }
    </View>
    </View>
    );
  }
});

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(VideoChatScreen)
