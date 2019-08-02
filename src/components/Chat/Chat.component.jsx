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
    user: this.props.currentUser,
    numUniqueUsers: ''
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
      this.countUniqueUsers(loadedMessages);
    });
  };

  countUniqueUsers = messages => {
    const uniqueUsers = messages.reduce((acc, message) => {
      if (!acc.includes(message.user.name)) {
        acc.push(message.user.name);
      }
      return acc;
    }, []);
    const plural = uniqueUsers.length > 1 || uniqueUsers.length === 0;
    const numUniqueUsers = `${uniqueUsers.length} User${plural ? 's' : ''}`;
    this.setState({ numUniqueUsers });
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

  displayChannelName = channel => (channel ? `${channel.title}` : '');

  render() {
    const { messagesRef, channel, messages, user, numUniqueUsers } = this.state;
    console.log('Currentchannel', channel);
    console.log('CurrentUser', user);
    return (
      <React.Fragment>
        <div className='channel-title'>{this.displayChannelName(channel)}</div>
        <div className='channel-users'>{numUniqueUsers}</div>
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
