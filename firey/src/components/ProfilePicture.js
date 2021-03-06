import React, { Component } from 'react';
import makeBlockie from 'ethereum-blockies-base64';
import resolve from 'did-resolver';

import '../styles/index.css';

class ProfilePicture extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profilePicture: null,
      ethAddr: '',
      profileName: '',
      blockie: '',
    }
  }

  async componentDidMount() {
    let ethAddr;
    let profilePicture;
    let profileName;

    if (this.props.did) { // profiles via listModerator or listMember
      console.log(this.props.did)
      const doc = await resolve(this.props.did);
      console.log(doc)
      const profile = {}
      profileName = profile.name;
      profilePicture = profile.image;
      ethAddr = doc.publicKey[2].ethereumAddress;
    } else { // my profile from login
      console.log(this.props)
      const { myAddress, myProfilePicture, myName } = this.props;
      profileName = myName;
      profilePicture = myProfilePicture;
      ethAddr = myAddress;
    }

    const blockie = makeBlockie(ethAddr);
    this.setState({ profilePicture, ethAddr, profileName, blockie });
  }

  render() {
    const {
      isTile,
      isUseHovers,
      isModerator,
      isOwner,
    } = this.props;
    const { profilePicture, profileName, blockie, ethAddr } = this.state;
    const image = !!profilePicture ? `https://ipfs.infura.io/ipfs/${profilePicture[0].contentUrl['/']}` : blockie;

    return (
      <React.Fragment>
        {
          isUseHovers ? (
            <ProfileTile
              image={image}
              isTile={isTile}
              profileName={profileName}
              isModerator={isModerator}
              isOwner={isOwner}
              address={ethAddr}
            />
          ) : (
            <ProfileTile
              image={image}
              isTile={isTile}
              profileName={profileName}
              isModerator={isModerator}
              isOwner={isOwner}
              address={ethAddr}
            />
          )
        }
      </React.Fragment>
    )
  }
}

export default ProfilePicture;

const ProfileTile = ({ image, isTile, profileName, isModerator, isOwner, address }) => (
  <div className="profileTile">
    <div className="profileTile_info">
      <a href={`https://3box.io/${address}`} className="profileTile_info_link" target="_blank" rel="noopener noreferrer">
        {image ? (
          <img
            src={image}
            className="profileTile_info_image profileTile_info_image-transparent"
            alt="profile"
          />
        ) : <div className="profileTile_info_image" />}

        {isTile && (
          <p>{profileName}</p>
        )}
      </a>
    </div>

    {isOwner && <p className="profileTile_creator">Creator</p>}
    {isModerator && <p className="profileTile_moderator">Mod</p>}
  </div>
);
