//Set Variables
let section1 = document.querySelector(".section-1");
let section2 = document.querySelector(".section-2");
let section3 = document.querySelector(".section-3");
let section4 = document.querySelector(".section-4");
let openSetting = document.querySelector(".open-setting");
let closeSetting = document.querySelector(".close-setting");
let pomodoroControlBtns = document.querySelectorAll(".pomodoro-control button");
let allInputNumber = document.querySelectorAll(".all-input-number input");
let fontSettingSpans = document.querySelectorAll(".setting-font span");
let colorSettingSpans = document.querySelectorAll(".setting-color span");
let apllyButton = document.querySelector(".apply");
let countDownInterVal;
let alertMessage = document.querySelector(".section-3 h1");
let pomodoroCounterElement = document.querySelector(".pomodoro-count .count");


/* ----------------- Start Pomodoro ------------ */
//Start Pomodoro
document.querySelector(".start").onclick = function () {
    document.querySelector(".pomodoro-control .pomodoro").click();
    this.style.display = "none";
    document.querySelector(".click").play();
}

pomodoroControlBtns.forEach((button) => {
    button.addEventListener("click", () => {
        pomodoroControlBtns.forEach((ele) => {
            ele.classList.remove("active");
            
        });
        button.classList.add("active");
        clearInterval(countDownInterVal);
        pomodoroCounter(button.dataset.time * 60);
        section3.classList.add("hide");
        pauseButton.style.display = "block";
        document.querySelector(".start").style.display = "none";
        document.querySelector(".click").play();
    });
});

/* ------------------------- End Pomodoro ---------------------------- */



/* ------------------------- Start Local Storage --------------------- */
//Local Storage
if (localStorage.length > 0) {

    //Check If There's Local Storage pomodoro Item
    if (localStorage.getItem("pomodoro") !== null) {
        allInputNumber.forEach((element) => {
            element.value = localStorage.getItem(`${element.name}`);
        });
    }

    //Check If There's Local Storage Font Item
    if (localStorage.getItem("font_option") !== null) {
        document.documentElement.style.setProperty("--font-family-1", localStorage.getItem("font_option"));

        fontSettingSpans.forEach(element => {
            element.classList.remove("active");
            if (element.dataset.font == localStorage.getItem("font_option")) {
                element.classList.add("active");
            }
        });
    }

    //Check If There's Local Storage Color Item
    if (localStorage.getItem("color_option") !== null) {
        document.documentElement.style.setProperty("--background-alarm-1", localStorage.getItem("color_option"));

        colorSettingSpans.forEach(element => {
            element.innerHTML = "";
    
            if (element.dataset.color == localStorage.getItem("color_option")) {
                element.innerHTML = '<img src="./img/ckeck.svg" alt="check">';
            }
        });
    }
}
/* ------------------------- End Local Storage --------------------- */



/*-------------------------- Start Setting Box -----------------------*/

//Open Setting Box
openSetting.addEventListener("click", () => {
    showSection("none","block", "none");
    document.querySelector(".click").play();
});

//Close Setting Box
closeSetting.addEventListener("click", () => {
    showSection("flex","none", "block");
    //Set inputs Value To Last Save
    allInputNumber.forEach((element, index) => {
        pomodoroControlBtns.forEach((button, indx) => {
            if (index === indx) {
                element.value = button.dataset.time;
            }
        });
    });
});

//Set pomodoro Number, Short and break Number To His Button
setTimeToButtons();
apllyButton.addEventListener("click", () => {
    //Set Inputs Value To local Storage
    allInputNumber.forEach((element) => {
        localStorage.setItem(`${element.name}`, `${element.value}`);
    });
    
    setTimeToButtons();
    showSection("flex","none", "block");
    document.querySelector(".click").play();
});

//Handle Active Class in Font at Setting Box
fontSettingSpans.forEach((element) => {
    element.addEventListener("click", (e) => {
        fontSettingSpans.forEach((ele) => {
            ele.classList.remove("active");
        });
        element.classList.add("active");
        document.documentElement.style.setProperty("--font-family-1", `${e.target.dataset.font}`);
        localStorage.setItem("font_option", element.dataset.font);
        document.querySelector(".click").play();
    });
});

