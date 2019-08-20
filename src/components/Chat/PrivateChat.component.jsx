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
    listeners: []
  };

  componentDidMount() {
    const { channel, user, listeners } = this.state;
    if (channel && user) {
      this.removeListeners(listeners)
      this.addListeners(channel.id);
    }
  }

  componentWillUnmount() {
    this.removeListeners(this.state.listeners);
  }

  removeListeners = listeners => {
    listeners.forEach(listener => {
      listener.ref.child(listener.id).off(listener.event);
    });
  };

  addToListeners = (id, ref, event) => {
    const index = this.state.listeners.findIndex(listener => {
      return (
        listener.id === id && listener.ref === ref && listener.event === event
      );
    });

    if (index === -1) {
      const newListener = { id, ref, event };
      this.setState({ listeners: this.state.listeners.concat(newListener) });
    }
  };

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
    });
    this.addToListeners(channelId, this.state.privateMessagesRef, "child_added");
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
      privateChat
    } = this.state;

    return (
      <React.Fragment>
        <div className='channel-title'>{this.displayChannelName(channel)}</div>
        <Container className="container-messages">{this.displayMessages(messages)}</Container>
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
