import React from "react";
import {PropTypes} from "react";
import {Link} from "react-router";
import Immutable from "immutable";
import Translate from "react-translate-component";
import LoadingIndicator from "../LoadingIndicator";
import AudioTrackItem from './AudioTrackItem';

require("./AudioPlayList.scss");

class AudioPlayList extends React.Component {

    /*
     static propTypes = {
       //tracks
       //cache
     };

     static defaultProps = {
     };

     constructor(props) {
     super(props);
     }
     */

    render() {
        var tracklist = [];
        var key=0;

        if (this.props.tracks) {
            this.props.tracks.forEach(function(searchTerm) {
                tracklist.push(<AudioTrackItem key={key++} searchTerm={searchTerm}/>);
            });
            // TODO: Save to cache
        } else if (this.props.cache) {
            this.props.cache.forEach(function(cache) {
                tracklist.push(<AudioTrackItem
                    key={key++}
                    trackHTML= {cache.trackName}
                    trackHref= {cache.trackViewUrl}
                    artistHTML= {cache.artistName}
                    previewUrl= {cache.previewUrl}
                />);
            });
        }

        return(<ul className='trackItems'>{tracklist}</ul>);
    }

}

export default AudioPlayList;
