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

    if (new BN(requestAmount).gte(new BN(limits.tokens))) {
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
    };
  }

  handleAppModals = (modalName) => {
    const modalStateName = `show${modalName}`;
    const modalState = this.state[modalStateName];
    this.setState({ [modalStateName]: !modalState });
  }

  handleViewTopic = (topic) => {
    const { openTopics } = this.state;
    const { chatSpace, topicManager } = this.props;

    // clean topic state
    this.setState({
      topicTitle: topic,
      threadData: [],
      threadMemberList: [],
      threadModeratorList: [],
    });

    // if topic fetched before, use again
    if (openTopics[topic]) {
      this.setState({ activeTopic: openTopics[topic] }, () => {
        this.updateThreadPosts();
        this.updateThreadCapabilities();
      });
      return
    }

    // fetch topic data
    topicManager.getOwner(topic, (err, owner) => {
      topicManager.getMembers(topic, async (err, members) => {
        // Step 3 - join Thread
        const thread = 'the thread'
        openTopics[topic] = thread;
        this.setState({ activeTopic: openTopics[topic] });

        this.updateThreadPosts();
        this.updateThreadCapabilities();
        // Step 3 - add listener functions

      })
    })
  }

  updateThreadPosts = async () => {
    const { activeTopic } = this.state;
    this.updateThreadError();

    let threadData = []
    // Step 3 - get posts in thread
    const posts = []
    threadData.push(...posts)
    this.setState({ threadData });
  }

  updateThreadCapabilities = async () => {
    const { activeTopic } = this.state;

    // add thread members to state
    let threadMemberList = [];
    // Step 4 - members of thread
    const members = []
    threadMemberList.push(...members)
    this.setState({ threadMemberList });

    // add thread mods to state
    let threadModeratorList = [];
    // Step 4 - moderators of thread
    const moderators = []
    threadModeratorList.push(...moderators)
    this.setState({ threadModeratorList });
  }

  handleFormChange = (e, property) => { // for inputs in app modals
    const value = e ? e.target.value : '';
    this.setState({ [property]: value });
  }

  updateThreadError = (e = '') => {
    console.log('error', e);
    this.setState({ threadACError: e });
  }

  render() {
    console.log(this.props)

    const {
      address,
      box,
      profile,
      did,
      space,
      badges,
      limits,
      locations,
    } = this.props;

    const thread = this.props.location.state.thread
    const {
      publishing,
      location
    } = this.props.location.state.thread;
    console.log(`CHAT: ${thread.thread.id}`)
    console.log(this.props.location.state.thread);
    let badge = badges[publishing.value]

    return (
      <Container>
        <Grid container>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography component="h1">{thread.title}</Typography>
                <Typography component="p">{thread.description}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={8}>
            <div style={{display: 'flex'}}>
              <Typography component="label">Access</Typography>
              { badge && publishing.policy === 'badge' &&
              <div>
                <img style={{maxWidth: 50}} src={badge.url} alt=""/><br/>
                <Typography component={'label'}>{badge.name}</Typography>
              </div>}
              { (publishing.policy === 'points' || publishing.policy === 'badge') && <div>
                <img style={{maxWidth: 35}} src='https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png' alt=""/>
                { badge  && publishing.policy === 'badge' ? badge.req.points : publishing.value }
              </div>}
              {(publishing.policy === 'holding' || publishing.policy === 'badge')  &&
              <div>
                <img style={{maxWidth: 35}} src="https://i.ya-webdesign.com/images/game-coin-png-1.png" alt=""/>
                {badge  && publishing.policy === 'badge' ? badge.req.holding : publishing.value }
              </div>}
              {(publishing.policy === 'challenge' || publishing.policy === 'badge') &&
              <div>
                <img style={{maxWidth: 35}} src="https://i7.pngguru.com/preview/449/891/625/minecraft-diamond-sword-video-game-mob-ice-axe.jpg" alt=""/>
                {badge && publishing.policy === 'badge' ? badge.req.challenge :  publishing.value }
              </div>
              }
            </div>
            { location.point && location.point.geohash && <Map location={location}></Map>}

            {space && space._name &&
            <Grid container>

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
            </Grid>}
          </Grid>
        </Grid>
      </Container>
    );
  }
}
export default withRouter(Chat);