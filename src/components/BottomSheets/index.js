import React from "react";
import Proptypes from "prop-types";
import { Animated, TouchableWithoutFeedback, View, Text, PanResponder } from "react-native";
import { Navigation } from "react-native-navigation";
import FallBackIcon from "react-native-vector-icons/MaterialCommunityIcons";
import Touchable from "../Touchable";
import easingValue from "../../utils/easingValue";

const defaultProps = {
    sheets: [],
    onPress: () => {},
    fadeTime: 200,
    backDrop: true
};

class BottomSheets extends React.Component {
    static get options(){
        return {
            layout: {
                backgroundColor: "transparent"
            },
            screenBackgroundColor: "transparent",
            modalPresentationStyle: "overCurrentContext",
        }
    }
    static defaultProps = defaultProps;
    constructor(props){
        super(props);
        this.state = {
            height: new Animated.Value(0),
            opacity: new Animated.Value(0),
            draggedHeight: null,
            dragging: false,
        };
        let previousHeight = 0;
        let velocity = 0;
        let buttonHeight = this.props.sheets.length * 48;
        const onPanResponderRelease = (e,gestureState) => {
            let draggedHeight = gestureState.moveY - gestureState.y0;
            if (draggedHeight >= buttonHeight || (draggedHeight / buttonHeight) >= 0.5){
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
                return dy > 3 || dy < -3
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
        const { backDrop } = this.props;
        if (backDrop){
            this.close();
        }
    }
    close(){
        const { componentId, fadeTime } = this.props;
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
    }
    render(){
        const { sheets, onPress } = this.props;
        return (
            <View style={this.style().cont}>
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
                    {
                        sheets.map((button,i) => {
                            let Icon = FallBackIcon;
                            if (typeof button.iconComponent === "object" && button.iconComponent !== null){
                                // noinspection JSUnusedAssignment
                                Icon = button.iconComponent;
                            }
                            return (
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
                            )
                        })
                    }
                </Animated.View>
            </View>
        )
    }
    style(){
        const { sheets } = this.props;
        const { opacity } = this.state;
        let buttonHeight = sheets.length * 48;
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
            sheet: {
                cont: {
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: height,
                    backgroundColor: "#fff",
                    borderTopLeftRadius: 18,
                    borderTopRightRadius: 18,
                    overflow: "hidden"
                },
                button: {
                    flexDirection: "row",
                    paddingHorizontal: 10,
                    height: 48,
                    alignItems: "center"
                },
                icon: {
                    cont: {
                        paddingHorizontal: 10,
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
                        paddingLeft: 6,
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