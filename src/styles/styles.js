import { chest } from "../api";
import isIOS from "../utils/isIOS";

export default function styles(){
    let darkMode = chest.get("darkMode");
    return {
        flex: {
            flex: 1,
        },
        flexRow: {
            flexDirection: "row"
        },
        center: (jc = true,ai = false) => {
            return {
                ... jc ? { justifyContent: "center" } : { },
                ... ai ? { alignItems: "center" } : { }
            }
        }
    }
};