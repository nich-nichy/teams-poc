import './App.css';
import React, { useEffect, useState } from "react";
import Axios from 'axios';
import FullScreenDialog from './components/message'
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Divider from '@mui/material/Divider';

const App = () => {
  const [teamsWithChannels, setTeamsWithChannels] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null);

  let accessToken = "eyJ0eXAiOiJKV1QiLCJub25jZSI6Ijk2bk83SEpwT3dnZktYeHYwbXhvcDlIdW4wY09mYUtJMWh6WXVXQVlFTlEiLCJhbGciOiJSUzI1NiIsIng1dCI6IlQxU3QtZExUdnlXUmd4Ql82NzZ1OGtyWFMtSSIsImtpZCI6IlQxU3QtZExUdnlXUmd4Ql82NzZ1OGtyWFMtSSJ9.eyJhdWQiOiJodHRwczovL2dyYXBoLm1pY3Jvc29mdC5jb20iLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC83ZjQwNTIxYS0xOTk3LTQ1ZTYtYjE5Ni1jMDE4YzBhNDU0MWIvIiwiaWF0IjoxNzAxODU5NjQzLCJuYmYiOjE3MDE4NTk2NDMsImV4cCI6MTcwMTg2NDU5MCwiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IkFWUUFxLzhWQUFBQUE1T3ZDTElvTWRFNnk3bEdaOHo4bVlYNEJDSWNTTWJZdTl1ZWtoaG90SEpLMFBZbkZhcVpDc2t4d3FjRVhXRGxKT0RQdjJVN2xYcmNTMFhJRTZBcU9peC9yVkdXL1B6aFFLazg2N1J6YXhzPSIsImFtciI6WyJwd2QiLCJtZmEiXSwiYXBwX2Rpc3BsYXluYW1lIjoiQXJvb3BhIEFwcHMgLSBTcHJlYWRzaGVldHMiLCJhcHBpZCI6ImE2NzUwMzM5LWRmNGYtNDI5Zi04ODRiLTcyYTVjMjMyMTViNiIsImFwcGlkYWNyIjoiMSIsImZhbWlseV9uYW1lIjoiTW9oYW1lZCBSYXNoZWVkIiwiZ2l2ZW5fbmFtZSI6Ik1vaGFtZWQgTmlzaGF0aCIsImlkdHlwIjoidXNlciIsImlwYWRkciI6IjEwNi41MS4zLjIxNyIsIm5hbWUiOiJNb2hhbWVkIE5pc2hhdGggTW9oYW1lZCBSYXNoZWVkIiwib2lkIjoiNTY3N2U4NjEtMTk5YS00OWNkLWJmZTAtNWM3MWVmOGEzMGEyIiwib25wcmVtX3NpZCI6IlMtMS01LTIxLTM5Mjg0NDkxMzAtMjY4NjM4ODMxMC0xMDM5MDA3OTUtMTI3MiIsInBsYXRmIjoiMyIsInB1aWQiOiIxMDAzMjAwMjc4ODlFRTc0IiwicmgiOiIwLkFYSUFHbEpBZjVjWjVrV3hsc0FZd0tSVUd3TUFBQUFBQUFBQXdBQUFBQUFBQUFEREFNMC4iLCJzY3AiOiJDaGFubmVsLlJlYWRCYXNpYy5BbGwgQ2hhbm5lbE1lc3NhZ2UuRWRpdCBDaGFubmVsTWVzc2FnZS5TZW5kIENoYXQuQ3JlYXRlIE5vdGlmaWNhdGlvbnMuUmVhZFdyaXRlLkNyZWF0ZWRCeUFwcCBvcGVuaWQgcHJvZmlsZSBUZWFtLkNyZWF0ZSBUZWFtLlJlYWRCYXNpYy5BbGwgVGVhbXNBY3Rpdml0eS5TZW5kIFVzZXIuUmVhZCBVc2VyLlJlYWRCYXNpYy5BbGwgZW1haWwiLCJzaWduaW5fc3RhdGUiOlsia21zaSJdLCJzdWIiOiJySXNkMmN0VUw5akc4c0RzU1RjQ1ZEMXVZVHJUMXJGSGlNMmhlYjBhb1lBIiwidGVuYW50X3JlZ2lvbl9zY29wZSI6IkFTIiwidGlkIjoiN2Y0MDUyMWEtMTk5Ny00NWU2LWIxOTYtYzAxOGMwYTQ1NDFiIiwidW5pcXVlX25hbWUiOiJNb2hhbWVkbmlzaGF0aC5Nb2hhbWVkcmFzaGVlZEBhcm9vcGF0ZWNoLmNvbSIsInVwbiI6Ik1vaGFtZWRuaXNoYXRoLk1vaGFtZWRyYXNoZWVkQGFyb29wYXRlY2guY29tIiwidXRpIjoiLUhQUnJFcHhyRUt5SWR0cThuNW1BQSIsInZlciI6IjEuMCIsIndpZHMiOlsiYjc5ZmJmNGQtM2VmOS00Njg5LTgxNDMtNzZiMTk0ZTg1NTA5Il0sInhtc19zdCI6eyJzdWIiOiJndl9PSWZrVHViRmc5aUc4QmpNVXVlQVhfcEZoWWFWWnNsZGNxaGxZOWFvIn0sInhtc190Y2R0IjoxMzY5OTMzNTIzfQ.iU-ZlxlUiApaRjGiEsQfofWjVxBXpcfW5rHfhUEhW2USGZq4Nw_9F1OuqhHQDVNxyuiBfoM-92WCDcPGEBJswAkun3UNR_9sIDhmjHHnJmZXnsvSWAqjm8bNr-mwyG3jxbx8IeoWzUep4jHSofsqiY3wzNukXgt3dLqda3bFa39TMWdv7DhLbNX7X9JcyHZr1mBFpXL_v-p4WzUsCZgweKsDYUVcmG67qV5BdXpDqj73Rm_4xZErSHOwV2RzLFxw0221QlTzGtK6n0i4bxeKc0O3GPlvxMaU7YODO4JP-fpuFa2SNg8HQh7vSnAT2m9oT_FnbbYpfnrsgYal27XCCA";
