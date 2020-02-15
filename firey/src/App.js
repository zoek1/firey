import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import {
  Switch,
  Route,
  withRouter
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
    challenges: 0,
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
      challenges: foam_user.numChallenges,
      votes: foam_user.numVotesRevealed,
      tokens: foam_user.totalAmountStaked,
      points: foam_user.listings.length,
      rewards: foam_user.totalMapRewards,
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
    if (!box) {
      history.push('/');
      setAppReady(true);
      handleLogin();
    }
  }, [])

  return (
    <div className="App">
      <CssBaseline />
      {isAppReady && (<React.Fragment>
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
                did={currentDid}
                box={box}
                refresh={forceRefresh.bind(this)}
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
            />}
          />

        </Switch>
      </React.Fragment>)}
    </div>
  );
}

export default withRouter(App);