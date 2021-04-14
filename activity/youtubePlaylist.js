let puppeteer = require('puppeteer');
let fs = require('fs');

// no of videos
// views done
// watch time-> get
// list of videos -> in an excel
// initial page data get
// handle -> loader


console.log("before");
(async function () {
    try {
        let browserInstance = await puppeteer.launch({
            headless: false,
            defaultViewport: null,
            args: ["--start-maximized"]

        });
        let newPage = await browserInstance.newPage();
        await newPage.goto("https://www.youtube.com/playlist?list=PLRBp0Fe2GpgnIh0AiYKh7o7HnYAej-5ph");

        //evaluate
        let staticInfo = await newPage.evaluate(consoleFn);
        let videoCount = Number(staticInfo[0].split(" ")[0])
        console.log(videoCount);
        console.log(staticInfo[1]);

        let currCount = await scrolltoBottom(newPage,"#video-title");
        while(videoCount-50 > currCount)
        {
            currCount = await scrolltoBottom(newPage,"#video-title");
        }

        let NameDurArr = await newPage.evaluate(getStats, "span.style-scope.ytd-thumbnail-overlay-time-status-renderer", "#video-title");
        console.table(NameDurArr);
        //get videos duration


        //initial data -> data extract
        //span.style-scope.ytd-thumbnail-overlay-time-status-renderer
        //#video-title -> video title

        //scroll-> loader wait
        // dara extract -> next set of videos

    }
    catch (err) {
        console.log(err);
    }
})();


function consoleFn() {
    let arr = document.querySelectorAll("#stats.style-scope .ytd-playlist-sidebar-primary-info-renderer");
    let newArr = [];
    newArr.push(arr[0].innerText);  //no. of videos
    newArr.push(arr[1].innerText);  //no. of views
    return newArr;
}

//function to scroll at the bottom
async function scrolltoBottom(newPage,titleSelector)
{
    function getLengthConsoleFn(titleSelector)
    {
        window.scrollBy(0,window.innerHeight);
        let titleElemArr = document.querySelectorAll(titleSelector);
        console.log("titleLength ",titleElemArr.length);
        if(titleElemArr.length==899)
        {
            console.log(titleElemArr);
        }
        return titleElemArr.length;
    }
    return newPage.evaluate(getLengthConsoleFn,titleSelector);
}



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