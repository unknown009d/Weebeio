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

/* ChatScreen Maximum */
const botName = "Weebeio";

//LocalStorage variables
let askingName = false;
let formBusy = false;

let scrollToEnd = () => {
    document.getElementById('mainParent').scrollBy(0, document.getElementById('mainParent').scrollHeight);
    document.querySelector('body').scrollBy(0, document.querySelector('body').scrollHeight);
};

const loadingMessage = () => {
    const newMessage = document.createElement("div");
    newMessage.classList.add("messages");
    newMessage.classList.add("bot");
    newMessage.classList.add("lazy_load");
    const lazyLoad = document.createElement("div");
    lazyLoad.classList.add("lazy_loading");
    lazyLoad.innerHTML = `<div class='dots'></div>
                        <div class='dots'></div>
                        <div class='dots'></div>`;

    newMessage.appendChild(lazyLoad);

    if (document.getElementById('main').children.length > 0) {
        if (document.getElementById('main').lastElementChild.classList[1] == 'bot') {
            document.getElementById('main').lastElementChild.classList.remove("isLast");
        }
    }
    newMessage.classList.add("isLast");

    document.getElementById('main').appendChild(newMessage);
    scrollToEnd();
}

const deleteLoading = () => {
    document.querySelectorAll(".lazy_load").forEach(data => {
        data.parentNode.removeChild(data);
    });
}

