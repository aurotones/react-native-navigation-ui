# Dialog

<img width="300" src="https://github.com/replecta/react-native-navigation-ui/blob/master/docs/img/Dialog.gif">

### Properties:

| Prop  | Default  | Type | Description |
| :------------ |:---------------:| :---------------:| :-----|
| fadeTime | 200 | number |  |
| eventId | null | string |  |
| iconComponent | MaterialCommunityIcons | Icon |  |
| iconProps | null | object |  |
| title | null | string |  |
| description | null | string |  |
| iconAlign | left | string |  |
| textAlign | left | string |  |
| iconInline | true | boolean |  |
| backDrop | true | boolean |  |
| ButtonLabel | Ok | string |  |
| leftbutton | null | object |  |
| rightButtons | [] | array |  |
| pending | false | boolean |  |
| pendingLabel | Please wait... | string |  |
| disableWarnings | false | boolean |  |
| useLayoutAnimation | false | boolean |  |

### Example:
```
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
                onPress: () => {
                    update();
                }
            },
            rightButtons: [
                { label: "Ignore", type: "cancel" },
                { label: "Update" },
            ],
        }
    }
}).then();
```

### Updating current modal:
Updating modal has to methods

| Prop | Default |
| ------------- | ----- |
| replace | Resets the existing props to it's default value |
| update | Updates the value you're overriding with |

```
import { eventEmitter } from "react-native-navigation-ui";

eventEmitter.emit("modal-1",{
    method: "replace",
    icon: {
        name: "check",
        color: "green"
    },
    title: "Done!",
    description: "Successfully updated!",
});

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
```
