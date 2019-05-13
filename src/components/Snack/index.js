import React from "react";
import { Animated, View, Text, KeyboardAvoidingView } from "react-native";
import { Navigation } from "react-native-navigation";
import Touchable from "../../components/Touchable";
import styles from "../../utils/styles";
import easingValue from "../../utils/easingValue";
import isIPhoneX from "../../utils/isIPhoneX";
import isIOS from "../../utils/isIOS";

class Snack extends React.Component {
    static defaultProps = {
        text: "",
        timeout: 8000,
        rightButton: null,
        offsetY: 0
    };
    static get options(){
        return {
            overlay: {
                interceptTouchOutside: false
            },
            layout: {
                backgroundColor: "transparent"
            }
        }
    }
    constructor(props){
        super(props);
        let rightButtonText = "Ok";
        if (typeof props === "object"){
            if (props.rightButton !== null){
                if (typeof props.rightButton.label === "string"){
                    rightButtonText = props.rightButton.label;
                }
            }
            this.state = {
                opacity: new Animated.Value(0),
                rightButtonText: rightButtonText
            }
        }
    }
    componentDidMount(){
        const { timeout } = this.props;
        Animated.timing(
            this.state.opacity,{
                toValue: 1,
                duration: 200,
                easing: easingValue.accelerate
            }
        ).start(() => {
            setTimeout(() => {
                this.close();
            },timeout);
        });
    }
    close(){
        Animated.timing(
            this.state.opacity,{
                toValue: 0,
                duration: 300,
                easing: easingValue.decelerate
            }
        ).start(() => {
            setTimeout(() => {
                Navigation.dismissOverlay(this.props.componentId)
                    .then()
                    .catch((err) => {

                    });
            },200);
        });
    }
    typeCheck(type){
        switch (type){
            case "cancel":
                this.close();
        }
    }
    render(){
        let { rightButton } = this.props;
        let { opacity, rightButtonText } = this.state;
        return (
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={ isIOS ? "padding" : null }
                pointerEvents="box-none"
            >
                <View style={{ flex: 1 }} pointerEvents="box-none"/>
                <Animated.View
                    pointerEvents="auto"
                    style={[this.style().snack.cont,{
                        opacity: opacity
                    }]}
                >
                    <View style={{ flex: 1, justifyContent: "center" }}>
                        <Text style={this.style().snack.text}>
                            { this.props.text }
                        </Text>
                    </View>
                    {
                        rightButton !== null ? (
                            <View>
                                <Button
                                    style={this.style.bind(this)}
                                    label={rightButtonText}
                                    onPress={() => {
                                        this.typeCheck("cancel");
                                    }}
                                />
                            </View>
                        ) : null
                    }
                </Animated.View>
            </KeyboardAvoidingView>
        );
    }
    style(){
        return {
            snack: {
                cont: {
                    flexDirection: "row",
                    marginHorizontal: 5,
                    marginTop: 5,
                    marginBottom: isIPhoneX ? 21 : 5,
                    padding: 10,
                    marginBottom: 5 + this.props.offsetY,
                    minHeight: 46,
                    backgroundColor: "#333",
                    borderRadius: 10,
                    justifyContent: "center",
                },
                text: {
                    margin: 6,
                    color: "#fff"
                }
            },
            button: {
                sub: {
                    flexDirection: "row",
                    paddingHorizontal: 10,
                    paddingBottom: 10,
                },
                cont: {
                    paddingVertical: 5,
                    paddingHorizontal: 10,
                    minWidth: 48,
                    minHeight: 32,
                    justifyContent: "center",
                    alignItems: "center"
                },
                self: {
                    color: "#fff"
                }
            }
        }
    }
}

function Button(props){
    return (
        <Touchable style={props.style().button.cont} onPress={() => props.onPress()}>
            <Text style={props.style().button.self}>
                { props.label.toUpperCase() }
            </Text>
        </Touchable>
    )
}

module.exports = Snack;