const displayMessage = (chatFrom, elemValue) => {

    const tdate = new Date();
    const t_months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
    ]
    var t_days = [
        'Sun', 'Mon', 'Tues', 'Wed',
        'Thu', 'Fri', 'Sat'
    ];
    const isEmoji =
        /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gi;

    const newMessage = document.createElement("div");
    newMessage.classList.add("messages");
    newMessage.classList.add(chatFrom);

    if (document.getElementById('main').children.length > 0) {
        if (document.getElementById('main').lastElementChild.classList[1] == chatFrom) {
            document.getElementById('main').lastElementChild.classList.remove("isLast");
        }
    }
    newMessage.classList.add("isLast");

    const messageText = document.createElement("p");
    const messageDate = document.createElement("small");

    if (elemValue.length <= 4) {
        if (isEmoji.test(elemValue)) messageText.classList.add("singleWord");
    }

    messageDate.classList.add("date");

    // Message Added here
    if (chatFrom == 'bot') {
        let linkRegex = new RegExp('`' + "(.*)" + '`');
        let checkLinks = elemValue.match(linkRegex);
        let mainMessage = elemValue.replace(linkRegex, ' ');
        messageText.innerText += mainMessage;
        if (checkLinks != null) {
            let linkData = checkLinks[1].replace(/`/gi, '');
            linkData = linkData.split(' ');
            linkData.forEach(data => {
                messageText.append(document.createElement("br"));
                let linkHTML = document.createElement("a");
                linkHTML.href = data;
                linkHTML.target = "_blank";
                linkHTML.innerText += data;
                messageText.append(linkHTML);
            })
        }

    } else {
        messageText.innerText = elemValue;
    }


    let fullTime = t_days[tdate.getDay()] + " ";
    fullTime += tdate.getDate();
    if (tdate.getDate() != 1 || tdate.getDate() != 2 || tdate.getDate() != 3 || tdate.getDate() != 21 ||
        tdate
        .getDate() != 22 || tdate.getDate() != 23 || tdate.getDate() != 31) {
        fullTime += "th";
    } else {
        if (tdate.getDate() == 1) {
            fullTime += "st";
        } else if (tdate.getDate() == 2) {
            fullTime += "nd";
        } else if (tdate.getDate() == 3) {
            fullTime += "rd";
        } else if (tdate.getDate() == 21) {
            fullTime += "st";
        } else if (tdate.getDate() == 22) {
            fullTime += "nd";
        } else if (tdate.getDate() == 23) {
            fullTime += "rd";
        } else if (tdate.getDate() == 31) {
            fullTime += "st";
        }
    }
    fullTime += " " + t_months[tdate.getMonth()] + " ";
    fullTime += tdate.getFullYear() + ", ";
    fullTime += tdate.getHours() > 12 ? tdate.getHours() - 12 : tdate.getHours();
    fullTime += ":";
    fullTime += (tdate.getMinutes() < 10 ? ("0" + tdate.getMinutes()) : tdate.getMinutes()) + " ";
    fullTime += tdate.getHours() > 12 ? "pm" : "am";
    messageDate.innerText = fullTime;

    newMessage.appendChild(messageText);
    newMessage.appendChild(messageDate);

    document.getElementById('main').appendChild(newMessage);
}

const fetchData = async (url_req, url_dataSend) => {
    try {
        let errorMessage = JSON.stringify({
            message: "(-_-;) I told my developer to fix this part but that lazy dumb f'er didn't even look at this situation."
        });
        let res = await fetch(url_req, url_dataSend);
        if (res.status === 200) {
            return await res.json();
        }
        return JSON.parse(errorMessage);
    } catch (error) {
        console.error("Server Error(Code) : " + error);
        let errorMessage = JSON.stringify({
            message: "(~_~;) Dumb server just turned off itself. I hope you try again after some time.."
        });
        return JSON.parse(errorMessage);
    }
}

const getBotReply = async (userMessage, postFunc = () => {}) => {
    loadingMessage();
    let getDataR = await fetchData('http://192.168.29.86:5000/api/response', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            newMessage: userMessage
        })
    });
    if (getDataR == undefined) {
        deleteLoading();
        //TODO: Add server error message.
        return;
    }
    if (getDataR.message === "drb_cant") {
        getDataR =
            `(?????????????) 
            Sorry for the inconvinience but my developer is still incapable to make me understand this current situation. 
            
            Anyways I am here with some results from DuckDuckGo : \`https://duckduckgo.com/?q=${userMessage.replace(/[ ]/gi, "+")}\`
            `;
    } else {
        getDataR = getDataR.message;
    }
    setTimeout(() => {
        displayMessage("bot", getDataR);
        postFunc();
        deleteLoading();
        scrollToEnd();
    }, 40 * getDataR.length)
}

const getGreetingsTime = () => {
    let currentTime = new Date().getHours();
    let retVal = "";
    if (currentTime == 3) {
        retVal =
            "(o_-) Hey " + localStorage.getItem("username") +
            " you sure you aren't a ghost? \n\n(?????_???`)\nAsk me question so that i can figure out if you need my help...";
    } else if (currentTime == 0) {
        retVal = "??\\(-_-)/?? Get a sleep dumb f \n\n " + localStorage.getItem("username") +
            ", why the heck are you here at this point of time ?";
    } else if (currentTime < 12 && currentTime >= 04) {
        retVal = "\\(^???^)/ Good morning " + localStorage.getItem("username") +
            "\n\n Welcome back to your friendly neighbourhood bot.\n\nHow would you like me to help you?";
    } else if (currentTime >= 12 && currentTime < 15) {
        retVal = "( ?????????? ?????) \nGood Afternoon " + localStorage.getItem("username") +
            ", What can i do for you?";
    } else if (currentTime >= 15 && currentTime < 20) {
        retVal = "Good evening " + localStorage.getItem("username") +
            "! \n???(^o^)???\nHow would you like me to help  you ?";
    } else if (currentTime >= 20 && currentTime < 22) {
        retVal =
            "Good evening, more like goodnight.. \n" + localStorage.getItem("username") +
            " don't you think you should get a sleep now? ??\\_(???_???)_/??\n\nNevermind, what is it that brings you here right now?";
    } else if (currentTime >= 22 || currentTime < 04) {
        retVal = "??\\_(-_-)_/?? " + localStorage.getItem("username") +
            " can't you seriously get a sleep???\n\nAnyways what is it that brought you here to me?";
    } else {
        retVal = "Welcome back " + localStorage.getItem("username");
    }
    return retVal;
};

const popToast = (cusMsg, duration, mode = "normal") => {
    toast = document.getElementById("popToastMsg");
    if (!toast) {
        const popToastElement = document.createElement("div");
        popToastElement.id = "popToast";
        const popToastText = document.createElement("p");
        popToastText.classList.add("toast");
        popToastText.id = "popToastMsg";
        popToastElement.appendChild(popToastText);
        document.body.appendChild(popToastElement);
        popToast(cusMsg, duration, mode);
    } else {
        toast.classList.add(mode);
        toast.innerText = cusMsg;
        toast.classList.add("show");
        setTimeout(() => {
            toast.classList.remove("show")
        }, 800 + duration)
    }


};

if (document.getElementById("formMessage")) {
    document.getElementById("formMessage").addEventListener('submit', (e) => {
        e.preventDefault();
        if (!formBusy) {
            const userInput = document.getElementById('txtMessage').value;

            if (userInput.length > 0) {
                displayMessage("user", userInput);
                formBusy = true;
                scrollToEnd();

                // Below code is used for taking username and store it locally
                if (askingName) {
                    localStorage.setItem("username", userInput);
                    if (localStorage.getItem("username")) {
                        setTimeout(() => {
                            loadingMessage();
                            setTimeout(() => {
                                deleteLoading();
                                displayMessage("bot", "( ????????? )???\nSo your name is " +
                                    localStorage.getItem("username") +
                                    ". That's a good name you got..");
                                setTimeout(() => {
                                    loadingMessage();
                                    setTimeout(() => {
                                        deleteLoading();
                                        displayMessage("bot", getGreetingsTime());
                                        scrollToEnd();
                                        formBusy = false;
                                    }, 200 + (40 * getGreetingsTime()
                                        .length));
                                }, 1000);
                            }, 1000)
                        }, 500);
                    }
                    askingName = false;
                } else {
                    setTimeout(() => {
                        getBotReply(userInput, () => {
                            formBusy = false;
                        });
                    }, 200 + (100 * userInput.length));
                }

                document.getElementById('txtMessage').value = '';
                document.getElementById('txtMessage').focus();
            } else {
                document.getElementById('txtMessage').focus();
            }
        } else {
            document.getElementById('txtMessage').focus();
            scrollToEnd();
            popToast("Please wait for the bot to reply...", 2000);
        }
    })
}
const chat_mainPage = () => {
    document.getElementById('txtMessage').focus();
    loadingMessage();
    setTimeout(() => {
        deleteLoading();
        if (!localStorage.getItem("username")) {
            displayMessage("bot",
                `???\\(?????????)/???\nHeyyaa, I am ${botName}, your friendly neighbourhood bot.. \n
                What would you like me to call you with?`);
            askingName = true;
        } else {
            displayMessage("bot", getGreetingsTime());
        }
        scrollToEnd();
    }, 1000);
};


window.addEventListener('load', (e) => {
    if (document.getElementById("chatScreen")) {
        chat_mainPage();
    }

});