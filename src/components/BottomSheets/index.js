import React from "react";
import { Animated, TouchableWithoutFeedback, View, Text, PanResponder } from "react-native";
import { Navigation } from "react-native-navigation";
import FallBackIcon from "react-native-vector-icons/MaterialCommunityIcons";
import Touchable from "../Touchable";
import easingValue from "../../utils/easingValue";

const defaultProps = {
    fadeTime: 200,
    backDrop: true
};

class BottomSheets extends React.Component {
    static get options(){
        return {
            overlay: {
                interceptTouchOutside: false
            },
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
            if (draggedHeight >= buttonHeight){
                this.close();
            } else {
                if (velocity >= 15){
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
        this.panResponder = PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponderCapture: () => true,
            onPanResponderMove: (e,gestureState) => {
                let draggedHeight = gestureState.moveY - gestureState.y0;
                let value;
                if (draggedHeight < 1){
                    let spring = (buttonHeight - draggedHeight) / buttonHeight;
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
            onPanResponderTerminate: onPanResponderRelease
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
                    <TouchableWithoutFeedback onPress={this.close.bind(this)}>
                        <View style={{flex: 1}}/>
                    </TouchableWithoutFeedback>
                </Animated.View>
                <Animated.View
                    style={this.style().sheet.cont}
                    {...this.panResponder.panHandlers}
                >
                    {
                        sheets.map((button,i) => {
                            let Icon = FallBackIcon;
                            if (typeof button.iconComponent === "object" && button.iconComponent !== null){
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
                    borderTopLeftRadius: 15,
                    borderTopRightRadius: 15,
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

module.exports = BottomSheets;