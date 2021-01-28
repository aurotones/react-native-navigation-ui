import React from "react";
import Proptypes from "prop-types";
import { Animated, TouchableWithoutFeedback, View, Text, PanResponder } from "react-native";
import { Navigation } from "react-native-navigation";
import FallBackIcon from "react-native-vector-icons/MaterialCommunityIcons";
import Touchable from "../Touchable";
import easingValue from "../../utils/easingValue";
import isIPhoneX from "../../utils/isIPhoneX";
import makeId from "../../utils/makeId";

const defaultProps = {
    title: null,
    sheets: [],
    onPress: () => {},
    fadeTime: 200,
    backDrop: true,
    borderRadius: 18,
    isClosing: false
};

class BottomSheets extends React.Component {
    static options = {
        layout: {
            backgroundColor: "transparent"
        },
        screenBackgroundColor: "transparent",
        modalPresentationStyle: "overCurrentContext",
    }
    static defaultProps = defaultProps;
    constructor(props){
        super(props);
        this.state = {
            height: new Animated.Value(0),
            opacity: new Animated.Value(0),
            draggedHeight: null,
            dragging: false,
            key: "bottom-sheets-" + new Date().getTime() + makeId()
        };
        let previousHeight = 0;
        let velocity = 0;
        let buttonHeight = (this.props.sheets.length * 45) + 5;
        if (typeof title === "string" && title !== null){
            buttonHeight += 36;
        }
        if (isIPhoneX){
            buttonHeight += 10;
        }
        const onPanResponderRelease = (e,gestureState) => {
            let draggedHeight = gestureState.moveY - gestureState.y0;
            if ((draggedHeight / buttonHeight) >= 0.5){
                this.close();
            } else {
                if (velocity >= 10){
                    this.close();
                } else {
                    Animated.timing(
                        this.state.height,{
                            toValue: 1,
                            duration: props.fadeTime,
                            easing: easingValue.accelerate
                        }
                    ).start();
                }
            }
        };
        // noinspection JSUnusedGlobalSymbols, JSUnusedLocalSymbols
        this.panResponder = PanResponder.create({
            onMoveShouldSetPanResponder: (evt, gestureState) => {
                const { dy } = gestureState;
                return dy > 4 || dy < -4
            },
            onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => false,
            onPanResponderMove: (e,gestureState) => {
                let draggedHeight = gestureState.moveY - gestureState.y0;
                let value;
                if (draggedHeight < 1){
                    let spring = 2.2 * (buttonHeight - draggedHeight) / buttonHeight;
                    value = (buttonHeight - (draggedHeight / spring)) / buttonHeight;
                } else {
                    value = (buttonHeight - draggedHeight) / buttonHeight;
                }
                if (value <= 0){
                    value = 0;
                }
                Animated.timing(this.state.height,{
                    toValue: value,
                    duration: 1
                }).start();
                velocity = draggedHeight - previousHeight;
                previousHeight = draggedHeight;
            },
            onPanResponderRelease: onPanResponderRelease,
            onPanResponderTerminate: onPanResponderRelease,
            onPanResponderTerminationRequest: (evt, gestureState) => true,
            onShouldBlockNativeResponder: (evt, gestureState) => {
                return false;
            },
        });
    }
    componentDidMount(){
        const { fadeTime } = this.props;
        Animated.timing(
            this.state.opacity,{
                toValue: 1,
                duration: fadeTime,
                easing: easingValue.accelerate
            }
        ).start();
        Animated.timing(
            this.state.height,{
                toValue: 1,
                duration: fadeTime,
                easing: easingValue.accelerate
            }
        ).start();
    }
    onBackDrop(){
        const { backDrop, isClosing } = this.props;
        if (!isClosing)
        if (backDrop){
            this.close();
        }
    }
    close(){
        const { componentId, fadeTime } = this.props;
        this.setState({
            isClosing: true
        },() => {
            Animated.timing(
                this.state.height,{
                    toValue: 0,
                    duration: fadeTime,
                    easing: easingValue.decelerate
                }
            ).start();
            Animated.timing(
                this.state.opacity,{
                    toValue: 0,
                    duration: fadeTime,
                    easing: easingValue.decelerate
                }
            ).start(() => {
                setTimeout(() => {
                    Navigation.dismissOverlay(componentId)
                        .then()
                        .catch((err) => {

                        });
                },100);
            });
        });
    }
    render(){
        const { title, sheets, onPress } = this.props;
        const { isClosing } = this.state;
        return (
            <View style={this.style().cont} pointerEvents={isClosing ? "none" : "auto"}>
                <Animated.View
                    style={this.style().backdrop}
                    {...this.panResponder.panHandlers}
                >
                    <TouchableWithoutFeedback onPress={this.onBackDrop.bind(this)}>
                        <View style={{flex: 1}}/>
                    </TouchableWithoutFeedback>
                </Animated.View>
                <Animated.View
                    style={this.style().sheet.cont}
                    {...this.panResponder.panHandlers}
                    pointerEvents="auto"
                >
                    <View style={{paddingTop: 5}}>
                        {
                            title !== null ? (
                                <View style={this.style().title.cont}>
                                    <Text style={this.style().title.self}>
                                        { title }
                                    </Text>
                                </View>
                            ) : null
                        }
                        {
                            sheets.map((button,i) => {
                                let Icon = FallBackIcon;
                                if (typeof button.iconComponent === "object" && button.iconComponent !== null){
                                    // noinspection JSUnusedAssignment
                                    Icon = button.iconComponent;
                                }
                                return (
                                    <View
                                        key={this.state.key + "-" + i}
                                        style={this.style().sheet.sub}
                                    >
                                        <Touchable
                                            style={this.style().sheet.button}
                                            onPress={() => {
                                                onPress(i);
                                                this.close();
                                            }}
                                        >
                                            <View style={this.style().sheet.icon.cont}>
                                                <Icon
                                                    name={button.iconName}
                                                    color={button.iconColor || "#888"}
                                                    size={24}
                                                    { ...button.iconProps }
                                                    style={this.style().sheet.icon.self}
                                                />
                                            </View>
                                            <View style={this.style().sheet.label.cont}>
                                                <Text style={this.style().sheet.label.self}>
                                                    { button.label }
                                                </Text>
                                            </View>
                                        </Touchable>
                                    </View>
                                )
                            })
                        }
                    </View>
                </Animated.View>
            </View>
        )
    }
    style(){
        const { title, sheets, borderRadius } = this.props;
        const { opacity } = this.state;
        let buttonHeight = (sheets.length * 45) + 5;
        if (typeof title === "string" && title !== null){
            buttonHeight += 36;
        }
        if (isIPhoneX){
            buttonHeight += 20;
        }
        let height = this.state.height.interpolate({
            inputRange: [0, 1],
            outputRange: [0, buttonHeight]
        });
        return {
            cont: {
                flex: 1,
                position: "relative",
            },
            backdrop: {
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.7)",
                opacity: opacity
            },
            title: {
                cont: {
                    paddingTop: 5,
                    paddingHorizontal: 24,
                    height: 36,
                    justifyContent: "center",
                },
                self: {
                    fontSize: 13,
                    color: "#888",
                }
            },
            sheet: {
                cont: {
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: height,
                    backgroundColor: "#fff",
                    borderTopLeftRadius: borderRadius,
                    borderTopRightRadius: borderRadius,
                    overflow: "hidden"
                },
                sub: {
                    marginHorizontal: 5,
                    marginBottom: 5,
                    borderRadius: 14,
                    overflow: "hidden",
                },
                button: {
                    flexDirection: "row",
                    paddingHorizontal: 10,
                    height: 40,
                    alignItems: "center",
                    //backgroundColor: "#aaa"
                },
                icon: {
                    cont: {
                        paddingHorizontal: 5,
                        height: 38,
                        justifyContent: "center",
                        alignItems: "center"
                    },
                    self: {
                        height: 24
                    }
                },
                label: {
                    cont: {
                        flex: 1,
                        paddingLeft: 8,
                        justifyContent: "center",
                    },
                    self: {

                    }
                }
            }
        }
    }
}

BottomSheets.propType = {
    sheets: Proptypes.array.required,
    onPress: Proptypes.func,
    fadeTime: Proptypes.number,
    backdrop: Proptypes.bool
};

module.exports = BottomSheets;