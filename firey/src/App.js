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

const BOX_SPACE = 'firey';


function App(props) {
  const {history} = props;
  const [box, setBox] = useState( null);
  const [chatSpace, setChatSpace] = useState({});
  const [currentAddress, setAddress] = useState('');
  const [currentDid, setDid] = useState('');
  const [profile, setProfile] = useState({});
  const [isAppReady, setAppReady] = useState(false);
  const [disableLogin, setDisableLogin] =  useState(false);


  const handleLogin = async () => {
    const address = await window.ethereum.enable();
    setDisableLogin(true);
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

    //history.push('/home');

  };

  useEffect(() => {
    if (!box) {
      history.push('/threads');
      setAppReady(true);
      handleLogin();
    }
  }, [])

  return (
    <div className="App">
      <CssBaseline />
      {isAppReady && (<React.Fragment>
        <Switch>
          {<Route
            path='/threads'
            render={() => <ForumHome
              history={history}
              box={box}
              address={currentAddress}
              did={currentDid}
              profile={profile}
              isReady={isAppReady}
              space={chatSpace}  />}
          />}
        </Switch>
      </React.Fragment>)}
    </div>
  );
}

export default withRouter(App);