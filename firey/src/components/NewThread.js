import React, {useEffect, useState} from "react";
import {Container, TextField} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import {getListings} from "../libs/foam";
import Web3 from "web3";
import * as axios from "axios";
import {withRouter} from "react-router-dom";

const MODERATOR_ADDRESS = '0xed628E601012cC6Fd57Dc0cede2A527cdc86A221';
const PREFIX_CHANNEL_NAME = 'test_firey';
const ENDPOINT_CACHE = '/api/v0/thread/';

const get_thread_name = (title) => `${PREFIX_CHANNEL_NAME}_${title.replace(/\W/g, '')}_${Date.now()}`;

const createThread = async (address, space, title, description, locationArea, joiningPolicy, publishingPolicy) => {
  let threadName = get_thread_name(title);
  console.log(threadName)
  const thread = await space.joinThread(threadName, {
      firstModerator: address,
      members: joiningPolicy.type !== 'open'
  });

  if (MODERATOR_ADDRESS !== address) {
    try {
      await thread.addModerator(MODERATOR_ADDRESS);
    } catch (e) {
      console.log(e)
      console.log(`${MODERATOR_ADDRESS} already have access!`)
    }
  }

  console.log(thread);

  let response = axios({
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    data: JSON.stringify({
        title: title,
        description: description,
        location: locationArea.location,
        precision: locationArea.presicion,
        joining: joiningPolicy.type,
        joiningValue: joiningPolicy.value,
        publishing: publishingPolicy.type,
        publishingValue: publishingPolicy.value,
        threadId: thread._address,
        threadName: threadName,
        moderator: address,
        is_open: joiningPolicy.type !== 'open'
    }),
    url: ENDPOINT_CACHE
  });

  return (await response);
};

