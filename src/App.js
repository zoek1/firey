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
import ForumHome from "./components/ForumHome";
import CssBaseline from "@material-ui/core/CssBaseline";
const BOX_SPACE = 'firey';


function App(props) {
  const {history} = props;
  const [box, setBox] = useState( null);
  const [chatSpace, setChatSpace] = useState({});
  const [currentAddress, setAddress] = useState('');
  const [currentDid, setDid] = useState('');
  const [profile, setProfile] = useState({});
  const [isAppReady, setAppReady] = useState(false);
  const [topics, setTopics] = useState([]);
  const [topicManager, setTopicManager] = useState({})
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

    history.push('/home');

  };

  useEffect(() => {
    if (!box) {
      history.push('/');
      setAppReady(true);
      handleLogin();
    }
  }, [])

  const addToTopicList = () => {

  };

  return (
    <div className="App">
      {isAppReady && (<React.Fragment>
        <CssBaseline />
        <Switch>
          {/*<Route
            exact
            path='/'
            render={() => <Login handleLogin={handleLogin.bind(this)} disableLogin={disableLogin} />}
          />*/}

          <Route
            exact
            path='/home'
            render={() => (
              <ForumHome
                space={chatSpace}
                profile={profile}
                address={currentAddress}
                did={currentDid}
              />
            )}
          />
          <Route
            exact
            path='/chat'
            render={() => (
              <Chat
                chatSpace={chatSpace}
                profile={profile}
                address={currentAddress}
                did={currentDid}
                topicList={topics}
                topicManager={topicManager}
                addToTopicList={addToTopicList.bind(this)}
              />
            )}
          />
        </Switch>
      </React.Fragment>)}
    </div>
  );
}

export default withRouter(App);