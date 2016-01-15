import React from "react";
import {PropTypes} from "react";
import {Link} from "react-router";
import Immutable from "immutable";
import Translate from "react-translate-component";
import LoadingIndicator from "../LoadingIndicator";
import AudioPlayPreview from './AudioPlayPreview';

class AudioTrackItem extends React.Component {

     static propTypes = {
         trackHTML: React.PropTypes.string.isRequired,
         trackHref: React.PropTypes.string.isRequired,
         artistHTML: React.PropTypes.string.isRequired,
         previewUrl: React.PropTypes.string.isRequired,
     };

     static defaultProps = {
         trackHTML: 'Loading…',
         trackHref: '#',
         artistHTML: 'Please wait',
     };

/*
     constructor(props) {
         super(props);
     }
     */

    /*
     // A player using the previewPlayer but adding track and artist name
     var TrackItem = function(searchTerms, cacheResult) {

     this._player = new previewPlayer(searchTerms, cacheResult);

     // Delegate called when the player is loaded
     // Use this to get access to artist and track name
     }
     */
     //assert this.props.cache this.props.searchTerm

    /*
     // constructor

     if (cacheResult) {
     apiCallback.call(this, {results:[cacheResult], resultCount:1});
     } else {
     apiCall({term:searchTerms, limit:1, entity:'musicTrack'},
     apiCallback.bind(this));
     }

     var callbackCount = 0;

     apiCall: function(args, callback) {
     callbackCount++;

     var callbackName = 'iTunesSearchJSONPCallback'+callbackCount;
     window[callbackName] = function(data) {
     delete window[callbackName];
     callback(data);
     }
     args.callback = callbackName;

     var url = '';
     for(var arg in args) {
     url += (url == '') ? '?' : '&';
     url += encodeURIComponent(arg) + '=' + encodeURIComponent(args[arg]);
     }

     var scriptE = document.createElement('script');
     scriptE.src = 'http://itunes.apple.com/search' + url;
     document.head.appendChild(scriptE);
     //console.log('url ' + scriptE.src);
     },


     apiCallback: function(data) {
     try {
     if (data && data.resultCount >= 1 && data.results.length >= 1) {
     setError.call(this, false);
     var result = data.results[0];
     this._artistName   = result.artistName;
     this._trackName    = result.trackName;
     this._trackViewUrl = result.trackViewUrl;
     this._previewUrl   = result.previewUrl;
     this._audioPlayerE.src = this._previewUrl;

     //console.log('{' +
     //'trackName:"'    + result.trackName  + '", ' +
     //'artistName:"'   + result.artistName + '", ' +
     //'previewUrl:"'   + result.previewUrl + '", ' +
     //'trackViewUrl:"' + result.trackViewUrl + '", ' +
     //'}');
     //console.log('result ' + JSON.stringify(result, null));
     }
     else
     setError.call(this, true);
     }
     catch (e) {
     setError.call(this, true);
     }
     setLoaded.call(this, true);
     },

     onLoaded: function() {
     if (!this._player.isError()) {
     this._trackNameElement.innerHTML = this._player.trackName();
     this._artistNameElement.innerHTML = this._player.artistName();
     this._trackNameElement.href = this._player.trackViewUrl()
     }
     else {
     this._trackNameElement.innerHTML = 'Track not found';
     this._artistNameElement.innerHTML = '';
     }
     },
     */

    render() {
        return (
            <div className='trackItem'>
                <AudioPlayPreview previewUrl={this.props.previewUrl}/>
                <a className='track' href={this.props.trackHref}>{this.props.trackHTML}</a>
                <div className='artist'>{this.props.artistHTML}</div>
            </div>
        );
    }
}

export default AudioTrackItem;
