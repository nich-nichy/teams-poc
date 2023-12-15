const express = require('express');
const axios = require('axios');
const qs = require('qs');
const crypto = require('crypto');
const msal = require("@azure/msal-node");
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3039;

app.use(express.json());
app.use(cors());

let accessToken = "eyJ0eXAiOiJKV1QiLCJub25jZSI6Ijk2bk83SEpwT3dnZktYeHYwbXhvcDlIdW4wY09mYUtJMWh6WXVXQVlFTlEiLCJhbGciOiJSUzI1NiIsIng1dCI6IlQxU3QtZExUdnlXUmd4Ql82NzZ1OGtyWFMtSSIsImtpZCI6IlQxU3QtZExUdnlXUmd4Ql82NzZ1OGtyWFMtSSJ9.eyJhdWQiOiJodHRwczovL2dyYXBoLm1pY3Jvc29mdC5jb20iLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC83ZjQwNTIxYS0xOTk3LTQ1ZTYtYjE5Ni1jMDE4YzBhNDU0MWIvIiwiaWF0IjoxNzAxODU5NjQzLCJuYmYiOjE3MDE4NTk2NDMsImV4cCI6MTcwMTg2NDU5MCwiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IkFWUUFxLzhWQUFBQUE1T3ZDTElvTWRFNnk3bEdaOHo4bVlYNEJDSWNTTWJZdTl1ZWtoaG90SEpLMFBZbkZhcVpDc2t4d3FjRVhXRGxKT0RQdjJVN2xYcmNTMFhJRTZBcU9peC9yVkdXL1B6aFFLazg2N1J6YXhzPSIsImFtciI6WyJwd2QiLCJtZmEiXSwiYXBwX2Rpc3BsYXluYW1lIjoiQXJvb3BhIEFwcHMgLSBTcHJlYWRzaGVldHMiLCJhcHBpZCI6ImE2NzUwMzM5LWRmNGYtNDI5Zi04ODRiLTcyYTVjMjMyMTViNiIsImFwcGlkYWNyIjoiMSIsImZhbWlseV9uYW1lIjoiTW9oYW1lZCBSYXNoZWVkIiwiZ2l2ZW5fbmFtZSI6Ik1vaGFtZWQgTmlzaGF0aCIsImlkdHlwIjoidXNlciIsImlwYWRkciI6IjEwNi41MS4zLjIxNyIsIm5hbWUiOiJNb2hhbWVkIE5pc2hhdGggTW9oYW1lZCBSYXNoZWVkIiwib2lkIjoiNTY3N2U4NjEtMTk5YS00OWNkLWJmZTAtNWM3MWVmOGEzMGEyIiwib25wcmVtX3NpZCI6IlMtMS01LTIxLTM5Mjg0NDkxMzAtMjY4NjM4ODMxMC0xMDM5MDA3OTUtMTI3MiIsInBsYXRmIjoiMyIsInB1aWQiOiIxMDAzMjAwMjc4ODlFRTc0IiwicmgiOiIwLkFYSUFHbEpBZjVjWjVrV3hsc0FZd0tSVUd3TUFBQUFBQUFBQXdBQUFBQUFBQUFEREFNMC4iLCJzY3AiOiJDaGFubmVsLlJlYWRCYXNpYy5BbGwgQ2hhbm5lbE1lc3NhZ2UuRWRpdCBDaGFubmVsTWVzc2FnZS5TZW5kIENoYXQuQ3JlYXRlIE5vdGlmaWNhdGlvbnMuUmVhZFdyaXRlLkNyZWF0ZWRCeUFwcCBvcGVuaWQgcHJvZmlsZSBUZWFtLkNyZWF0ZSBUZWFtLlJlYWRCYXNpYy5BbGwgVGVhbXNBY3Rpdml0eS5TZW5kIFVzZXIuUmVhZCBVc2VyLlJlYWRCYXNpYy5BbGwgZW1haWwiLCJzaWduaW5fc3RhdGUiOlsia21zaSJdLCJzdWIiOiJySXNkMmN0VUw5akc4c0RzU1RjQ1ZEMXVZVHJUMXJGSGlNMmhlYjBhb1lBIiwidGVuYW50X3JlZ2lvbl9zY29wZSI6IkFTIiwidGlkIjoiN2Y0MDUyMWEtMTk5Ny00NWU2LWIxOTYtYzAxOGMwYTQ1NDFiIiwidW5pcXVlX25hbWUiOiJNb2hhbWVkbmlzaGF0aC5Nb2hhbWVkcmFzaGVlZEBhcm9vcGF0ZWNoLmNvbSIsInVwbiI6Ik1vaGFtZWRuaXNoYXRoLk1vaGFtZWRyYXNoZWVkQGFyb29wYXRlY2guY29tIiwidXRpIjoiLUhQUnJFcHhyRUt5SWR0cThuNW1BQSIsInZlciI6IjEuMCIsIndpZHMiOlsiYjc5ZmJmNGQtM2VmOS00Njg5LTgxNDMtNzZiMTk0ZTg1NTA5Il0sInhtc19zdCI6eyJzdWIiOiJndl9PSWZrVHViRmc5aUc4QmpNVXVlQVhfcEZoWWFWWnNsZGNxaGxZOWFvIn0sInhtc190Y2R0IjoxMzY5OTMzNTIzfQ.iU-ZlxlUiApaRjGiEsQfofWjVxBXpcfW5rHfhUEhW2USGZq4Nw_9F1OuqhHQDVNxyuiBfoM-92WCDcPGEBJswAkun3UNR_9sIDhmjHHnJmZXnsvSWAqjm8bNr-mwyG3jxbx8IeoWzUep4jHSofsqiY3wzNukXgt3dLqda3bFa39TMWdv7DhLbNX7X9JcyHZr1mBFpXL_v-p4WzUsCZgweKsDYUVcmG67qV5BdXpDqj73Rm_4xZErSHOwV2RzLFxw0221QlTzGtK6n0i4bxeKc0O3GPlvxMaU7YODO4JP-fpuFa2SNg8HQh7vSnAT2m9oT_FnbbYpfnrsgYal27XCCA";

