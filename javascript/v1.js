let root = document.querySelector(':root');
let _getRootValue = (rName) => {
    let rootStyle = getComputedStyle(root);
    return rootStyle.getPropertyValue(rName);
};
let _setRootValue = (rName, rValue) => {
    root.style.setProperty(rName, rValue);
};


let changeAccentColor = (elemVal) => {
    dStyle = document.head.querySelector('style');
    dStyle.innerHTML =
        `
        html{
            filter: hue-rotate(${elemVal}deg);
        }
    `;
};

let changeRoundedCorners = (elemVal) => {
    _setRootValue('--chat-border-radius', elemVal + 'pt');
    _setRootValue('--chat-bg-rounded', (elemVal * 2) + 'pt');
    _setRootValue('--chat-desktop-rounded', (elemVal * 2) + 'pt');
    _setRootValue('--btnSendRounded', (elemVal * 2) + 'pt');

};

let checkValid = (elem) => {
    elem.value = elem.value.replace(/[<>`=|]/g, "");
};