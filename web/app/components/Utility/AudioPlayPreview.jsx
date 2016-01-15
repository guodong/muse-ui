import React from "react";
import {PropTypes} from "react";
import {Link} from "react-router";
import Immutable from "immutable";
import Translate from "react-translate-component";
import LoadingIndicator from "../LoadingIndicator";

class AudioPlayPreview extends React.Component {

    static propTypes = {
        previewUrl: React.PropTypes.string.isRequired,
    };

    static defaultProps = {
    }

    constructor(props) {
        super(props);

        this.state = {
            isLoaded: true, //false
            isError: false,
            isPlaying: false,
            progression: 0,
        };
    }

    setLoaded(loaded) {
        if (loaded == this._loaded)
            return;
        this.setState({isLoaded: loaded});
        if (loaded) {
            this.onLoaded();
        }
     }


    setError(error) {
        if (error == this.state.isError)
            return;
        this.setState({isError: error});
     }


    setPlaying(playing) {
        if (this.state.isPlaying == playing)
            return;
        this.setState({isPlaying: playing});
     }


    setProgression(progression) {
        if (progression >= 1) {
            this.pause();
            progression = 0;
        }
        this.setState({progression: progression});
     }


    pauseEvent(e) {
        this.pause();
     }


    updateEvent(e) {
        var playerElement = React.findDOMNode(this.refs.player); // TODO from e?
        this.setProgression(playerElement.currentTime / playerElement.duration);
        this.drawInCanvas(); //TODO: probably do elsewhere
     }


    drawInCanvas() {
        var canvas = React.findDOMNode(this.refs.canvas); // TODO from e?
        var context = canvas.getContext('2d');

        //var radius = this._DOMElement.offsetWidth / 2;
        var radius = canvas.offsetWidth / 2;
        canvas.width = radius * 2;
        canvas.height = radius * 2;
        context.clearRect(0, 0, radius * 2, radius * 2);

        if (this.state.progression > 0) {
            context.beginPath();
            var angle = this.state.progression * 2*Math.PI;
            var dtheta = 2*Math.PI/16;
            var radius1 = 0.5*radius;
            var radius2 = radius;
            for (var theta= 0; theta < angle; theta+= dtheta) {
                var sinTheta = Math.sin(theta)
                var cosTheta = Math.cos(theta)
                context.moveTo(radius + radius1*cosTheta,
                    radius + radius1*sinTheta);
                context.lineTo(radius + radius2*cosTheta,
                    radius + radius2*sinTheta);

            }
            context.lineWidth = 2;
            context.strokeStyle = 'rgba(0, 255, 255, 0.5)';
            context.stroke();
        }
     }


    play() {
        if (this.state.isPlaying)
            return;
        this.setPlaying(true);

        // Pause others
        // TODO - set element states to pause
        try {
            var audioElements = document.getElementsByTagName('audio');
            for(var i = 0; i < audioElements.length; i++) {
                audioElements[i].pause();
            }
        } catch(e) {}

        var playerElement = React.findDOMNode(this.refs.player);
        playerElement.addEventListener('timeupdate',  function(e) {this.updateEvent(e);}.bind(this), false);
        playerElement.addEventListener('pause',  function(e) {this.pause(e);}.bind(this), false);
        playerElement.play();
     }


    pause() {
        if (!this.state.isPlaying)
            return;
        this.setPlaying(false);
        this.drawInCanvas();

        React.findDOMNode(this.refs.player).pause();
     }


    playAction(event) {
        if (!this.state.isLoaded || this.state.isError)
            return;

        if (this.state.isPlaying)
            this.pause();
        else
            this.play();
     }


    render() {
        //<audio preload='none'/>;
        var className = 'previewPlayer';
        if (this.state.isPlaying)
            className += ' playing';
        if (this.state.isError)
            className += ' error';
        if (this.state.isLoaded)
            className += ' loaded';
        return (
            <a className={className} onClick={this.playAction.bind(this)}>
                <canvas ref="canvas"/>
                <audio ref="player" src={this.props.previewUrl}/>
            </a>
        );
    }
}

export default AudioPlayPreview;
