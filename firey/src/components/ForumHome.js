import Typography from "@material-ui/core/Typography";
import React, {useEffect, useState} from "react";
import * as axios from "axios";
import {Link, Route, Switch, withRouter, useRouteMatch} from "react-router-dom";
import Button from "@material-ui/core/Button";
import {Card} from "@material-ui/core";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import NewThread from "./NewThread";
import Chat from "./Chat";

const LIST_THREADS_CACHE = '/api/v0/threads/';

const EntryThread = (props)  => {
  const {
    id,
    title,
    description
  } = props.data;

  return (
    <Link to={{
      pathname: `/threads/${id}`,
      state: {
        thread: props.data
      }
    }}>
      <Card>
        <CardContent>
          <Typography component="h3">{title}</Typography>
          <Typography component="p">{description}</Typography>
        </CardContent>
      </Card>
    </Link>)
};

const ThreadGroup = (props) => {
  const threads = props.threads.map((thread) => (
    <EntryThread key={thread.id} data={thread} />
  ));
  return (<>
    {threads}
  </>)

};

const ForumHome = (props) => {
  const {
    history,
    box,
    address,
    did,
    profile,
    isReady,
    space,
    match
  } = props;
  console.log(props)
  const [threads, setThreads] = useState([]);
  const [topics, setTopcs] = useState([]);
  const [topicManager, setTopicManager] = useState({})

  let { path, url } = useRouteMatch();


  const addToTopicList = () => {

  };

  const forceRefresh =  async () => {
    try {
      const response = await axios(LIST_THREADS_CACHE);
      setThreads(response.data.data)
      console.log(response.data.data)
    } catch (e) {
      console.log(e);
    }
  };


  useEffect(() => {
    forceRefresh().then(() => console.log('updated data')).catch((e) => console.log(e))
  }, []);

  return (<>
        <Switch>
          <Route
            exact
            path={path + '/new'}
            render={() => (
              <NewThread
                space={space}
                profile={profile}
                address={address}
                did={did}
                refresh={forceRefresh.bind(this)}
              />
            )}
          />
          <Route
            exact
            path={path + '/:threadId'}
            render={() => (
              <Chat
                space={space}
                profile={profile}
                address={address}
                did={did}
                box={box}
              />
            )}
          />
        </Switch>



    <Typography component="h2">Threads</Typography>
    <Link to={url + '/new'}>New thread</Link>

    <ThreadGroup threads={threads} />
  </>)
};

export default ForumHome;