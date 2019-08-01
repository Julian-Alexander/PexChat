import React from 'react';
import ChatMessages from './ChatMessages.component';
import ChatForm from './ChatForm.component';
import { Container } from '@material-ui/core';
import firebase from '../../firebase';

import './Chat.styles.scss';

class Chat extends React.Component {
  state = {
    messagesRef: firebase.database().ref('messages'),
    messages: [],
    messagesLoading: true,
    channel: this.props.currentChannel,
    user: this.props.currentUser
  };

  componentDidMount() {
    const { channel, user } = this.state;

    if (channel && user) {
      this.addListeners(channel.id);
    }
  }

  addListeners = channelId => {
    this.addMessageListener(channelId);
  };

  addMessageListener = channelId => {
    let loadedMessages = [];
    this.state.messagesRef.child(channelId).on('child_added', snap => {
      loadedMessages.push(snap.val());
      console.log('messages', loadedMessages);
      this.setState({
        messages: loadedMessages,
        messagesLoading: false
      });
    });
  };

  displayMessages = messages =>
    messages.length > 0 &&
    messages.map(message => (
      <ChatMessages
        key={messages.timetamp}
        message={message}
        user={this.state.user}
      />
    ));

  render() {
    const { messagesRef, channel, messages, user } = this.state;
    console.log('Currentchannel', channel);
    console.log('CurrentUser', user);
    return (
      <React.Fragment>
        <Container>{this.displayMessages(messages)}</Container>
        <ChatForm
          messagesRef={messagesRef}
          currentChannel={channel}
          currentUser={user}
        />
      </React.Fragment>
    );
  }
}

export default Chat;
