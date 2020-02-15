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
    } = this.props;

    const thread = this.props.location.state.thread
    const {
      joining
    } = this.props.location.state.thread;
    console.log(`CHAT: ${thread.thread.id}`)
    let badge = badges[joining.value]

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
              { badge && joining.policy === 'badge' &&
              <div>
                <img style={{maxWidth: 50}} src={badge.url} alt=""/><br/>
                <Typography component={'label'}>{badge.name}</Typography>
              </div>}
              { (joining.policy === 'points' || joining.policy === 'badge') && <div>
                <img style={{maxWidth: 35}} src='https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png' alt=""/>
                { badge  && joining.policy === 'badge' ? badge.req.points : joining.value }
              </div>}
              {(joining.policy === 'holding' || joining.policy === 'badge')  &&
              <div>
                <img style={{maxWidth: 35}} src="https://i.ya-webdesign.com/images/game-coin-png-1.png" alt=""/>
                {badge  && joining.policy === 'badge' ? badge.req.holding : joining.value }
              </div>}
              {(joining.policy === 'challenge' || joining.policy === 'badge') &&
              <div>
                <img style={{maxWidth: 35}} src="https://i7.pngguru.com/preview/449/891/625/minecraft-diamond-sword-video-game-mob-ice-axe.jpg" alt=""/>
                {badge && joining.policy === 'badge' ? badge.req.challenge :  joining.value }
              </div>
              }
            </div>
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