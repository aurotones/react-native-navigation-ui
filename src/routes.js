import React from "react";
import { Navigation } from "react-native-navigation";
import { BottomSheets, Dialog, Snack } from "../module";

import Home from "./views/pages/Home";

export default function setRoutes(){

    function register(id,component){
        Navigation.registerComponent(id, () => component);
    }

    //UI Component
    register("bottom-sheets",BottomSheets);
    register("dialog",Dialog);
    register("snack",Snack);

    //Pages
    register("main.home",Home);

}