import Typography from "@material-ui/core/Typography";
import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {Card} from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import CardActions from "@material-ui/core/CardActions";
import * as axios from "axios";

const SUBSCRIBE_THREAD_CACHE = '/api/v0/threads/subscribe';
const MODERATOR_ADDRESS = '0xed628E601012cC6Fd57Dc0cede2A527cdc86A221';

const EntryThread = (props)  => {
  const {
    id,
    title,
    description,
    subscribe,
    thread,
  } = props.data;
  const {goThread, joinThread, address} = props;

  return (
      <Card>
        <CardContent>
          <Typography component="h3">{title}</Typography>
          <Typography component="p">{description}</Typography>
        </CardContent>
        <CardActions>
          { thread.members.indexOf(address) === -1 ? <Button onClick={() => joinThread(props.data)}>Join</Button> : <></>}

          <Button onClick={() => goThread(props.data)}>Go</Button>
        </CardActions>
      </Card>)
};

const ThreadGroup = (props) => {
  const threads = props.threads.map((thread) => (
    <EntryThread key={thread.id} data={thread} history={props.history}
                 joinThread={props.joinThread} goThread={props.goThread} address={props.address}/>
  ));
  return (<Container>
    {threads}
  </Container>)
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
    match,
    threads,
    refresh,
  } = props;
  console.log(props)

  const goToThread = (data) => {
    history.push(`/threads/${data.id}`, {
      thread: data
    })
  };

  const subscribeThread = async (data) => {
    console.log(threads);
    try {
      console.log(`SUBSCRIBER: ${data.thread.id}`)
      const publicThread = await space.joinThread(data.thread.id);

      let response = await axios({
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        data: JSON.stringify({
          address: address,
          thread: data.id,
        }),
        url: SUBSCRIBE_THREAD_CACHE
      });

      refresh();
      goToThread(data);
    } catch (e) {
      console.log(e)
    }
  };

  return (<>
    <Typography component="h2">Threads</Typography>
    <Link to='/threads/new'>New thread</Link>

    <ThreadGroup threads={threads} goThread={goToThread} joinThread={subscribeThread} address={address} />
  </>)
};

export default ForumHome;