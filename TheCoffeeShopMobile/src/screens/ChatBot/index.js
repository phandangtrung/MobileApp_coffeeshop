import React, {useState, useEffect, useCallback} from 'react';
import Voice from '@react-native-community/voice';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  Button,
  TouchableOpacity,
} from 'react-native';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {GiftedChat, Composer} from 'react-native-gifted-chat';
import {Dialogflow_V2} from 'react-native-dialogflow';
import {Bubble} from 'react-native-gifted-chat';
import uuid from 'react-native-uuid';
import {dialogflowConfig} from '../../config/env';
function ChatBot() {
  const [speech, setSpeech] = useState('');
  const [messages, setMessages] = useState([]);
  const BOT_USER = {
    _id: 2,
    name: 'FAQ Bot',
    avatar:
      'https://st3.depositphotos.com/8950810/17657/v/600/depositphotos_176577870-stock-illustration-cute-smiling-funny-robot-chat.jpg',
  };
  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        textStyle={{
          right: {
            color: 'white',
          },
        }}
        wrapperStyle={{
          // left: {
          //   backgroundColor: 'white',
          // },
          right: {
            backgroundColor: 'orange',
          },
        }}
      />
    );
  };
  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechPartialResults = onSpeechPartialResults;

    return () => Voice.destroy().then(Voice.removeAllListeners);
  }, []);
  const onSpeechStart = () => {};

  const onSpeechEnd = () => {};

  const onSpeechError = () => {};

  const onSpeechResults = (e) => {
    setSpeech(e.value[0]);
  };

  const onSpeechPartialResults = (e) => {
    setSpeech(e.value[0]);
  };

  const startListening = () => {
    // You can set the locale to any language you want it to recognize, I am using Nigerian English.
    Voice.start('en-NG');
  };
  const renderComposer = (props) => {
    // Adds a Mic Button in the text box, you can style it as you want
    return (
      <View style={{flexDirection: 'row'}}>
        <Composer {...props} />
        {/* <Button title="voice" onPress={startListening} /> */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            height: '100%',
          }}>
          <TouchableOpacity onPress={startListening}>
            <FontAwesome5
              style={{
                color: 'white',
                fontSize: 20,
                color: 'grey',
                marginRight: 20,
                marginTop: 10,
              }}
              name={'microphone'}
              solid
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: `The Coffee Shop xin chào quý khách ạ.`,
        createdAt: new Date(),
        user: BOT_USER, // <= note this
      },
    ]);
    Dialogflow_V2.setConfiguration(
      dialogflowConfig.client_email,
      dialogflowConfig.private_key,
      Dialogflow_V2.LANG_ENGLISH_US,
      dialogflowConfig.project_id,
    );
  }, []);
  const sendBotResponse = (text) => {
    let msg = {
      _id: uuid.v4(),
      text,
      createdAt: new Date(),
      user: BOT_USER,
    };
    console.log('>>msg', msg);
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, [msg]),
    );
  };
  const handleGoogleResponse = (result) => {
    let text = result.queryResult.fulfillmentMessages[0].text.text[0];
    sendBotResponse(text);
  };
  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages),
    );
    // this.setState(previousState => ({
    //   messages: GiftedChat.append(previousState.messages, messages)
    // }));

    let message = messages[0].text;
    Dialogflow_V2.requestQuery(
      message,
      (result) => handleGoogleResponse(result),
      (error) => console.log(error),
    );
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <GiftedChat
        renderComposer={renderComposer}
        text={speech}
        messages={messages}
        onSend={(messages) => onSend(messages)}
        renderBubble={renderBubble}
        user={{
          _id: 1,
        }}
      />
    </View>
  );
}

export default ChatBot;