// TODO: Data should be send
  useEffect(() => {
    const requestData = {
      token: accessToken, 
    };
    Axios.post('http://localhost:3039/getTeams', requestData)
      .then((response) => {
        setTeamsWithChannels(response.data.teamsWithChannels);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleTeamSelect = (team) => {
    setSelectedTeam(team);
    console.log(team);
  };

  const handleChannelSelect = (channel) => {
    setSelectedChannel(channel);
    console.log(channel);
  };

  return (
    <div>
    <h1 style={{textAlign: "center", marginTop: "10px", marginBottom: "50px"}}>Microsoft Teams Integration - POC</h1>
    <div className="container">
      <div style={{ marginTop: "100px" }}>
        <FormControl sx={{ width: 300, marginBottom: 2 }}>
          <InputLabel id="team-select-label">Team</InputLabel>
          <Select
            labelId="team-select-label"
            id="team-select"
            label="Team"
            value={selectedTeam}
            onChange={(e) => handleTeamSelect(e.target.value)}
          >
            <MenuItem value={null}>Select a Team</MenuItem>
            {teamsWithChannels?.map((team) => (
              <MenuItem key={team?.id} value={team}>
                {team?.displayName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div>
        <FormControl sx={{ width: 300, marginBottom: 2 }}>
          <InputLabel id="channel-select-label">Channel</InputLabel>
          <Select
            labelId="channel-select-label"
            id="channel-select"
            label="Channels"
            value={selectedChannel}
            onChange={(e) => handleChannelSelect(e.target.value)}
          >
            {selectedTeam &&
              selectedTeam?.channels.map((channel) => (
                <MenuItem key={channel?.id} value={channel?.id}>
                  {channel?.displayName}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </div>
      <FullScreenDialog selectedTeam={selectedTeam} selectedChannel={selectedChannel} accessToken={accessToken} />
    </div>
    </div>
  );
};

export default App;

