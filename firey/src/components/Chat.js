import React, { Component } from 'react';

import Topics from './Topics';
import Dialogue from './Dialogue';
import Members from './Members';
import AppModals from './AppModals';
import '../styles/index.css';
import ThreeBoxComments from "../libs/3box-comments-react/src/index";
import {withRouter} from "react-router-dom";
import Typography from "@material-ui/core/Typography";

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
    } = this.props;

    const thread = this.props.location.state.thread;

    return (
      <div>
        <Typography component="h1">{thread.title}</Typography>
        <Typography component="p">{thread.description}</Typography>
        {space && space._name &&
        <div>

          <ThreeBoxComments
            // required
            spaceName={space._name}
            threadName={thread.thread.name}
            adminEthAddr={thread.thread.owner}
            firstModeator={thread.thread.owner}

            // Required props for context A) & B)
            box={box}
            currentUserAddr={address}


            // optional
            members={false}
            showCommentCount={10}
            threadOpts={{}}
            useHovers={false}
            currentUser3BoxProfile={profile}
            userProfileURL={address => `https://mywebsite.com/user/${address}`}
          />
        </div>}
      </div>
    );
  }
}
export default withRouter(Chat);