import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import {
  Switch,
  Route,
  withRouter, Link
} from 'react-router-dom';
import Box from '3box';
import Login from "./components/Login";
import Chat from "./components/Chat";
import NewThread from "./components/NewThread";
import CssBaseline from "@material-ui/core/CssBaseline";
import ForumHome from "./components/ForumHome";
import * as axios from "axios";
import {getListings} from "./libs/foam";
import Web3 from "web3";
import Button from "@material-ui/core/Button";
import mapboxgl from 'mapbox-gl';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import makeBlockie from "ethereum-blockies-base64";
import {shortenEthAddr} from "./libs/3box-comments-react/src/utils";
import CircularProgress from "@material-ui/core/CircularProgress";

const firey = require('./assets/firey.png');

const BOX_SPACE = 'firey';
const LIST_THREADS_CACHE = '/api/v0/threads/';

function App(props) {
  const {history} = props;
  const [box, setBox] = useState( null);
  const [chatSpace, setChatSpace] = useState({});
  const [currentAddress, setAddress] = useState('');
  const [currentDid, setDid] = useState('');
  const [profile, setProfile] = useState({});
  const [isAppReady, setAppReady] = useState(false);
  const [disableLogin, setDisableLogin] =  useState(false);
  const [threads, setThreads] = useState([]);
  const [locations, setLocations] = useState([]);
  const [badges, setBadges] = useState([]);
  const [limits, setLimits] = useState({
    id: '0x0',
    challenge: 0,
    votes: 0,
    points: 0,
    tokens: "0",
    rewards: 0,
  });

  let listing = async (address) => {
    const foam_user  = await getListings(address);
    console.log(foam_user);
    setLocations(foam_user.listings);
    let user_limits = {
      id: foam_user.id,
      challenge: foam_user.numChallenges || 0,
      votes: foam_user.numVotesRevealed || 0,
      tokens: foam_user.totalAmountStaked || '0',
      points: foam_user.listings.length,
      rewards: foam_user.totalMapRewards || 0,
    };
    setLimits(user_limits)
  };

  const handleLogin = async () => {
    await window.ethereum.enable();
    setDisableLogin(true);
    const web3 = new Web3(window.web3.currentProvider || "ws://localhost:8545");
    let address = await web3.eth.getAccounts()

    const profile = await Box.getProfile(address[0]);
    const box = await Box.openBox(address[0], window.ethereum, {})

    await box.syncDone;

    const chatSpace = await box.openSpace(BOX_SPACE);
    const Did = chatSpace.DID;

    setAddress(address[0]);
    setProfile(profile);
    setBox(box);
    setDid(Did);
    console.log(Did)
    setChatSpace(chatSpace);
    setAppReady(true);
    window.localStorage.setItem('logged', true)
    await listing(address[0]);

    //history.push('/home');
  };

  const forceRefresh =  async () => {
    try {
      const response = await axios(LIST_THREADS_CACHE);
      console.log(response)
      setThreads(response.data.data)
      setBadges(response.data.badges);
      console.log(response.data)
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    forceRefresh().then(() => console.log('updated data')).catch((e) => console.log(e))
  }, []);


  useEffect(() => {
    if (window.localStorage.getItem('logged')) {
      handleLogin()
    }
  }, [])
  const updatedProfilePicture = profile.image ? `https://ipfs.infura.io/ipfs/${profile.image[0].contentUrl['/']}`
    : currentAddress && makeBlockie(currentAddress);

  return (
    <div className="App">
      <AppBar position="static" style={{marginBottom: '15px', backgroundColor: '#C20530'}}>
        <Container>
        <Toolbar style={{justifyContent: 'space-between', display: 'flex'}}>
          <Link to='/'>
            <div style={{display: 'flex', alignItems: 'center'}}>
            <img src={firey} style={{    minWidth: '56px',
              minHeight: '56px',
              maxWidth: '56px',
              maxHeight: '56px'}} alt=""/>
          <Typography style={{color: "white"}} variant="h6">
            Firey
          </Typography> </div></Link>
          <div style={{display: 'flex'}}>
            <Link to='/'><Button style={{color: "white"}}>Home</Button></Link>
            {!disableLogin && <Button style={{color: "white"}} onClick={handleLogin}>Login</Button> }

          { disableLogin && !isAppReady &&<div style={{display: 'flex', alignItems: 'center'}}>
          <CircularProgress style={{color: 'white'}} color="primary" /> Loading Profile...
          </div>}
          {isAppReady &&
            <Link to='/threads/new'><Button style={{color: "white"}}>New thread</Button></Link>
          }
          { Object.keys(profile).length !== 0 && <div style={{display: 'flex', alignItems: 'center'}}>
              <img src={updatedProfilePicture} alt="Profile" className="input_user" style={{position: 'initial'}}/>
              {profile.name || shortenEthAddr(currentAddress)}
            </div>
          }
          </div>

        </Toolbar>
        </Container>
      </AppBar>


      <CssBaseline />
      <React.Fragment>
        <Switch>
          <Route
            exact
            path={'/threads/new'}
            render={() => (
              <NewThread
                space={chatSpace}
                profile={profile}
                address={currentAddress}
                did={currentDid}
                badges={badges}
                isReady={isAppReady}
                refresh={forceRefresh.bind(this)}
                locations={locations}
                limits={limits}
              />
            )}
          />
          <Route
            exact
            path={'/threads/:threadId'}
            render={() => (
              <Chat
                space={chatSpace}
                profile={profile}
                address={currentAddress}
                badges={badges}
                isReady={isAppReady}
                did={currentDid}
                box={box}
                refresh={forceRefresh.bind(this)}
                limits={limits}
                locations={locations}
              />
            )}
          />

          <Route
            exact
            path='/'
            render={() => <ForumHome
              history={history}
              box={box}
              address={currentAddress}
              did={currentDid}
              profile={profile}
              badges={badges}
              isReady={isAppReady}
              space={chatSpace}
              threads={threads}
              refresh={forceRefresh.bind(this)}
              locations={locations}
            />}
          />

        </Switch>
      </React.Fragment>
    </div>
  );
}

export default withRouter(App);