import puppeteer from 'puppeteer'

let browser;

export const initBrowser = async () => {
    browser = await puppeteer.launch({
        args:["--no-snadbox"],
    })
}

export const getBrowser = () => browser;