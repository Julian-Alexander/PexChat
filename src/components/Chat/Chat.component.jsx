import React from 'react';
import ChatMessages from './ChatMessages.component';
import ChatForm from './ChatForm.component';
import { Container } from '@material-ui/core';
import firebase from '../../firebase';

import './Chat.styles.scss';

class Chat extends React.Component {
  state = {
    messagesRef: firebase.database().ref('messages'),
    channel: this.props.currentChannel,
    user: this.props.currentUser
  };

  render() {
    const { messagesRef, channel, user } = this.state;
    console.log('Currentchannel', channel);
    console.log('CurrentUser', user);
    return (
      <React.Fragment>
        <Container>
          <ChatMessages />
        </Container>
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
