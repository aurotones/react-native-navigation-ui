import React from "react";
import PropTypes from "prop-types";
import { View, TouchableOpacity, TouchableNativeFeedback, Platform } from "react-native";
import isIOS from "../../utils/isIOS";

class Touchable extends React.Component {

    renderRegular(){
        const { onPress, onPressIn, onLongPress, children } = this.props;
        const style = {
            ...this.props.style
        };
        return (
            <TouchableOpacity
                style={style}
                onPress={ () => onPress() }
                onPressIn={ () => onPressIn() }
                onLongPress={ () => onLongPress() }
                activeOpacity={0.3}
            >
                { children }
            </TouchableOpacity>
        )
    }

    renderNative(){
        const { onPress, onPressIn, onLongPress, rippleColor, rippleBorder, children } = this.props;
        const style = {
            borderRadius: 4,
            overflow: "hidden",
            ...this.props.style
        };
        return (
            <View style={this.props.nativeStyle}>
                <TouchableNativeFeedback
                    onPress={ () => onPress() }
                    onPressIn={ () => onPressIn() }
                    onLongPress={ () => onLongPress() }
                    background={TouchableNativeFeedback.Ripple(rippleColor,rippleBorder)}
                    useForeground={false}
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
    onLongPress: () => {},
    style: {},
    nativeStyle: {}
};

Touchable.propTypes = {
    rippleColor: PropTypes.string,
    rippleBorder: PropTypes.bool,
    style: PropTypes.object,
    nativeStyle: PropTypes.object,
    onPress: PropTypes.func,
    onPressIn: PropTypes.func,
    onLongPress: PropTypes.func,
    children: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array,
        PropTypes.element,
    ])
};

export default Touchable;