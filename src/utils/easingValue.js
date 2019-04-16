import { Easing } from "react-native";

export default {
    accelerate: Easing.bezier(0.4, 0.0, 0.2, 1),
    decelerate: Easing.bezier(0.0, 0.0, 0.2, 1)
}