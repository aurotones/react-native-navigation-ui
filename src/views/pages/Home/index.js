import React from "react";
import { ScrollView, View, Text, Button } from "react-native";
import { Navigation } from "react-native-navigation";
import Slider from "../../../components/Slider"
import { eventEmitter } from "../../../../module";
class Home extends React.Component {
    state = {
        index: 0
    };
    dialog1(){
        const loading = () => {
            eventEmitter.emit("modal-1",{
                method: "replace",
                pending: true,
            });
            setTimeout(() => {
                eventEmitter.emit("modal-1",{
                    method: "replace",
                    icon: {
                        name: "check",
                        color: "green"
                    },
                    title: "Done!",
                    description: "Successfully updated!",
                });
            },1000)
        };
        const update = () => {
            eventEmitter.emit("modal-1",{
                method: "replace",
                title: "Are you sure?",
                leftButton: null,
                rightButtons: [
                    { label: "No", type: "cancel" },
                    {
                        label: "Yes",
                        onPress: () => {
                            loading();
                        }
                    },
                ]
            })
        };
        const replace = () => {
            eventEmitter.emit("modal-1",{
                method: "replace",
                title: "Are you sure?",
                leftButton: null,
                rightButtons: [
                    { label: "No", type: "cancel" },
                    { label: "Yes" },
                ]
            })
        };
        Navigation.showOverlay({
            component: {
                name: "dialog",
                passProps: {
                    eventId: "modal-1",
                    iconProps: {
                        name: "cloud-download",
                        size: 48,
                        style: {
                            paddingRight: 15
                        }
                    },
                    title: "New version v0.11 available!",
                    description: "Updating usually improves stability of overall app!",
                    iconAlign: "flex-start",
                    iconInline: true,
                    textAlign: "left",
                    backDrop: true,
                    leftButton: {
                        label: "Don't remind",
                        type: "cancel"
                    },
                    rightButtons: [
                        { label: "Ignore", type: "cancel" },
                        { label: "Update", onPress: () => {
                            update();
                        } },
                    ],
                }
            }
        }).then();
    }
    dialog2(){
        Navigation.showOverlay({
            component: {
                name: "dialog",
                passProps: {
                    title: "Hey!",
                    description: "Modal without assigning button props!",
                }
            }
        }).then();
    }
    overlay1(){
        Navigation.showOverlay({
            component: {
                name: "snack",
                passProps: {
                    text: "Test modal " + this.state.index,
                    rightButton: {
                        label: "Got it!",
                        type: "cancel"
                    }
                }
            }
        }).then();
        this.setState({
            index: this.state.index + 1
        });
    }
    bottomSheet(){
        Navigation.showOverlay({
            component: {
                name: "bottom-sheets",
                passProps: {
                    title: "Remove file from storage?",
                    sheets: [
                        {
                            label: "Move to trash",
                            iconName: "delete",
                        },
                        {
                            label: "Cancel",
                            iconName: "close",
                        }
                    ],
                    onPress: (index) => {
                        alert(index);
                    }
                }
            }
        }).then();
    }
    showDialog(){

    }
    render(){
        return (
            <ScrollView style={{flex: 1}}>
                <View style={{margin: 20}}>
                    <Button
                        title="Show dialog"
                        onPress={this.dialog1.bind(this)}
                    />
                </View>
            </ScrollView>
        );
    }
}

export default Home;