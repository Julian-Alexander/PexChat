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
    updater: false,
    messagesLoading: true,
    channel: this.props.currentChannel,
    user: this.props.currentUser,
    numUniqueUsers: '',
    listeners: []
    // searchTerm: '',
    // searchLoading: false
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
    this.state.messagesRef.child(channelId).on('child_added', snap => {
      loadedMessages.push(snap.val());
      this.setState({
        messages: loadedMessages,
        messagesLoading: false
      });
      this.countUniqueUsers(loadedMessages);
    });
    this.addToListeners(channelId, this.state.messagesRef, "child_added");
  };

// handleSearchChange = event => {
//   this.setState({
//     searchTerm: event.target.value,
//     searchLoading: true
//   });
// }

  //     handleSearchMessages = () => {
  //     const channelMessages = [...this.state.messages];
  //     const regex = new RegExp(this.state.searchTerm, "gi");
  //     const searchResults = channelMessages.reduce((acc, message) => {
  //       if (
  //         (message.content && message.content.match(regex)) ||
  //         message.user.name.match(regex)
  //       ) {
  //         acc.push(message);
  //       }
  //       return acc;
  //     }, []);
  //     this.setState({ searchResults });
  //     setTimeout(() => this.setState({ searchLoading: false }), 1000);
  //   };

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
        messageUpdate={this.messageUpdate}
        key={message.timestamp}
        currentChannel={this.state.channel}
        message={message}
        user={this.state.user}
      />
    ));

  displayChannelName = channel => (channel ? `${channel.title}` : '');

  render() {
    const { messagesRef, channel, messages, user, numUniqueUsers } = this.state;

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