app.post('/getUsers', async (req, res) => {
  try {
    const usersApiUrl = 'https://graph.microsoft.com/v1.0/users';
    const response = await axios.get(usersApiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const users = response.data.value;
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.post('/getTeams', async (req, res) => {
  try {
    const graphApiUrl = 'https://graph.microsoft.com/v1.0';
    const teamsUrl = `${graphApiUrl}/me/joinedTeams?$select=id,displayName`;
    const token = req.body.token;
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const teamsResponse = await axios.get(teamsUrl, { headers });
    let teamsWithChannels = [];
    for (const team of teamsResponse.data.value) {
      const teamData = { id: team.id, displayName: team.displayName, channels: [] };
      const channelsUrl = `${graphApiUrl}/teams/${team.id}/channels?$select=id,displayName`;
      const teamChannelsResponse = await axios.get(channelsUrl, { headers });
      for (const channel of teamChannelsResponse.data.value) {
        teamData.channels.push({ id: channel.id, displayName: channel.displayName });
      }
      teamsWithChannels.push(teamData);
    }
    res.send({ teamsWithChannels });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

app.post('/sendMessage', async (req, res) => {
  try {
    const { teamId, channelId, messageContent, mentions } = req.body;
    let message;
    if (mentions) {
      message = {
        body: {
          contentType: 'html',
          content: `${messageContent} ${mentions.map((mention) => `<at id="${mention.id}">${mention.mentionText}</at>`).join(' ')}`,
        },
        mentions,
      };
    } else {
      message = {
        body: {
          contentType: "html",
          content: messageContent,
        },
      };
    }
    const endpointUrl = `https://graph.microsoft.com/v1.0/teams/${teamId.id}/channels/${channelId}/messages`;

    const response = await axios.post(endpointUrl, message, {
      headers: {
        'Authorization': `Bearer ${accessToken}`, 
        'Content-Type': 'application/json',
      },
    });
    console.log('Message sent successfully:', response.data);
    res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending the message:', error);
    res.status(500).json({ message: 'Error sending the message' });
  }
});

app.post('/mentionMessage', async (req, res) => {
  try {
    const { teamId, channelId, messageContent } = req.body;
    const mentionRegex = /\[([^\]]+)\]\(([^)]+)\)\s+(.+)/;
    const match = messageContent.match(mentionRegex);
    if (!match) {
      console.error('Invalid message format');
      res.status(400).json({ message: 'Invalid message format' });
      return;
    }
    const nameValue = match[1];
    const idValue = match[2];
    const additionalMessage = match[3];
    console.log("Name:", nameValue);
    console.log("ID:", idValue);
    console.log("Additional Message:", additionalMessage);
    const message = {
      body: {
        contentType: 'html',
        content: `<at id=\"0\">${nameValue}</at> ${additionalMessage}`
      },
      mentions: [
        {
          id: 0,
          mentionText: nameValue,
          mentioned: {
            user: {
              displayName: nameValue,
              id: idValue,
              userIdentityType: 'aadUser'
            }
          }
        }
      ]
    };
    const endpointUrl = `https://graph.microsoft.com/v1.0/teams/${teamId.id}/channels/${channelId}/messages`;
    const response = await axios.post(endpointUrl, JSON.stringify(message), {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    console.log('Message sent successfully:', response.data);
    res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending the message:', error);
    res.status(500).json({ message: 'Error sending the message' });
  }
});

app.post('/adaptiveMessage', async (req, res) => {
  try {
    const adaptiveCardPayload = {
      "type": "message",
      "attachments": [
        {
          "contentType": "application/vnd.microsoft.card.adaptive",
          "content": {
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "type": "AdaptiveCard",
            "version": "1.0",
            "body": [
              {
                "type": "TextBlock",
                "size": "Medium",
                "weight": "Bolder",
                "text": "Sample Adaptive Card with User Mention"
              },
              {
                "type": "TextBlock",
                "text": "Hi <at>Alan Stephen Neil Durai Singh</at>"
              }
            ],
            "msteams": {
              "entities": [
                {
                  "type": "mention",
                  "text": "<at>Alan Stephen Neil Durai Singh</at>",
                  "mentioned": {
                    "id": "53a35e6b-5aed-4018-836c-758f8a310db8",
                    "name": "Alan Stephen Neil Durai Singh"
                  }
                }
              ]
            }
          }
        }
      ]
    };
    const teamId = '0716a798-df6e-4821-86ad-7114ebe3c132';
    const channelId = '19:u8h2REw1SdtXN86YhGqmqy3Hs9hLOAuJ-jLJ97ykQIA1@thread.tacv2';
    const graphApiEndpoint = `https://graph.microsoft.com/v1.0/teams/${teamId}/channels/${channelId}/messages`;
    const response = await axios.post(graphApiEndpoint, adaptiveCardPayload, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    console.log('Response from Microsoft Graph API:', response.data);
    res.status(200).json({ message: 'Adaptive Card sent successfully' });
  } catch (err) {
    console.error('Error sending the Adaptive Card:', err.response ? err.response.data : err.message);
    res.status(500).json({ message: 'Error sending the Adaptive Card' });
  }
});

app.post('/notifyUser', async (req, res) => {
  try {
    const teamId = req.body.teamId.id; 
    const userId = req.body.userId;
    const notificationPayload = {
      topic: {
        source: 'text',
        value: 'Deployment Approvals Channel',
        webUrl: 'https://teams.microsoft.com/l/message/19:448cfd2ac2a7490a9084a9ed14cttr78c@thread.skype/1605223780000?tenantId=c8b1bf45-3834-4ecf-971a-b4c755ee677d&groupId=d4c2a937-f097-435a-bc91-5c1683ca7245&parentMessageId=1605223771864&teamName=Approvals&channelName=Azure%20DevOps&createdTime=1605223780000',
      },
      activityType: 'approvalRequired',
      previewText: {
        content: 'New deployment requires your approval',
      },
      recipient: {
        '@odata.type': 'microsoft.graph.aadUserNotificationRecipient',
        userId: userId,
      },
      templateParameters: [
        {
          name: 'deploymentId',
          value: '6788662',
        },
      ],
    };
    const endpointUrl = `https://graph.microsoft.com/v1.0/teams/${teamId}/sendActivityNotification`;
    const response = await axios.post(endpointUrl, notificationPayload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error sending notification:', error.message);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

app.post('/sendActivityNotificationTeams', async (req, res) => {
  try {
    const teamId = req.body.teamId.id;
    const notificationPayload = {
      topic: {
        source: 'text',
        value: 'Weekly Virtual Social',
        webUrl: 'https://teams.microsoft.com/l/message/19:u8h2REw1SdtXN86YhGqmqy3Hs9hLOAuJ-jLJ97ykQIA1@thread.tacv2/1699358358020?tenantId=7f40521a-1997-45e6-b196-c018c0a4541b&groupId=0716a798-df6e-4821-86ad-7114ebe3c132&parentMessageId=1699358358020&teamName=Microsoft%20Teams%20API%20-%20Test&channelName=General&createdTime=1699358358020', 
      },
      previewText: {
        content: 'It will be fun!',
      },
      activityType: 'eventCreated',
      recipient: {
        '@odata.type': 'microsoft.graph.teamMembersNotificationRecipient',
        teamId: teamId,
      },
    };
    const endpointUrl = `https://graph.microsoft.com/v1.0/teams/${teamId}/sendActivityNotification`;
    const response = await axios.post(endpointUrl, notificationPayload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error sending notification:', error.message);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});


app.post('/sendActivityNotificationChannel', async (req, res) => {
  try {
    const notificationPayload = {
      topic: {
        source: 'text',
        value: 'Weekly Virtual Social',
      },
      previewText: {
        content: 'It will be fun!',
      },
      activityType: 'eventCreated',
      recipient: {
        '@odata.type': 'microsoft.graph.channelMembersNotificationRecipient',
        teamId: req.body.teamId.id,
        channelId: req.body.channelId,
      },
    };
    const endpointUrl = `https://graph.microsoft.com/v1.0/teams/${notificationPayload.recipient.teamId}/channels/${notificationPayload.recipient.channelId}/sendActivityNotification`;
    const response = await axios.post(endpointUrl, notificationPayload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error sending notification:', error.message);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

app.post('/sendSimpleNotification', async (req, res) => {
  try {
    const teamId = "0716a798-df6e-4821-86ad-7114ebe3c132"; 
    const notificationPayload = {
      topic: {
        source: 'Microsoft.Graph.Teams.Team',
        value: 'Simple Notification',
      },
      activityType: 'user',
      recipient: {
        '@odata.type': 'microsoft.graph.teamMembersNotificationRecipient',
        teamId: teamId,
      },
    };
    const endpointUrl = `https://graph.microsoft.com/v1.0/teams/${teamId}/sendActivityNotification`;
    const response = await axios.post(endpointUrl, notificationPayload, {
      headers: {
        Authorization: `Bearer ${accessToken}`, 
        'Content-Type': 'application/json',
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error sending notification:', error.message);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

app.post('/mentionAndMessage', async (req, res) => {
  try {
    const teamId = req.body.teamId.id;
    const userNotificationRecipient = {
      "@odata.type": "microsoft.graph.aadUserNotificationRecipient",
      "userId": req.body.userId.id,
    };
    const notificationPayload = {
      topic: {
        source: "entityUrl",
        value: `https://graph.microsoft.com/v1.0/teams/${teamId}`,
      },
      activityType: "userMention",
      previewText: {
        content: `You were mentioned by ${req.body.userId.displayName}`,
      },
      recipient: userNotificationRecipient,
    };
    const sendNotificationEndpoint = `https://graph.microsoft.com/v1.0/teams/${teamId}/sendActivityNotification`;
    const response = await axios.post(sendNotificationEndpoint, notificationPayload, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    console.log('Notification sent successfully:', response.data);
    res.status(200).json({ message: 'Notification sent successfully' });
  } catch (error) {
    console.error('Error sending the notification:', error);
    res.status(500).json({ message: 'Error sending the notification' });
  }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
