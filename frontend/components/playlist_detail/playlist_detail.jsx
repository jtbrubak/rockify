import React from 'react';
import { Link } from 'react-router';

class PlaylistDetail extends React.Component {

  constructor(props) {
    super(props);
    this.handleDelete = this.handleDelete.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.followStatus = this.followStatus.bind(this);
    this.toggleFollow = this.toggleFollow.bind(this);
    this.handlePlaylistButton = this.handlePlaylistButton.bind(this);
    this.handleTrackButton = this.handleTrackButton.bind(this);
  }

  componentWillMount() {
    this.props.fetchPlaylistDetail(this.props.id);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.id !== nextProps.id) {
      this.props.fetchPlaylistDetail(nextProps.id);
    }
  }

  handleDelete() {
    this.props.deletePlaylist(this.props.id).then(() => {
      this.props.router.replace('/browse/artists');
      location.reload(true);
    });
  }

  renderButton() {
    if (this.props.currentUser) {
      if (this.props.playlistDetail.user.id === this.props.currentUser.id) {
        return (
          <button className="play-playlist-button" onClick={this.handleDelete}>DELETE</button>
        );
      } else {
        return (
          <button className="play-playlist-button" onClick={this.toggleFollow}>{this.followStatus()}</button>
        );
      }
    }
  }

  handlePlaylistButton() {
    this.props.updateNowPlaying({ played: [], queue: this.props.playlistDetail.tracks });
  }

  handleTrackButton(i) {
    const tracks = this.props.playlistDetail.tracks;
    this.props.updateNowPlaying({ played: tracks.slice(0, i), queue: tracks.slice(i) });
  }

  toggleFollow() {
    if (this.followStatus() === "FOLLOW") {
      this.props.createPlaylistFollow({ playlist_follow: { user_id: this.props.currentUser.id, playlist_id: this.props.playlistDetail.id } });
    } else {
      this.props.deletePlaylistFollow({ playlist_follow: { user_id: this.props.currentUser.id, playlist_id: this.props.playlistDetail.id } });
    }
  }

  followStatus() {
    if (this.props.currentUserDetail) {
      let status = "FOLLOW";
      this.props.currentUserDetail.followed_playlists.forEach((playlist) => {
        if ( playlist.id === this.props.playlistDetail.id) {
          status = "UNFOLLOW";
        }
      });
      return status;
    }
  }

  renderInfo(playlist) {
    const image_url = "http://greenlea.ru/Articles-Directory/Online-Dating-the-First-Step-Is-Your-Profile/i0099rp.jpg";
    if (playlist.tracks) {
      return (
        <div className="left-side">
          <img src={image_url}/><br/>
          <span id="playlist-title">{playlist.title}<br/></span>
          <span id="playlist-info">
            By <Link to={`/user/${playlist.user.id}/playlists`}>{playlist.user.username}<br/></Link>
          </span>
          <span id="playlist-info">{playlist.tracks.length} SONGS</span>
          <button onClick={this.handlePlaylistButton} className="play-playlist-button">PLAY</button>
          {this.renderButton()}
        </div>
      );
    }
  }

  removeTrack(id) {
    this.props.removeTrack(id);
  }

  renderTracks(playlist) {
    if (playlist.tracks) {
      return (
        <div className="track-list">
          <ol>
            {playlist.tracks.map((track, i) =>
              <li key={i+1} onDoubleClick={() => this.handleTrackButton(i)}>
                <div className="playlist-track-display">
                  <div className='before-track-name'>
                    <button className='play-pause-button'>
                      <span className='track-num'>{i+1}.</span>
                      <span onClick={() => this.handleTrackButton(i)} className='play-button'></span>
                    </button>
                  </div>
                  <div className="track-list-left-side">
                    <div className="first-line">
                      <span id="track-title">{track.title}</span>
                    </div>
                    <div className="second-line">
                      <Link to={`/artist/${track.artist.id}`}><span>{track.artist.name}</span></Link>
                      <span>·</span>
                      <Link to={`album/${track.album.id}`}><span>{track.album.title}</span></Link>
                    </div>
                  </div>
                </div>
                <div className="track-list-right-side">
                  <i onClick={() => this.removeTrack(track.id)} className="material-icons">delete</i>
                  <span id="track-length">{this.renderLength(track)}</span>
                </div>
              </li>)
            }
          </ol>
        </div>
      );
    }
  }

  renderLength(track) {
    const seconds = track.length % 60 < 10 ? `0${track.length % 60}` : track.length % 60;
    return `${Math.floor(track.length / 60)}:${seconds}`;
  }

  render() {
    const playlist = this.props.playlistDetail;
    return (
      <div className="content-box">
        <div className="playlist-detail">
          {this.renderInfo(playlist)}
          {this.renderTracks(playlist)}
        </div>
      </div>
    );
  }

}

export default PlaylistDetail;