
import {IncomingMessage} from "http";
import https,{RequestOptions} from "https";
import cheerio from "cheerio";
import { Executor } from "../../Interface/Executor";

import d from "../../config/dictionaryConfig";

class Dictionary {

	private userAgentKey:string = "User-Agent";

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
			});
		})
	}
}

export default new Dictionary();