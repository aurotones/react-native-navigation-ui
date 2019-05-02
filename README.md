# React Native Navigation UI (in development)

Aiming to be highly customizable UI elements made for React Native with additional components specifically made for `react-native-navigation` by Wix!

Currently in development and code may change in the future!

## Installation
This library requires you to have `react-native-vector-icons` installed.
```
npm install react-native-vector-icons
npm install react-native-navigation-ui
react-native link react-native-vector-icons
```

## How to use components made for RNN?

You can register them like this
```
import { Navigation } from "react-native-navigation";
import { BottomSheets, Dialog, Snack } from "react-native-navigation-ui";

Navigation.registerComponent("bottom-sheets",() => BottomSheets);
Navigation.registerComponent("dialog",() => Dialog);
Navigation.registerComponent("snack",() => Snack);
```
And display them like this

```
Navigation.showOverlay({
    component: {
        name: "dialog",
        passProps: {
            title: "Modal title!",
            description: "Write some description here!",
        }
    }
}).then();

Navigation.showOverlay({
    component: {
        name: "snack",
        passProps: {
            text: "Snack bar text",
            rightButton: {
                label: "Got it!",
                type: "cancel"
            }
        }
    }
}).then();
```

## Current available components

Component made for RNN will have star mark at the end.

- [BottomSheets](https://github.com/replecta/react-native-navigation-ui/blob/master/docs/BottomSheets.md) *
- Dialog *
- Slider
- [Snack](https://github.com/replecta/react-native-navigation-ui/blob/master/docs/Snack.md) *

## Requests

I accept **SOME** component requests that's UI related and not made already into the library. Open an issue and i will look into it.

## Contributing

Pull requests are welcome.