//Handle Active Class in Color at Setting Box
colorSettingSpans.forEach((element) => {
    element.addEventListener("click", (e) => {
        colorSettingSpans.forEach((ele) => {
            ele.innerHTML = "";
        });
        element.innerHTML = '<img src="./img/ckeck.svg" alt="check">';
        document.documentElement.style.setProperty("--background-alarm-1", `${e.target.dataset.color}`);
        localStorage.setItem("color_option", element.dataset.color);
        document.querySelector(".click").play();
    });
});

/*------------------------------- End Setting Box -----------------------*/


//Pause and Resume Pomodoro Time
let pauseButton = document.querySelector(".pause");
pauseButton.addEventListener("click", () => {
    if (pauseButton.classList.contains("resume")) {
        pauseButton.innerHTML = "PAUSE";
        pauseButton.classList.remove("resume");
        pomodoroCounter(localStorage.getItem("duration"))
    } else {
        pauseButton.innerHTML = "RESUME";
        pauseButton.classList.add("resume");
        clearInterval(countDownInterVal);
    }
})


/* ------------------------ Start Functions ------------------------- */
//Show and Hide Sections
function showSection(sct1,sct2, sct4) {
    section1.style.display = sct1;
    section2.style.display = sct2;
    section4.style.display = sct4;
};



//Set Every Input Value To His Button
function setTimeToButtons() {
    allInputNumber.forEach((element, index) => {
        pomodoroControlBtns.forEach((button, indx) => {
            if (index === indx) {
                button.setAttribute("data-time", `${element.value}`);
            }
        });
    });
};



//Decrease Circle during Count down
let pomodoroCircle = document.querySelector(".pomodoro-count .circle");
let pomodoroValue= document.querySelector(".setting-time .pomodoro-num").value;
let circleDecrease;
let decrease;
//Reset decrease value when click on any control button
pomodoroControlBtns.forEach((button) => {
    button.addEventListener("click", () => {
        circleDecrease = 100 / (parseInt(button.dataset.time) * 60);
        decrease = 100;
    });
});
function pomodoroCounter(duration) {
    let minutes, seconds;
    countDownInterVal = setInterval(() => {
        minutes = parseInt(duration / 60);
        seconds = parseInt(duration % 60);
        minutes = minutes < 10 ? `0${minutes}` : minutes;
        seconds = seconds < 10 ? `0${seconds}` : seconds;
        pomodoroCounterElement.innerHTML = `<tspan>${minutes}</tspan><tspan>:</tspan><tspan>${seconds}</tspan>`;
        localStorage.setItem("duration", duration);
        //Reset all when count down finish
        if  (--duration < 0) {
            clearInterval(countDownInterVal);
            showAlertMessage();
            longBreakMessage();
            pauseButton.style.display = "none";
            //Reset decrease value
            decrease = 100;
            document.querySelector(".time-finished").play();
        }
        //Decrease the circle during tne count down
        decrease -= circleDecrease;
        pomodoroCircle.setAttribute("stroke-dasharray", `${decrease}, 100`);
    }, 1000);
};



let finishPomodoroNumber = 0;
let restPomodorsNumber = 4;
function showAlertMessage() {
    pomodoroControlBtns.forEach((button, index) => {
        if (index === 0) {
            if (button.classList.contains("active")) {
                section3.style.display = "block";
                section3.classList.remove("hide");
                alertMessage.innerHTML = "Take a Short Break";
                finishPomodoroNumber++;
                restPomodorsNumber--;
                document.querySelector(".rest-pomodoro").parentElement.style.display = "block";
                document.querySelector(".rest-pomodoro").innerHTML = restPomodorsNumber;
            }
        } else if (index === 1 || index === 2) {
            if (button.classList.contains("active")) {
                section3.style.display = "block";
                section3.classList.remove("hide");
                alertMessage.innerHTML = "Start Pomodoro";
            }
        }
    })
};



function longBreakMessage() {
    if (finishPomodoroNumber === 4) {
        section3.style.display = "block";
        section3.classList.remove("hide");
        alertMessage.innerHTML = "Take a Long Break";
        finishPomodoroNumber = 0;
        restPomodorsNumber = 4;
        document.querySelector(".rest-pomodoro").parentElement.style.display = "none";
    }
}
/* --------------------------------- End Functions ------------------------- */