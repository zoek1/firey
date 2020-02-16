import React, { Component } from 'react';

import Topics from './Topics';
import Dialogue from './Dialogue';
import Members from './Members';
import AppModals from './AppModals';
import '../styles/index.css';
import ThreeBoxComments from "../libs/3box-comments-react/src/index";
import {withRouter} from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import {Container} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import CardContent from "@material-ui/core/CardContent";
import Card from "@material-ui/core/Card";
import Web3 from "web3";
import Map from "./Map";
import AppBar from "@material-ui/core/AppBar";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Box from "@material-ui/core/Box";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Link from "@material-ui/core/Link";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
const ReactMarkdown = require('react-markdown')


const canPost = (publishing, publishingValue, location, precision, limits, badges, locations) => {
  const decimal_re = /(^-?[0-9.]+)$/;
  const uint_re = /^\d+$/;

  const BN = Web3.utils.BN;

  if (!location) {
    console.log('Mal formed post Requires location to comments')
    return false;
  }
  const geohash = location.slice(0, precision);
  let hasParticipation;
  for(let i=0; i<locations.length;i++) {
    let test = locations[i].geohash.slice(0, precision);
    if (test === geohash) {
      hasParticipation = true;
      console.log('== Has participation')
      break;
    }
  }

  if (!hasParticipation) {
    console.log('== Requires participation')
    return false;
  }



  if (publishing === 'holding') {
    if (!publishingValue.match(decimal_re)) return false;

    let requestAmount = Web3.utils.toWei(publishingValue)

    if (new BN(requestAmount).lt(new BN(limits.tokens))) {
      console.log('== has the amount')
      return true;

    }
  }

  if (publishing === 'points' ) {
    if (publishingValue >= limits.points) {
      console.log('== has the points')
      return true;
    }
  }
  if (publishing === 'challenge') {
    if (publishingValue >= limits.challenge) {
      console.log('== Has the challenges')
      return true;
    }
  }

  const checkBadge = (badge, limits) => {
    console.log(`== ${badge.req.holding}  <= ${Web3.utils.fromWei(limits.tokens)}`)
    if (new BN(Web3.utils.toWei(badge.req.holding.toString())).gt(new BN(limits.tokens))) return false;
    console.log(`== ${badge.req.challenge} <= ${limits.challenge}`)
    if (badge.req.challenge > limits.challenge) return false;
    console.log(`== ${badge.req.points} <= ${limits.points}`)
    if (badge.req.points > limits.points) return false;
    console.log('== Match badge requirements')
    return true;
  };

  if (publishing === 'badge' ) {
    let badge = badges[publishingValue];
    let result = checkBadge(badge, limits)
    console.log(`== BATCH: ${result}`)
    return result;
  }

  console.log('No allowed to post')
  return false;
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

const styles = {
  title: {
    fontSize: '1.2em',
    fontWeight: 'bold'
  }
}

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTopic: {},
      openTopics: {},
      threadMemberList: [],
      threadModeratorList: [],
      threadData: [],
      topicTitle: '',
      threadACError: '',
      postMsg: '',
      topicName: '',
      threadMember: '',
      threadMod: '',
      showNewTopicModal: false,
      showAddNewModeratorModal: false,
      showAddNewMemberModal: false,
      isMembersOnly: false,
      showMap: 0
    };
  }

  handleChange = (event, value) => { // for inputs in app modals
    console.log(value)
    this.setState({showMap: value });
  };

  render() {
    const {
      address,
      box,
      profile,
      did,
      space,
      badges,
      limits,
      locations,
      history
    } = this.props;

    if (this.props.location.state === undefined) {
      history.push('/')
      return <></>
    }

    const thread = this.props.location.state.thread;
    const {
      publishing,
      location
    } = this.props.location.state.thread;
    console.log(`CHAT: ${thread.thread.id}`);
    console.log(this.props.location.state.thread);
    let badge = badges[publishing.value];

    return (
      <>
        <Grid container>
          <Grid item xs={12} md={8} style={{paddingLeft: '15px', paddingRight: '15px'}}>
            <Card>
              <CardContent>
                  <Tabs value={this.state.showMap} onChange={this.handleChange.bind(this)} aria-label="simple tabs example">
                    <Tab label="Show Post" {...a11yProps(0)} />
                    <Tab label="Show Map" {...a11yProps(1)} />
                  </Tabs>
                <TabPanel value={this.state.showMap} index={0}>

                    <ReactMarkdown source={thread.description}/>
                </TabPanel>
                <TabPanel value={this.state.showMap} index={1}>
                  {location.point && location.point.geohash && <Map style={{height: '70vh', width: '100%'}} location={location}/>}
                </TabPanel>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4} style={{paddingLeft: '10px', paddingRight: '10px',}}>

            <Card>
              <CardContent>
                <Typography component="h1" style={styles.title}>{thread.title}</Typography>
                <Typography style={{fontSize: '1em'}} component="p" >{thread.location.point.name}</Typography>
                {thread.location.point.coords &&
                <Typography style={{fontSize: '0.8em'}} component="p">Coords: {thread.location.point.coords.lat}, {thread.location.point.coords.lon}</Typography>}

                <Typography style={{fontSize: '1em'}} component="p" >{thread.location.point.address}</Typography>

                <Typography style={{marginTop: '15px', fontWeight: 500, marginBottom: '15px'}} component="p">Level</Typography>
                <div style={{display: 'flex', justifyContent: "space-around"}}>
                  { badge && publishing.policy === 'badge' &&
                  <div>
                    <img style={{maxWidth: 50}} src={badge.url} alt=""/><br/>
                    <Typography component={'label'}>{badge.name}</Typography>
                  </div>}
                  <div>
                  <div style={{display: 'flex', justifyContent: "space-around" }}>
                  { (publishing.policy === 'points' || publishing.policy === 'badge') &&
                  <div style={{ width: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <img style={{maxWidth: '35px'}} src='https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png' alt=""/>
                    { badge  && publishing.policy === 'badge' ? badge.req.points : publishing.value }
                  </div>}
                  {(publishing.policy === 'holding' || publishing.policy === 'badge')  &&
                  <div style={{ width: '80px',display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <img style={{maxWidth: '35px'}} src="https://i.ya-webdesign.com/images/game-coin-png-1.png" alt=""/>
                    {badge  && publishing.policy === 'badge' ? badge.req.holding : publishing.value }
                  </div>}
                  {(publishing.policy === 'challenge' || publishing.policy === 'badge') &&
                  <div style={{ width: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <img style={{maxWidth: '35px'}} src="https://i7.pngguru.com/preview/449/891/625/minecraft-diamond-sword-video-game-mob-ice-axe.jpg" alt=""/>
                    {badge && publishing.policy === 'badge' ? badge.req.challenge :  publishing.value }
                  </div>
                  }</div>
                    <br/>
                    <Typography component={'label'}>Requirements</Typography>
                  </div>
                </div>
              </CardContent>
              <CardActions>
                {thread.location.point.coords &&
                <Link href={`https://map.foam.space/#/at/?lng=${thread.location.point.coords.lon}&lat=${thread.location.point.coords.lat}&zoom=${thread.location.precision[0]}`}><Button>Go to FOAM MAP</Button></Link>}
              </CardActions>
            </Card>
            {space && space._name &&
            <Grid container  style={{marginTop: '20px'}}>
              <Card>
                <CardContent style={{paddingRight: '15px', paddingLeft: '15px'}}>
                  <ThreeBoxComments
                    // required
                    spaceName={space._name}
                    threadName={thread.thread.name}
                    adminEthAddr={thread.thread.owner}
                    firstModerator={thread.thread.owner}
                    threadId={thread.thread.id}
                    space={space}
                    // Required props for context A) & B)
                    box={box}
                    currentUserAddr={address}
                    canPost={() =>  canPost(publishing.policy, publishing.value, location.point.geohash, location.precision, limits, badges, locations) }

                    // optional
                    members={false}
                    showCommentCount={10}
                    useHovers={false}
                    currentUser3BoxProfile={profile}
                    userProfileURL={address => `https://mywebsite.com/user/${address}`}
                  />
                </CardContent>
              </Card>
            </Grid>}
          </Grid>
        </Grid>
      </>
    );
  }
}
export default withRouter(Chat);