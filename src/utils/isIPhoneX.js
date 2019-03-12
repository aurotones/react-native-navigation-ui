import { Dimensions, Platform } from "react-native";
import isIOS from "./isIOS";

function isiPhoneX(){
    const src = Dimensions.get("window");
    return (
        isIOS &&
        !Platform.isPad &&
        !Platform.isTVOS &&
        ((src.height === 812 || src.width === 812) || (src.height === 896 || src.width === 896))
    );
}

export default isiPhoneX();