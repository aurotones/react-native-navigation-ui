# Snack

<img width="276" height="492" src="https://media.giphy.com/media/ZFKvxW4UhIDiPKceh0/giphy.gif">

### Properties:

| Prop  | Default  | Type | Description |
| :------------ |:---------------:| :---------------:| :-----|
| text | null | string | Text on the snack bar you wanna display |
| timeout | 8000 | number | Timeout of the snack bar to Dismiss |
| rightButton | null | object | WIP |
| offsetY | 0 | number | Useful for shifting up the snack bar for specific pages |

## Example:
```
Navigation.showOverlay({
    component: {
        name: "snack",
        passProps: {
            text: msg
        }
    },
}).then();
```
