import React from "react";
import PropTypes from "prop-types";
import { View, TouchableOpacity, TouchableNativeFeedback, Platform } from "react-native";
import isIOS from "../../utils/isIOS";

class Touchable extends React.Component {

    renderRegular(){
        const { onPress, children } = this.props;
        const style = {
            ...this.props.style
        };
        return (
            <TouchableOpacity
                style={style}
                onPress={ () => onPress() }
                activeOpacity={0.3}
            >
                { children }
            </TouchableOpacity>
        )
    }

    renderNative(){
        const { onPress, rippleColor, rippleBorder, children } = this.props;
        const style = {
            borderRadius: 4,
            overflow: "hidden",
            ...this.props.style
        };
        return (
            <View style={this.props.nativeStyle}>
                <TouchableNativeFeedback
                    onPress={ () => onPress() }
                    background={TouchableNativeFeedback.Ripple(rippleColor,rippleBorder)}
                    useForeground={true}
                >
                    <View style={style}>
                        { children }
                    </View>
                </TouchableNativeFeedback>
            </View>
        )
    }

    render(){
        if (isIOS){
            return this.renderRegular()
        } else {
            if (Platform.Version > 20){
                return this.renderNative()
            } else {
                return this.renderRegular()
            }
        }
    }

}

Touchable.defaultProps = {
    rippleColor: "#ddd",
    rippleBorder: false,
    onPress: () => {},
    onPressIn: () => {},
    style: {},
    nativeStyle: {}
};

Touchable.propTypes = {
    rippleColor: PropTypes.string,
    rippleBorder: PropTypes.bool,
    style: PropTypes.object,
    nativeStyle: PropTypes.object,
    onPress: PropTypes.func,
    children: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array,
        PropTypes.element,
    ])
};

export default Touchable;