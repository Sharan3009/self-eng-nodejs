
import {IncomingMessage} from "http";
import https,{RequestOptions} from "https";
import { Executor } from "../Interface/Executor";
import {websiteConfig as w} from "../config/dictionaryConfig";

export class FetchPage {

    private userAgentKey:string = "User-Agent";
    protected getPage = (hostname:string,path:string):Promise<any> => {

		const reqOpts:RequestOptions = {
			hostname:hostname,
			port:w.port,
			path:path,
			headers : {
				[this.userAgentKey]:w.userAgent
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