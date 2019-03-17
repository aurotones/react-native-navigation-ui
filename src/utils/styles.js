let properties = {
    primaryColor: ""
};

module.exports = {
    getPrimaryColor: () => {
        return properties.primaryColor;
    },
    setPrimaryColor: (color) => {
        properties.primaryColor = color;
    }
}