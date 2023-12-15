import React, { useState } from 'react';
import { MentionsInput, Mention } from 'react-mentions';
import axios from 'axios';

const MentionUser = ({ users, selectedTeam, selectedChannel, accessToken }) => {
  const [inputValue, setInputValue] = useState('');
  const [mentions, setMentions] = useState([]);
  const [value, setValue] = useState('');

  const mappedUsers = users.map((user) => ({
    id: user.id,
    display: user.displayName || user.mail || user.userPrincipalName || 'Unknown',
  }));

  const handleInputChange = (ev, value, display) => {
    setInputValue(value);
  };

  const handleAddMention = (mention) => {
    setMentions([...mentions, mention]);
  }; 

  const mentionMessage = async () => {
    try {
      const requestData = {
        teamId: selectedTeam,
        channelId: selectedChannel,
        messageContent: value,
        mentions,
      };
      const response = await axios.post('http://localhost:3039/mentionMessage', requestData);
      console.log(response.data);
    } catch (error) {
      console.error('Error sending the message:', error);
    }
  };

  return (
    <div>
      <MentionsInput value={value} onChange={(e) => setValue(e.target.value)}>
        <Mention data={mappedUsers} onAdd={handleAddMention} />
      </MentionsInput>
      <button onClick={mentionMessage}>Send Message</button>
    </div>
  );
};

export default MentionUser;
