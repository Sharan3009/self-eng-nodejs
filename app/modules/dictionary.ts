
import {IncomingMessage} from "http";
import https,{RequestOptions} from "https";
import cheerio from "cheerio";
import { Executor } from "../../Interface/Executor";
import logger from "../utils/logger";

import d from "../../config/dictionaryConfig";
import { DictAudio, DictResponse, DictTitle } from "../../Interface/Dictionary";

class Dictionary {

	private userAgentKey:string = "User-Agent";
	private $:cheerio.Root;

	public define = (word:string):Promise<DictResponse> => {

		return new Promise<DictResponse>((resolve:Executor<DictResponse>,reject:Executor<string>)=>{
			this.getPage(word).then((resp:string)=>{
				this.$ = cheerio.load(resp);
				resolve(this.scrapData());
			}).catch((reason:string)=>{
				logger.error(reason);
			})
		})

	}

	private scrapData = ():DictResponse => {
		return {
			...this.getAudios(),
			...this.getTitle()
		}
	}

	private getAudios = ():DictAudio => {

		const enAudios:Array<string> = [];
		const audio:DictAudio = {
			audios: {
				en:enAudios
			}
		};

		this.$(".pronunciations audio").each((i:number,ele:cheerio.Element)=>{
			let val:string|undefined = this.$(ele).attr("src");
			if(val){
				enAudios.push(val);
			}
		});
		return audio;

	}

	private getTitle = ():DictTitle => {
		const obj:DictTitle = {
			title: ""
		}

		obj.title = this.$(".hwg .hw").text();

		return obj;
	}

	private getPage = (word:string):Promise<any> => {

		const path = `/${d.lang}${d.path}${word}`;

		const reqOpts:RequestOptions = {
			hostname:d.hostname,
			port:d.port,
			path:path,
			headers : {
				[this.userAgentKey]:d.userAgent
			}
		}
		return new Promise<any>((resolve:Executor<any>,reject:Executor<any>)=>{
			https.get(reqOpts,(res:IncomingMessage)=>{
				let html:string = '';
  
				res.on('data', (chunk:string) => {
					html += chunk;
				});
		
				res.on('end', () => {
					resolve(html);
				});

				res.on("error",(err:Error)=>{
					reject(err.message);
				})
			});
		})
	}
}

export default new Dictionary();