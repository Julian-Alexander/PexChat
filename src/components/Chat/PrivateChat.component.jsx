import React from 'react';
import ChatMessages from './ChatMessages.component';
import ChatForm from './ChatForm.component';
import { Container } from '@material-ui/core';
import { connect } from 'react-redux';
import firebase from '../../firebase';

import './Chat.styles.scss';

class PrivateChat extends React.Component {
  state = {
    privateChat: true,
    privateMessagesRef: firebase.database().ref('privateMessages'),
    messages: [],
    updater: false,
    messagesLoading: true,
    channel: this.props.privateChannel,
    user: this.props.currentUser,
    numUniqueUsers: ''
  };

  componentDidMount() {
    const { channel, user } = this.state;
    if (channel && user) {
      this.addListeners(channel.id);
    } else {
    }
  }

  messageUpdate = () => {
    const { channel } = this.state;

    this.addListeners(channel.id);
  };

  addListeners = channelId => {
    this.addMessageListener(channelId);
  };

  addMessageListener = channelId => {
    let loadedMessages = [];
    this.state.privateMessagesRef.child(channelId).on('child_added', snap => {
      loadedMessages.push(snap.val());
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
        privateChat={this.state.privateChat}
        messageUpdate={this.messageUpdate}
        key={message.timestamp}
        currentChannel={this.state.channel}
        privateChannel={this.props.privateChannel}
        privateMessagesRef={this.state.privateMessagesRef}
        message={message}
        user={this.state.user}
      />
    ));

  displayChannelName = channel => (channel ? `${channel.title}` : '');

  render() {
    const {
      privateMessagesRef,
      channel,
      messages,
      numUniqueUsers,
      privateChat
    } = this.state;

    return (
      <React.Fragment>
        <div className='channel-title'>{this.displayChannelName(channel)}</div>
        <div className='channel-users'>{numUniqueUsers}</div>
        <Container>{this.displayMessages(messages)}</Container>
        <ChatForm
          privateChannel={this.props.privateChannel}
          privateChat={privateChat}
          currentUser={this.props.currentUser}
          privateMessagesRef={privateMessagesRef}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  privateChannel: state.privateChannel.isPrivateChannel
});

export default connect(mapStateToProps)(PrivateChat);
