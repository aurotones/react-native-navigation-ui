# Slider


### Properties:

| Prop  | Default  | Type | Description |
| :------------ |:---------------:| :---------------:| :-----|
| value | 0 | number | Accepts value from 0 to 1 |
| step | undefined | array | Sheet buttons. See the sheet button props below (Optional) |
| thumbHeight | 30 | number | Thumb height |
| thumbBorder | 1.5 | number | Thumb border radius |
| trackHeight | 4 | number | Track line height |
| thumbColor | #2196f3 | string | Thumb color |
| trackColor | #2196f3 | string | Track line color |
| trackInactiveColor | #2196f3 | string | Inactive part of the track line color |
| onSlideMove | () => {} | function | Calls when moving the slider |
| onSlideRelease | () => {} | function | Calls when moving slider releases |
| getValueWhileMoving | false | boolean | Enables onSlideMove function. Default value is false cause for performance |

### Example:
```
class SliderDemo extends React.Component {
    state = {
        index: 0,
        amount: 0
    };
    render(){
        let value = this.state.amount;
        let sliceBy = 50000; // amount you want to slice by
        let minValue = 50000; // min amount
        let maxValue = 1000000; // max amount
        let amount;
        let step = 0;
        let possibleValues = [];
        for (let i = minValue; i <= maxValue;){
            possibleValues.push(i);
            i += sliceBy;
            if (i !== maxValue){
                step++;
            }
        }
        amount = possibleValues[Math.round(value * step)];
        return (
            <View style={{flex: 1}}>
                <View style={{justifyContent: "center", alignItems: "center"}}>
                    <Text style={{fontSize: 24, color: "#000"}}>
                        { amount.toString() }
                    </Text>
                </View>
                <Slider
                    value={this.state.amount}
                    containerStyle={{
                        marginHorizontal: 20
                    }}
                    step={step}
                    getValueWhileMoving={true}
                    onSlideMove={(value) => {
                        this.setState({
                            amount: value
                        })
                    }}
                />
            </View>
        );
    }
}
```
