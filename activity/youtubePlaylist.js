let puppeteer = require('puppeteer');
let fs = require('fs');

// no of videos
// views done
// watch time-> get
// getting all the videos available



(async function () {
    try {
        //browser launched
        let browserInstance = await puppeteer.launch({
            headless: false,
            defaultViewport: null,
            args: ["--start-maximized"]

        });

        let newPage = await browserInstance.newPage();
        await newPage.goto("https://www.youtube.com/playlist?list=PLRBp0Fe2GpgnIh0AiYKh7o7HnYAej-5ph");

        //evaluate
        let staticInfo = await newPage.evaluate(consoleFn);

        //video Count
        let videoCount = Number(staticInfo[0].split(" ")[0])
        console.log(videoCount);
        console.log(staticInfo[1]);

        // call to scrolltoBottom function
        let currCount = await scrolltoBottom(newPage, "#video-title");
        while (videoCount - 50 > currCount) {
            currCount = await scrolltoBottom(newPage, "#video-title");
        }

        // call a functio to return name and duration of the video mentioned in the playlist
        let NameDurArr = await newPage.evaluate(getStats, "span.style-scope.ytd-thumbnail-overlay-time-status-renderer", "#video-title");
        console.table(NameDurArr);


    }
    catch (err) {
        console.log(err);
    }
})();

// function to get number of videos and number of views
function consoleFn() {
    let arr = document.querySelectorAll("#stats.style-scope .ytd-playlist-sidebar-primary-info-renderer");
    let newArr = [];
    newArr.push(arr[0].innerText);  //no. of videos
    newArr.push(arr[1].innerText);  //no. of views
    return newArr;
}

//function to scroll at the bottom till all the videos are rendered on the screen
async function scrolltoBottom(newPage, titleSelector) {
    function getLengthConsoleFn(titleSelector) {
        window.scrollBy(0, window.innerHeight);
        let titleElemArr = document.querySelectorAll(titleSelector);
        console.log("titleLength ", titleElemArr.length);
        if (titleElemArr.length == 899) {
            console.log(titleElemArr);
        }
        return titleElemArr.length;
    }
    return newPage.evaluate(getLengthConsoleFn, titleSelector);
}

// to get name and duration of every video

function getStats(durationSelector, titleSelector) {
    let dElemArr = document.querySelectorAll(durationSelector);
    let titleElemArr = document.querySelectorAll(titleSelector);
    let nameNDurArr = [];
    for (let i = 0; i < dElemArr.length; i++) {
        let duration = dElemArr[i].innerText;
        let title = titleElemArr[i].innerText;
        nameNDurArr.push({ duration, title });

    }
    return nameNDurArr;
}
