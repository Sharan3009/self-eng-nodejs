
import {translationConfig as t, websiteConfig as w} from "../../config/dictionaryConfig";
import { Executor } from "../../Interface/Executor";
import puppeteer from "puppeteer";
class Translate {

    private page:puppeteer.Page;
    constructor(){
    }

    public initiate = async ():Promise<any> =>{
        const browser:puppeteer.Browser = await puppeteer.launch();
        this.page = await browser.newPage();
        await this.page.setUserAgent(w.userAgent);
        return await this.page.goto(t.hostname,{waitUntil: 'networkidle2'});
    }

    public translate = async (text:string,lang:string):Promise<any> => {
        await this.page.$eval('#InputText',(el,value)=>{
            (el as HTMLInputElement).value = value
        },text);

        const eles = await this.page.$$("#LangPair_ToDDL ul>li");
        
        const resolvedEles = await Promise.all(eles.map(ele=>ele.getProperty("innerText")))

        const vals = await Promise.all(resolvedEles.map(v=>v.jsonValue()));
        
        let index:number = -1;
        vals.some((val,i)=>{
            if((val as string).toLowerCase().trim()===lang.toLowerCase().trim()){
                index = i;
                return true;
            }
        });

        const anchor = await eles[index].$("a");
        await anchor?.evaluate(ele=> (ele as HTMLElement).click());
        const translate = await this.page.$(".threebox a.trans");
        await translate?.evaluate(ele => (ele as HTMLLinkElement).click());
        // await this.page.evaluate(() => {
        //     let dom = document.querySelector('#TranslationOutput');
        //     (dom as HTMLElement).innerHTML = "fetching the Translations";
        //  });
        const x = await this.page.$$("#TranslationOutput");
        try{
            await this.startPolling(1,5,x);
        } catch (e){
            throw new Error(e);
        }
        const y = await (await x[0].getProperty("innerText")).jsonValue();
        return y;
        // await this.page.$eval('#TranslationOutput',(el,value)=>{
        //     console.log((el as HTMLElement).getAttribute("innerText"));
        // },text);
        
    }

    private startPolling = async (curr:number,tot:number,x:puppeteer.ElementHandle<Element>[]) :Promise<any> => {
        const getClass = await (await x[0].getProperty("className")).jsonValue();
        if(getClass!=="mttextarea" && curr>tot){
            throw new Error("Not found");
        } else if(getClass==="mttextarea"){
            return 200;
        } else if (curr>tot){
            throw new Error("Not found");
        }
        await new Promise((res,rej)=>{
            setTimeout(res,500);
        })
        this.startPolling(curr+1,tot,x);
        
    }
}

export default new Translate();