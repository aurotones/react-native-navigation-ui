import { Navigation } from "react-native-navigation";
import setRoutes from "./routes";
import isIOS from "./utils/isIOS";

export default class App {
    static launch(){
        Navigation.events().registerAppLaunchedListener(() => {
            startApp();
        });
    }
}

function startApp(){
    setRoutes();
    setInitialStyle();
    Navigation.setRoot({
        root: {
            stack: {
                children: [{
                    component: {
                        name: "main.home"
                    }
                }]
            }
        }
    }).then(() => {});
}

function setInitialStyle(){
    Navigation.setDefaultOptions({
        ... !isIOS ? {
            statusBar: {
                backgroundColor: "#fff",
                style: "dark"
            }
        } : { },
        layout: {
            orientation: ["portrait"]
        },
        topBar: {
            visible: false,
            height: 0,
            noBorder: true
        }
    });
}