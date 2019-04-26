### BottomSheets

| Prop  | Default  | Type | Description |
| :------------ |:---------------:| :---------------:| :-----|
| title | null | string or null | Displays title on top of the sheet (Optional) |
| sheets | [] | array | Sheet buttons. See the sheet button props below |
| onPress | () => {} | function | Returns the index of the pressed button |
| fadeTime | 200 | number | Transition time of the fade animation in milliseconds |
| backDrop | true | boolean | Determines when sheet should close if pressed outside the sheet |
| borderRadius | 18 | number | Border radiuses on the both left and right corder |

Sheet Button properties

| Prop  | Default  | Type | Description |
| :------------ |:---------------:| :---------------:| :-----|
| label | undefined | string | Button label |
| iconName | undefined | string | Name of the icon |
| iconComponent | MaterialCommunityIcons | Icon Component | Overrides the default Icon source |
| iconProps | undefined | object | Overrides the assigned Icon props |

Example:
```
Navigation.showOverlay({
    component: {
        name: "bottom-sheets",
        passProps: {
            title: "Remove file from storage?",
            sheets: [
                {
                    label: "Cancel",
                    iconName: "close",
                }
            ],
            onPress: (index) => {
                alert(index);
            }
        }
    }
}).then();
```
![](https://media.giphy.com/media/WojPozwnuq5aVAR0JE/giphy.gif)