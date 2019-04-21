import { chest } from "../api";
import isIOS from "../utils/isIOS";

export default function colors(){
    let primary: boolean = chest.get("primary");
    let darkMode: boolean = chest.get("darkMode");
    return {
        backgroundColor: darkMode ? "rgb(41,44,47)" : "#fff",
        primary: primary
    }
};