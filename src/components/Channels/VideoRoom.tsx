import { useState, useEffect, useRef } from 'react';
import {
  Video, VideoOff, Mic, MicOff, Monitor, MonitorOff, PhoneOff, Users,
  Settings, MessageCircle, X, Copy, CheckCircle, Maximize2, Minimize2, Send
} from 'lucide-react';
import { db } from '../../lib/db';
import { useAuth } from '../../contexts/AuthContext';

interface Participant {
  id: string;
  peerId: string;
  name: string;
  isHost: boolean;
  audioEnabled: boolean;
  videoEnabled: boolean;
  screenSharing: boolean;
  stream?: MediaStream;
}

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
}

interface VideoRoomProps {
  roomId: string;
  onLeave: () => void;
}

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
  ]
};

export default function VideoRoom({ roomId, onLeave }: VideoRoomProps) {
  const { user } = useAuth();
  const [room, setRoom] = useState<any>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [myPeerId, setMyPeerId] = useState<string>('');
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnections = useRef<Map<string, RTCPeerConnection>>(new Map());
  const roomContainerRef = useRef<HTMLDivElement>(null);
  const initializingRef = useRef(false);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!initializingRef.current) {
      initializingRef.current = true;
      initializeRoom();
    }
    return () => {
      cleanup();
      initializingRef.current = false;
    };
  }, [roomId]);

  // ... (rest of useEffects)

  const initializeRoom = async () => {
    if (!user) return;
    const peerId = `peer_${Math.random().toString(36).substr(2, 9)}`;
    setMyPeerId(peerId);

    // Try to find existing room first
    const { data: roomData } = await db
      .from('video_rooms')
      .select('*')
      .eq('room_id', roomId)
      .single();

    if (roomData) {
      setRoom(roomData);
      await setupLocalMedia();
      await joinRoom(peerId, roomData);
      setupSignalingChannel(peerId);
    } else {
      // Create new room
      const { data: newRoom, error } = await db
        .from('video_rooms')
        .insert({
          room_id: roomId,
          host_user_id: user.id,
          status: 'active',
          started_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (newRoom) {
        setRoom(newRoom);
        await setupLocalMedia();
        await joinRoom(peerId, newRoom);
        setupSignalingChannel(peerId);
      } else if (error) {
        console.error('Error creating room:', error);
        // If error is likely "Unique constraint", try fetching again
        const { data: retryRoom } = await db
            .from('video_rooms')
            .select('*')
            .eq('room_id', roomId)
            .single();
        if (retryRoom) {
            setRoom(retryRoom);
            await setupLocalMedia();
            await joinRoom(peerId, retryRoom);
            setupSignalingChannel(peerId);
        }
      }
    }
  };

  const setupLocalMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: { echoCancellation: true, noiseSuppression: true }
      });
      setLocalStream(stream);
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  };

  const joinRoom = async (peerId: string, roomData: any) => {
    if (!user) return;

    await db.from('video_room_participants').insert({
      room_uuid: roomData.id,
      user_id: user.id,
      participant_name: user.email?.split('@')[0] || 'Guest',
      peer_id: peerId,
      is_host: roomData.host_user_id === user.id,
      audio_enabled: true,
      video_enabled: true
    });

    loadParticipants(roomData.id);
  };

  const loadParticipants = async (roomUuid: string) => {
    const { data } = await db
      .from('video_room_participants')
      .select('*')
      .eq('room_uuid', roomUuid)
      .is('left_at', null);

    if (data) {
      const participantsList: Participant[] = data.map((p: any) => ({
        id: p.id,
        peerId: p.peer_id,
        name: p.participant_name,
        isHost: p.is_host,
        audioEnabled: p.audio_enabled,
        videoEnabled: p.video_enabled,
        screenSharing: p.screen_sharing
      }));
      setParticipants(participantsList);

      participantsList.forEach(p => {
        if (p.peerId !== myPeerId && !peerConnections.current.has(p.peerId)) {
          createPeerConnection(p.peerId, true);
        }
      });
    }
  };

  const setupSignalingChannel = (peerId: string) => {
    const channel = db
      .channel(`room_${roomId}`)
      .on('postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'video_room_signals',
          filter: `to_peer_id=eq.${peerId}`
        },
        async (payload: any) => {
          await handleSignal(payload.new);
        }
      )
      .on('postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'video_room_participants'
        },
        () => {
          if (room) loadParticipants(room.id);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  };

  const createPeerConnection = async (remotePeerId: string, createOffer: boolean) => {
    const pc = new RTCPeerConnection(ICE_SERVERS);
    peerConnections.current.set(remotePeerId, pc);

    if (localStream) {
      localStream.getTracks().forEach(track => {
        pc.addTrack(track, localStream);
      });
    }

    pc.ontrack = (event) => {
      setParticipants(prev =>
        prev.map(p =>
          p.peerId === remotePeerId
            ? { ...p, stream: event.streams[0] }
            : p
        )
      );
    };

    pc.onicecandidate = async (event) => {
      if (event.candidate) {
        await sendSignal(remotePeerId, 'ice-candidate', {
          candidate: event.candidate.toJSON()
        });
      }
    };

    if (createOffer) {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      await sendSignal(remotePeerId, 'offer', {
        sdp: pc.localDescription?.toJSON()
      });
    }

    return pc;
  };

  const sendSignal = async (toPeerId: string, signalType: string, signalData: any) => {
    if (!room) return;

    await db.from('video_room_signals').insert({
      room_uuid: room.id,
      from_peer_id: myPeerId,
      to_peer_id: toPeerId,
      signal_type: signalType,
      signal_data: typeof signalData === 'string' ? signalData : JSON.stringify(signalData)
    });
  };

  const handleSignal = async (signal: any) => {
    const from_peer_id = signal.from_peer_id;
    const signal_type = signal.signal_type;
    const signal_data = typeof signal.signal_data === 'string' 
      ? JSON.parse(signal.signal_data) 
      : signal.signal_data;
    
    let pc = peerConnections.current.get(from_peer_id);

    if (!pc) {
      pc = await createPeerConnection(from_peer_id, false);
    }

    if (signal_type === 'offer') {
      await pc.setRemoteDescription(new RTCSessionDescription(signal_data.sdp));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      await sendSignal(from_peer_id, 'answer', {
        sdp: pc.localDescription?.toJSON()
      });
    } else if (signal_type === 'answer') {
      await pc.setRemoteDescription(new RTCSessionDescription(signal_data.sdp));
    } else if (signal_type === 'ice-candidate') {
      await pc.addIceCandidate(new RTCIceCandidate(signal_data.candidate));
    } else if (signal_type === 'chat') {
      setMessages(prev => [...prev, signal_data]);
    }
  };

  const sendChatMessage = async () => {
    console.log('Attempting to send chat message:', { inputMessage, user: !!user, room: !!room });
    if (!inputMessage.trim() || !user || !room) {
      console.warn('Cannot send message: Missing requirements', { 
        hasInput: !!inputMessage.trim(), 
        hasUser: !!user, 
        hasRoom: !!room 
      });
      return;
    }

    const newMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      senderId: user.id,
      senderName: user.email?.split('@')[0] || 'Me',
      text: inputMessage.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');

    // Broadcast message to all participants
    // iterate over all peers and send signal
    participants.forEach(p => {
      if (p.peerId !== myPeerId) {
        sendSignal(p.peerId, 'chat', newMessage);
      }
    });

    // Also store in DB for persistence if needed (optional for now, we prioritize real-time)
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleScreenShare = async () => {
    if (screenSharing) {
      await stopScreenShare();
    } else {
      await startScreenShare();
    }
  };

  const startScreenShare = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true
      });

      const screenTrack = screenStream.getVideoTracks()[0];

      peerConnections.current.forEach(pc => {
        const sender = pc.getSenders().find(s => s.track?.kind === 'video');
        if (sender) {
          sender.replaceTrack(screenTrack);
        }
      });

      screenTrack.onended = () => {
        stopScreenShare();
      };

      setScreenSharing(true);
    } catch (error) {
      console.error('Error sharing screen:', error);
    }
  };

  const stopScreenShare = async () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];

      peerConnections.current.forEach(pc => {
        const sender = pc.getSenders().find(s => s.track?.kind === 'video');
        if (sender && videoTrack) {
          sender.replaceTrack(videoTrack);
        }
      });
    }

    setScreenSharing(false);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      roomContainerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const copyRoomLink = () => {
    const link = `${window.location.origin}/video-room/${roomId}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleLeaveRoom = async () => {
    await cleanup();
    onLeave();
  };

  const cleanup = async () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }

    peerConnections.current.forEach(pc => pc.close());
    peerConnections.current.clear();

    if (room && myPeerId) {
      await db
        .from('video_room_participants')
        .update({ left_at: new Date().toISOString() })
        .eq('room_uuid', room.id)
        .eq('peer_id', myPeerId);
    }
  };

  return (
    <div ref={roomContainerRef} className="fixed inset-0 bg-[#012419] flex flex-col z-50">
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">{room?.room_name || 'Video Conference'}</h2>
          <p className="text-slate-400 text-sm">Room: {roomId}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={copyRoomLink}
            className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            {copiedLink ? (
              <><CheckCircle className="w-4 h-4" /> Copied!</>
            ) : (
              <><Copy className="w-4 h-4" /> Copy Link</>
            )}
          </button>
          <button
            onClick={() => setShowChat(!showChat)}
            className="bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-lg transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
          </button>
          <button
            onClick={toggleFullscreen}
            className="bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-lg transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 p-4 grid gap-4" style={{
          gridTemplateColumns: participants.length <= 1 ? '1fr' : participants.length <= 4 ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)'
        }}>
          <div className="relative bg-slate-900 rounded-xl overflow-hidden">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-lg">
              <p className="text-white text-sm font-medium">You {room?.host_user_id === user?.id && '(Host)'}</p>
            </div>
            {!videoEnabled && (
              <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
                <div className="bg-slate-700 w-20 h-20 rounded-full flex items-center justify-center">
                  <Video className="w-10 h-10 text-slate-400" />
                </div>
              </div>
            )}
          </div>

          {participants
            .filter(p => p.peerId !== myPeerId)
            .map(participant => (
              <ParticipantVideo key={participant.id} participant={participant} />
            ))}
        </div>

        {showChat && (
          <div className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-white font-semibold">Chat</h3>
              <button onClick={() => setShowChat(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-20" />
                  <p className="text-sm">No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className={`flex flex-col ${msg.senderId === user?.id ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[85%] rounded-lg p-3 ${
                      msg.senderId === user?.id 
                        ? 'bg-[#39FF14] text-white rounded-br-none' 
                        : 'bg-slate-800 text-slate-200 rounded-bl-none'
                    }`}>
                      <p className="text-xs font-semibold mb-1 opacity-75">{msg.senderName}</p>
                      <p className="text-sm">{msg.text}</p>
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-slate-800">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  sendChatMessage();
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#39FF14]"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className="bg-[#39FF14] hover:bg-[#32e012] disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      <div className="bg-slate-900 border-t border-slate-800 px-6 py-4">
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={toggleAudio}
            className={`p-4 rounded-full transition-colors ${
              audioEnabled ? 'bg-slate-700 hover:bg-slate-600' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {audioEnabled ? <Mic className="w-6 h-6 text-white" /> : <MicOff className="w-6 h-6 text-white" />}
          </button>

          <button
            onClick={toggleVideo}
            className={`p-4 rounded-full transition-colors ${
              videoEnabled ? 'bg-slate-700 hover:bg-slate-600' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {videoEnabled ? <Video className="w-6 h-6 text-white" /> : <VideoOff className="w-6 h-6 text-white" />}
          </button>

          <button
            onClick={toggleScreenShare}
            className={`p-4 rounded-full transition-colors ${
              screenSharing ? 'bg-[#39FF14] hover:bg-[#32e012]' : 'bg-slate-700 hover:bg-slate-600'
            }`}
          >
            {screenSharing ? <MonitorOff className="w-6 h-6 text-white" /> : <Monitor className="w-6 h-6 text-white" />}
          </button>

          <button
            onClick={handleLeaveRoom}
            className="p-4 rounded-full bg-red-600 hover:bg-red-700 transition-colors"
          >
            <PhoneOff className="w-6 h-6 text-white" />
          </button>

          <div className="ml-auto flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-lg">
            <Users className="w-5 h-5 text-slate-400" />
            <span className="text-white font-medium">{participants.length + 1}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ParticipantVideoProps {
  participant: Participant;
}

function ParticipantVideo({ participant }: ParticipantVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (participant.stream && videoRef.current) {
      videoRef.current.srcObject = participant.stream;
    }
  }, [participant.stream]);

  return (
    <div className="relative bg-slate-900 rounded-xl overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-lg">
        <p className="text-white text-sm font-medium">
          {participant.name} {participant.isHost && '(Host)'}
        </p>
      </div>
      {!participant.videoEnabled && (
        <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
          <div className="bg-slate-700 w-20 h-20 rounded-full flex items-center justify-center">
            <Video className="w-10 h-10 text-slate-400" />
          </div>
        </div>
      )}
      {!participant.audioEnabled && (
        <div className="absolute top-4 right-4 bg-red-600 p-2 rounded-lg">
          <MicOff className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  );
}