const NewThread = (props) => {
  const {
    address,
    profile,
    did,
    space,
    history,
  } = props;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [joining, setJoining] = useState('open');
  const [publishing, setPublishing] = useState('open');
  const [location, setLocation] = useState({});
  const [publishingValue, setPublishingValue] = useState("");
  const [joiningValue, setJoiningValue] = useState("");
  const [presicion, setPresicion] = useState(10);
  const [locations, setLocations] = useState([]);
  const [limits, setLimits] = useState({
    id: '0x0',
    challenges: 0,
    votes: 0,
    points: 0,
    tokens: "0",
    rewards: 0,
  });

  const onCreate = () => {
    console.log(!!title)
    console.log(!!description)
    console.log(!!location)
    console.log(!!joining)
    console.log(!!publishing)
    if (!!title && !!description  && !!joining && !!publishing) {
      createThread(address, space, title, description,
        {location, presicion},
        {type: joining, value: joiningValue},
        {type: publishing, value: publishingValue}
        ).then((response) => {
          console.log('created')
          history.push(`/threads/${response.data.id}`, {
            thread: response.data
          })

      }).catch((e) => console.log(e))
    }

  }

  useEffect(() => {
      let listing = async () => {
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
    listing();
  }, []);


  return (<Container>
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Paper>
          <Typography component="h3">Add new thread</Typography>

          <form noValidate autoComplete='off'>
            <Grid container item xs={8}>
              <TextField id='title' label='Thread Tile'
                         value={title}
                         onChange={ (e) => setTitle(e.target.value)}
              />
            </Grid>
            <Grid container item xs={8}>
              <TextField id='description' label="Description"
                value={description}
                         onChange={ (e) => setDescription(e.target.value)}

              />
            </Grid>
            <Grid container item xs={8}>
            <FormControl>
              <InputLabel id="location-label">Location</InputLabel>
              <Select labelId="location-label" id='location'
                      value={ locations.indexOf(location) }
                      onChange={ (e) => setLocation(locations[e.target.value])}>
                {locations.map((e, index) => <MenuItem value={index} key={e.listingHash}>{e.name} - {e.address}</MenuItem>) }

              </Select>
            </FormControl>
            <FormControl>
              <InputLabel id="presicion-label">Precision</InputLabel>
              <Select labelId="presicion-label" id='location'
                      value={presicion}
                      onChange={ (e) => setPresicion(e.target.value)}>
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={4}>4</MenuItem>
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={6}>6</MenuItem>
                <MenuItem value={7}>7</MenuItem>
                <MenuItem value={8}>8</MenuItem>
                <MenuItem value={9}>9</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={11}>11</MenuItem>
                <MenuItem value={12}>12</MenuItem>
              </Select>
            </FormControl>
            </Grid>
            <Grid container item>
            <FormControl>
              <InputLabel id="joining-label">Joining</InputLabel>

              <Select labelId="joining-label" id='privacy'
                      value={joining}
                      onChange={ (e) => setJoining(e.target.value)}>
                <MenuItem value="open">Open</MenuItem>
                <MenuItem value="points">Points</MenuItem>
                <MenuItem value="challenge">Challenges</MenuItem>
                <MenuItem value="holding">Foam amount</MenuItem>
                <MenuItem value="badge">Badge</MenuItem>
              </Select>
            </FormControl>


              {joining === 'points' && <Grid container item xs={8}>
                <TextField id='points' label="Min Number of Points"
                           value={joiningValue}
                           onChange={ (e) => setJoiningValue(e.target.value)}
                           helperText={`Max allowed points ${limits.points}"`}
                />
              </Grid>}
              {joining === 'challenge' && <Grid container item xs={8}>
                <TextField id='description' label="Min Number of Challenges"
                           value={joiningValue}
                           onChange={ (e) => setJoiningValue(e.target.value)}
                           helperText={`Max allowed challenges ${limits.challenges}`} />
              </Grid>}
              {joining === 'holding' && <Grid container item xs={8}>
                <TextField id='holding' label="Min Number of FOAM Tokens staked"
                           value={joiningValue}
                           onChange={ (e) => setJoiningValue(e.target.value)}
                           helperText={`Max allowed ${Web3.utils.fromWei(limits.tokens)} FOAM`} />
              </Grid>}


              <FormControl>
              <InputLabel id="privacy-label">Publishing</InputLabel>

              <Select labelId="privacy-label" id='privacy'
                      value={publishing}
                      onChange={ (e) => setPublishing(e.target.value)}>
                <MenuItem value="open">Open</MenuItem>
                <MenuItem value="points">Points</MenuItem>
                <MenuItem value="challenge">Challenges</MenuItem>
                <MenuItem value="holding">FOAM amount</MenuItem>
                <MenuItem value="badge">Badge</MenuItem>
              </Select>
            </FormControl>

            {publishing === 'points' && <Grid container item xs={8}>
              <TextField id='points' label="Min Number of Points"
                         value={publishingValue}
                         onChange={ (e) => setPublishingValue(e.target.value)}
              helperText={`Max allowed points ${limits.points}"`}
              />
            </Grid>}
            {publishing === 'challenge' && <Grid container item xs={8}>
              <TextField id='description' label="Min Number of Challenges"
                         value={publishingValue}
                         onChange={ (e) => setPublishingValue(e.target.value)}
                         helperText={`Max allowed challenges ${limits.challenges}`} />
            </Grid>}
            {publishing === 'holding' && <Grid container item xs={8}>
              <TextField id='holding' label="Min Number of FOAM Tokens staked"
                         value={publishingValue}
                         onChange={ (e) => setPublishingValue(e.target.value)}
                         helperText={`Max allowed ${Web3.utils.fromWei(limits.tokens)} FOAM`} />
            </Grid>}

            </Grid>
            <Button disabled={!space} variant="contained" color="primary" onClick={onCreate}>
              Create {!space}
            </Button>
          </form>
        </Paper>
      </Grid>
    </Grid>
  </Container>)
}


export default withRouter(NewThread);