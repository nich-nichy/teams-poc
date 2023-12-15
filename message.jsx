import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Axios from 'axios';
import MentionUser from './mentioningUser';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog({ selectedTeam, selectedChannel, accessToken }) {
  const [messageContent, setMessageContent] = React.useState();
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [formattedText, setFormattedText] = React.useState("");
  const [message2, setMessage2] = React.useState("");
  const [users, setUsers] = React.useState([]); 
  const [showUserDropdown, setShowUserDropdown] = React.useState(false);
  const [user, setUser] = React.useState();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

    const sendMessage = async () => {
      const requestData = {
        token: accessToken,
        teamId: selectedTeam,
        channelId: selectedChannel,
        messageContent: message,
      };
      try {
        const response = await Axios.post("http://localhost:3039/sendMessage", requestData);
        console.log(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setMessage("");
        setFormattedText("");
      }
    };

    // console.log(users);

const notifyTeam = () => {
  console.log("Notify Teams");
  const requestData = {
    teamId: selectedTeam,
    channelId: selectedChannel,
  }
  Axios.post('http://localhost:3039/sendActivityNotificationTeams', requestData)
  .then((response) => {
    console.log(response.data);
    setUsers(response.data);
  })
  .catch((err) => {
    console.log(err);
  });
}

const notifyChannel = () => {
  console.log("Notify Channel");
  const requestData = {
    teamId: selectedTeam,
    channelId: selectedChannel,
  }
  Axios.post('http://localhost:3039/sendActivityNotificationChannel', requestData)
  .then((response) => {
    console.log(response.data);
    setUsers(response.data);
  })
  .catch((err) => {
    console.log(err);
  });
}

const notifyUser = () => {
  console.log("Notify User");
  const requestData = {
    teamId: selectedTeam,
    channelId: selectedChannel,
  }
  Axios.post('http://localhost:3039/notifyUser', requestData)
  .then((response) => {
    console.log(response.data);
    setUsers(response.data);
  })
  .catch((err) => {
    console.log(err);
  });
}

// const mentionAndSend = () => {
//   console.log("Mention a user");
//   const requestData = {
//     teamId: selectedTeam,
//     channelId: selectedChannel,
//     messageContent: message2,
//     userId: user
//   }
//   Axios.post('http://localhost:3039/mentionAndMessage', requestData)
//   .then((response) => {
//     console.log(response.data);
//     setUsers(response.data);
//   })
//   .catch((err) => {
//     console.log(err);
//   });
// }

  React.useEffect(() => {
    const requestData = {
      token: accessToken, 
    };
    Axios.post('http://localhost:3039/getUsers')
    .then((response) => {
      setUsers(response.data);
    })
    .catch((err) => {
      console.log(err);
    });
  }, []);

  const handleChange = (value) => {
    const teamsCardHtml = convertQuillToTeamsCard(value);
    console.log(teamsCardHtml, "quill text");
    setMessage(value);
    setFormattedText(teamsCardHtml);
  }; 

  const convertQuillToTeamsCard = (quillHtml) => {
    const teamsCardMarkdown = quillHtml
      .replace(/<p>(.*?)<\/p>/g, '$1')
      .replace(/<strong>(.*?)<\/strong>/g, (match, p1) => `**${p1}**`)
      .replace(/<em>(.*?)<\/em>/g, (match, p1) => `_${p1}_`)
      .replace(/<ul>(.*?)<\/ul>/g, (match, p1) => {
        const listItems = p1.split('</li>').filter(item => item.trim() !== '');
        const formattedList = listItems.map(item => `- ${item.replace('<li>', '').trim()}`).join('\r');
        return formattedList;
      })
      .replace(/<ol>(.*?)<\/ol>/g, (match, p1) => {
        const listItems = p1.split('</li>').filter(item => item.trim() !== '');
        let index = 1;
        const formattedList = listItems.map(item => `${index++}. ${item.replace('<li>', '').trim()}`).join('\r');
        return formattedList;
      })
      .replace(/<a href="(.*?)">(.*?)<\/a>/g, (match, url, title) => `[${title}](${url})`);
  
    return teamsCardMarkdown;
  };

  const adaptiveCardMessage = async () => {
    const requestData = {
      token: accessToken,
      teamId: selectedTeam,
      channelId: selectedChannel,
      messageContent: message,
    };
    try {
      const response = await Axios.post("http://localhost:3039/adaptiveMessage", requestData);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setMessage("");
      setFormattedText("");
    }
  }

  // const letsConvertQuillToTeams = () => {
  //   console.log(message, "from second function");
  //   return message;
  // }
  // let convertQuill = letsConvertQuillToTeams(message);
  // console.log({ messageConvert: convertQuill });

  // const quillHtml = '<p><strong>Hello</strong></p> <p><em>world</em></p> <ul><li>Item 1</li><li>Item 2</li></ul> <ol><li>Green</li><li>Orange</li></ol> <a href="https://example.com">Example Link</a>';
  // const teamsCardMarkdown = convertQuillToTeamsCard(quillHtml);
  // console.log(teamsCardMarkdown);
  
  const [matchingUsers, setMatchingUsers] = React.useState([]);

  const handleChange2 = (e) => {
    const inputText = e.target.value;
    setMessage2(inputText);
    if (inputText.includes('@')) {
      const matchingUsers = users.filter((user) =>
        user.displayName.toLowerCase().includes(inputText.toLowerCase().substring(1))
      );
      setMatchingUsers(matchingUsers);
      setShowUserDropdown(true);
    } else {
      setShowUserDropdown(false);
    }
  };


  // const handleUserSelect = (selectedUser) => {
  //   console.log(selectedUser, "selectedUser");
  //   const updatedMessage = `${message2.substring(0, message2.lastIndexOf('@') + 1)}${selectedUser.displayName} `;
  //   console.log(updatedMessage, "from updatedMessage");
  //   setUser(selectedUser);
  //   setMessage2(updatedMessage);
  //   setMatchingUsers([]);
  //   setShowUserDropdown(false);
  // };
  

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Message
      </Button>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Send some message
            </Typography>
          </Toolbar>
        </AppBar>
        <Paper sx={{ padding: 2 }}>
        <Typography variant="h6" gutterBottom>
          Message Example:
        </Typography>
        <ReactQuill
          value={message}
          onChange={handleChange}
          modules={{
            toolbar: [
              [{ header: [1, 2, false] }],
              ['bold', 'italic', 'underline']
            ],
          }}
          formats={[
            'header',
            'bold', 'italic', 'underline',
          ]}
        />
        <Button
          variant="contained"
          color="primary"
          style={{ marginTop: '12px' }}
          onClick={sendMessage}
        >
          Send
        </Button>
      </Paper>
    <Divider />
    <br></br>
    <Typography variant="h6" gutterBottom style={{ marginLeft: "15px" }}>
      Notification Examples:
    </Typography>
        <List>
          <ListItem button>
            <ListItemText primary="Notify a Team:" secondary="A way of sending messages to all Teams"  />
            <Button onClick={notifyTeam}>Send</Button>
          </ListItem>
          <ListItem button>
            <ListItemText primary="Notify a channel:" secondary="A way of sending messages to a channel"/>
            <Button onClick={notifyChannel}>Send</Button>
          </ListItem>
          <ListItem button>
            <ListItemText primary="Notify the chat member:" secondary="A way of sending message to a specific user"/>
            <Button onClick={notifyUser}>Send</Button>
          </ListItem>
        </List>
        <div>
        <Divider />
        <div style={{ marginTop: "20px", marginBottom: "50px", marginLeft: "30px", marginRight: "30px" }}>
        <Typography variant="h6" gutterBottom style={{ marginLeft: "15px", marginTop: "15px", marginBottom: "15px" }}>
            Mentioning Example:
        </Typography>
           <MentionUser users={users} selectedTeam={selectedTeam} selectedChannel={selectedChannel} />
           <div>
        <Divider />
           <br />
           <p>Adaptive card example:</p>
            <button onClick={adaptiveCardMessage}>Send</button>
          </div> 
        </div>
        {/*  <Typography variant="h6" gutterBottom style={{ marginLeft: "15px", marginTop: "15px", marginBottom: "15px" }}>
          Mentioning Examples:
        </Typography>
        <TextField
          label="Write a Message"
          multiline
          fullWidth
          sx={{
            backgroundColor: '#f5f5f5',
            fontFamily: 'monospace',
            width: "50%",
            marginLeft: "30px"
          }}
          value={message2}
          onChange={handleChange2}
        />
        {showUserDropdown && (
          <div>
            {matchingUsers.map((user) => (
              <MenuItem
                key={user.id}
                onClick={() => handleUserSelect(user)}
              >
                {user.displayName}
              </MenuItem>
            ))}
          </div>
        )}
        <Button variant="contained" color="primary" style={{ marginTop: "12px", marginLeft: "20px" }} onClick={mentionAndSend}>
          Send
        </Button> */}
       
      </div>
      </Dialog>
    </div>
  );
}