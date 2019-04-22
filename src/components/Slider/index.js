import React from "react";
import PropTypes from "prop-types";
import { Animated, View, PanResponder, Easing } from "react-native";

const easing = {
    accelerate: Easing.bezier(0.4, 0.0, 0.2, 1),
    decelerate: Easing.bezier(0.0, 0.0, 0.2, 1)
};

class Slider extends React.Component {
    static defaultProps = {
        value: 0,
        step: null,
        thumbHeight: 30,
        thumbBorder: 1.5,
        thumbColor: "#2196f3",
        trackHeight: 4,
        trackColor: "#2196f3",
        trackInactiveColor: "#ddd",
        onSlideMove: () => {},
        onSlideRelease: () => {},
        getValueWhileMoving: false
    };
    constructor(props){
        super(props);
        let possibleValues = [];
        let temp = 0;
        for (let i = 1; i <= props.step; i++){
            temp = i / props.step;
            possibleValues.push(temp);
        }
        this.state = {
            width: null,
            ready: false,
            elementPosition: null,
            position: new Animated.Value(0),
            thumbSize: new Animated.Value(0),
            possibleValues: possibleValues,
            stepGaps: (1 / props.step) / 2
        };
        let finalValue = null;
        const onPanResponderRelease = () => {
            this.props.onSlideRelease(finalValue);
            this.setState({
                dragging: false
            });
            Animated.timing(this.state.thumbSize,{
                toValue: 0,
                duration: 100,
                easing: easing.decelerate
            }).start();
        };
        // noinspection JSUnusedGlobalSymbols, JSUnusedLocalSymbols
        this.panResponder = PanResponder.create({
            onMoveShouldSetPanResponder: (e, gestureState) => {
                const { dx, dy } = gestureState;
                return dx > 4 || dx < -4 || dy > 4 || dy < -4
            },
            onStartShouldSetPanResponderCapture: (e, gestureState) => false,
            onMoveShouldSetPanResponderCapture: (e, gestureState) => true,
            onPanResponderMove: (e,gestureState) => {
                if (!this.state.dragging){
                    Animated.timing(this.state.thumbSize,{
                        toValue: 1,
                        duration: 100,
                        easing: easing.accelerate
                    }).start();
                }
                this.setState({
                    dragging: true
                },() => {
                    const possibleValues = this.state.possibleValues;
                    const step = this.props.step;
                    const stepGaps = this.state.stepGaps;
                    const totalWidth = this.state.width;
                    let thumbHeight = this.props.thumbHeight;
                    let sliderPosition = gestureState.moveX - this.state.elementPosition;
                    let value = (sliderPosition - (thumbHeight / 2)) / (totalWidth - thumbHeight);
                    if (value <= 0){
                        value = 0;
                    } else if (value >= 1){
                        value = 1;
                    }
                    if (step !== null){
                        possibleValues.map((stepValue) => {
                            if (value + stepGaps > stepValue && value - stepGaps < stepValue){
                                if (this.props.getValueWhileMoving){
                                    this.props.onSlideMove(stepValue);
                                }
                                finalValue = stepValue;
                                Animated.timing(this.state.position,{
                                    toValue: stepValue,
                                    duration: 0,
                                }).start();
                            } else {
                                if (value < (possibleValues[0] - stepGaps)){
                                    finalValue = 0;
                                    if (this.props.getValueWhileMoving){
                                        this.props.onSlideMove(0);
                                    }
                                    Animated.timing(this.state.position,{
                                        toValue: 0,
                                        duration: 0,
                                    }).start();
                                }
                            }
                        });
                    } else {
                        finalValue = value;
                        if (this.props.getValueWhileMoving){
                            this.props.onSlideMove(value);
                        }
                        Animated.timing(this.state.position,{
                            toValue: value,
                            duration: 0,
                        }).start();
                    }
                });
            },
            onPanResponderRelease: onPanResponderRelease,
            onPanResponderTerminate: onPanResponderRelease,
            onPanResponderTerminationRequest: (e, gestureState) => false,
            onShouldBlockNativeResponder: (e, gestureState) => {
                return false;
            },
        });
    }
    componentWillReceiveProps(nextProps,nextContext){

    }
    onLayout(e){
        this.setState({
            ready: true,
            width: e.nativeEvent.layout.width,
            elementPosition: e.nativeEvent.layout.x
        });
    }
    render(){
        return (
            <View
                style={this.style().cont}
                onLayout={this.onLayout.bind(this)}
                {...this.panResponder.panHandlers}
            >
                <Animated.View style={this.style().thumb.cont}>
                    <Animated.View style={this.style().thumb.self}/>
                </Animated.View>
                <View style={this.style().track.cont}>
                    <Animated.View style={this.style().track.self}/>
                </View>
            </View>
        );
    }
    style(){
        const {
            containerStyle,
            thumbHeight,
            thumbBorder,
            thumbColor,
            trackHeight,
            trackColor,
            trackInactiveColor
        } = this.props;
        const { width, ready, position, thumbSize } = this.state;
        let left = position.interpolate({
            inputRange: [0, 1],
            outputRange: [0, width - thumbHeight]
        });
        let thumb = thumbSize.interpolate({
            inputRange: [0, 1],
            outputRange: [thumbHeight / 2, thumbHeight / 1.2]
        });
        let thumbBorderSize = thumbSize.interpolate({
            inputRange: [0, 1],
            outputRange: [(thumbHeight / thumbBorder) / 2, thumbHeight / thumbBorder]
        });
        // noinspection JSSuspiciousNameCombination
        return {
            cont: {
                position: "relative",
                height: thumbHeight,
                ... ready ? { width } : { },
                ... containerStyle
            },
            thumb: {
                cont: {
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: left,
                    width: thumbHeight,
                    height: thumbHeight,
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 2
                },
                self: {
                    width: thumb,
                    height: thumb,
                    borderRadius: thumbBorderSize,
                    backgroundColor: thumbColor
                }
            },
            track: {
                cont: {
                    position: "absolute",
                    height: trackHeight,
                    top: (thumbHeight / 2) - (trackHeight / 2),
                    left: thumbHeight / 2,
                    right: thumbHeight / 2,
                    backgroundColor: trackInactiveColor,
                    borderRadius: trackHeight / 2,
                    overflow: "hidden",
                    zIndex: 1,
                },
                self: {
                    width: left,
                    height: trackHeight,
                    backgroundColor: trackColor
                }
            }
        }
    }
}

Slider.propTypes = {
    step: PropTypes.number,
    thumbHeight: PropTypes.number,
    thumbBorder: PropTypes.number,
    thumbColor: PropTypes.string,
    trackHeight: PropTypes.number,
    trackColor: PropTypes.string,
    trackInactiveColor: PropTypes.string,
    onSlideMove: PropTypes.func,
    onSlideRelease: PropTypes.func,
    getValueWhileMoving: PropTypes.bool
};

module.exports = Slider;