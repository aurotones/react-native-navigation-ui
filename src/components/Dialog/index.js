import React from "react";
import Proptypes from "prop-types";
import { LayoutAnimation, View, Text, Dimensions, TouchableWithoutFeedback, ActivityIndicator } from "react-native";
import { Navigation } from "react-native-navigation";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import NavBar from "react-native-navigation-bar-color";
import styles from "../../utils/styles";
import Touchable from "../../components/Touchable";
import isIOS from "../../utils/isIOS";
import Emitter from "../../utils/emitter";

const shadow = "#4c4c4c";
const scrX = Dimensions.get("window").width;
const scrY = Dimensions.get("window").height;

const defaultProps = {
    eventId: null,
    icon: null,
    title: null,
    description: null,
    textAlign: "left",
    backDrop: true,
    buttonLabel: "Ok",
    leftButton: null,
    rightButtons: [],
    pending: false,
    pendingLabel: "Please wait...",
    disableWarnings: false,
    useLayoutAnimation: false,
};

export default class Dialog extends React.Component {
    static get options(){
        return {
            statusBar: {
                backgroundColor: shadow
            },
            layout: {
                backgroundColor: "transparent"
            },
            screenBackgroundColor: "transparent",
            modalPresentationStyle: "overCurrentContext",
            animations: {
                showModal: {
                    enabled: true,
                    alpha: {
                        from: 0,
                        to: 1,
                    }
                },
                dismissModal: {
                    enabled: true,
                    alpha: {
                        from: 1,
                        to: 0,
                    }
                }
            }
        }
    }
    static defaultProps = defaultProps;
    constructor(props){
        super(props);
        if (props.eventId){
            Emitter.addListener(props.eventId,this.events.bind(this));
        }
        this.state = {
            eventId: props.eventId,
            icon: props.icon,
            title: props.title,
            description: props.description,
            textAlign: props.textAlign,
            backDrop: props.backDrop,
            buttonLabel: props.buttonLabel,
            leftButton: props.leftButton,
            rightButtons: props.rightButtons,
            pending: props.pending,
            pendingLabel: props.pendingLabel,
        };
    }
    componentWillMount(){
        if (!isIOS){
            NavBar(shadow,false);
        }
    }
    events(args){
        console.log(args);
        switch (args.method){
            case "update":
                this.update(args);
                break;
            case "replace":
                this.replace(args);
                break;
            default:
                console.error(
                    "Please specify event method! Accepts: [\"update\", \"replace\"]"
                );
        }
        if (this.props.useLayoutAnimation)
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut,() => {});
    }
    update(args){
        this.setState({
            ...args
        },() => {
            this.argsCheck();
        });
    }
    replace(args){
        this.setState({
            ... defaultProps,
            ... args
        },() => {
            this.argsCheck();
        });
    }
    argsCheck(){
        if (this.props.disableWarnings) return;
        if (typeof this.state.title !== "string"){
            console.warn("Dialog modal's title props should not be null or undefined!");
        }
    }
    close(){
        const { componentId } = this.props;
        Navigation.dismissModal(componentId).then().catch();
        if (!isIOS){
            NavBar("#ffffff",true);
        }
    }
    onBackDrop(){
        const { backDrop, pending } = this.state;
        if (!pending && backDrop){
            this.close();
        }
    }
    typeCheck(type){
        switch (type){
            case "cancel":
                this.close();
        }
    }
    render(){
        const { icon, textAlign, leftButton, rightButtons } = this.state;
        return (
            <View style={this.style().cont}>
                <TouchableWithoutFeedback onPress={this.onBackDrop.bind(this)}>
                    <View style={this.style().backDrop}/>
                </TouchableWithoutFeedback>
                {
                    this.state.pending ? (
                        <View style={this.style().card}>
                            <View style={{ flexDirection: "row" }}>
                                <ActivityIndicator
                                    size="large"
                                    color="#aaa"
                                />
                                {
                                    typeof this.state.pendingLabel === "string" ? (
                                        <View
                                            style={{
                                                flex: 1,
                                                marginLeft: 20,
                                                justifyContent: "center",
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 14,
                                                    color: "#000"
                                                }}
                                            >
                                                { this.state.pendingLabel }
                                            </Text>
                                        </View>
                                    ) : null
                                }
                            </View>
                        </View>
                    ) : (
                        <View style={this.style().card}>
                            <View style={this.style().sub}>
                                {
                                    icon !== null ? (
                                        <View style={this.style().iconContainer}>
                                            <Icon
                                                size={96}
                                                { ...icon }
                                            />
                                        </View>
                                    ) : null
                                }
                                <View>
                                    {
                                        typeof this.state.title === "string" ? (
                                            <Text
                                                style={[this.style().title,{ textAlign }]}
                                            >
                                                { this.state.title }
                                            </Text>
                                        ) : null
                                    }
                                    {
                                        typeof this.state.description === "string" ? (
                                            <Text style={[this.style().desc,{ textAlign }]}>
                                                { this.state.description }
                                            </Text>
                                        ) : null
                                    }
                                </View>
                            </View>
                            <View style={this.style().button.sub}>
                                {
                                    leftButton !== null ? (
                                        this.button({
                                            label: leftButton.label,
                                            onPress: () => {
                                                if (typeof leftButton.onPress === "function"){
                                                    leftButton.onPress();
                                                }
                                                this.typeCheck(leftButton.type);
                                            }
                                        })
                                    ) : null
                                }
                                <View style={{ flex: 1 }}/>
                                {
                                    rightButtons.length > 0 ? rightButtons.map((button,i) =>
                                        this.button({
                                            key: "dialog-btn" + i,
                                            label: button.label,
                                            onPress: () => {
                                                if (typeof button.onPress === "function"){
                                                    button.onPress();
                                                }
                                                this.typeCheck(button.type);
                                            }
                                        })
                                    ) : (
                                        this.button({
                                            label: this.state.buttonLabel,
                                            onPress: () => { this.typeCheck("cancel") }
                                        })
                                    )
                                }
                            </View>
                        </View>
                    )
                }
            </View>
        )
    }
    button(props){
        return (
            <Touchable style={this.style().button.cont} onPress={() => props.onPress()}>
                <Text style={this.style().button.self}>
                    { props.label.toUpperCase() }
                </Text>
            </Touchable>
        )
    }
    style(){
        return {
            cont: {
                position: "relative",
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.7)",
                justifyContent: "center",
                alignItems: "center"
            },
            backDrop: {
                position: "absolute",
                width: scrX,
                height: scrY,
            },
            sub: {
                padding: 20,
            },
            card: {
                paddingTop: this.state.pending ? 23 : 0,
                paddingBottom: this.state.pending ? 20 : 0,
                paddingHorizontal: this.state.pending ? 24 : 0,
                width: scrX - 60,
                maxWidth: 340,
                backgroundColor: "#fff",
                borderRadius: 10,
            },
            iconContainer: {
                marginBottom: 20,
                justifyContent: "center",
                alignItems: "center",
            },
            title: {
                fontSize: 16,
                fontWeight: "600",
                color: "#000"
            },
            desc: {
                marginTop: typeof this.state.title === "string" ? 12 : 5,
                fontSize: 14,
                color: "#777"
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
                    minHeight: 38,
                    justifyContent: "center",
                    alignItems: "center"
                },
                self: {
                    color: styles.getPrimaryColor()
                }
            }
        }
    }
}

Dialog.propType = {
    eventId: Proptypes.string,
    icon: Proptypes.object,
    title: Proptypes.string.required,
    description: Proptypes.string,
    textAlign: Proptypes.string,
    backDrop: Proptypes.bool,
    buttonLabel: Proptypes.string,
    leftButton: Proptypes.object,
    rightButtons: Proptypes.object,
    pending: Proptypes.bool,
    pendingLabel: Proptypes.string,
    disableWarnings: Proptypes.bool,
    useLayoutAnimation: Proptypes.bool,
};