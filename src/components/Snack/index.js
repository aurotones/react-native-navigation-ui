import React from "react";
import { Animated, View, Text } from "react-native";
import { Navigation } from "react-native-navigation";
import Touchable from "../../components/Touchable";
import styles from "../../utils/styles";

class Snack extends React.Component {
    static defaultProps = {
        text: "",
        timeout: 8000,
        rightButton: null
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
    componentDidMount(){
        const { timeout } = this.props;
        Animated.timing(
            this.state.opacity,{
                toValue: 1,
                duration: 100,
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
                duration: 200,
            }
        ).start(() => {
            setTimeout(() => {
                Navigation.dismissOverlay(this.props.componentId)
                .then()
                .catch((err) => {

                });
            },100);
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
            <View style={{ flex: 1 }} pointerEvents="box-none">
                <View style={{ flex: 1 }} pointerEvents="box-none"/>
                <Animated.View
                    pointerEvents="auto"
                    style={[style().snack.cont,{
                        opacity: opacity
                    }]}
                >
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <Text style={style().snack.text}>
                            { this.props.text }
                        </Text>
                    </View>
                    {
                        rightButton !== null ? (
                            <View>
                                <Button
                                    label={rightButtonText}
                                    onPress={() => {
                                        this.typeCheck("cancel");
                                    }}
                                />
                            </View>
                        ) : null
                    }
                </Animated.View>
            </View>
        );
    }
}

function Button(props){
    return (
        <Touchable style={style().button.cont} onPress={() => props.onPress()}>
            <Text style={style().button.self}>
                { props.label.toUpperCase() }
            </Text>
        </Touchable>
    )
}

function style(){
    return {
        snack: {
            cont: {
                flexDirection: "row",
                margin: 5,
                padding: 10,
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
                color: styles.getPrimaryColor()
            }
        }
    }
}

export default Snack;