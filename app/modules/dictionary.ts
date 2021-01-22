
import {IncomingMessage} from "http";
import https,{RequestOptions} from "https";
import cheerio from "cheerio";
import { Executor } from "../../Interface/Executor";
import logger from "../utils/logger";

import d from "../../config/dictionaryConfig";
import { DictDefinition, DictMeaning, DictMeanings, DictPhonetic, DictPhonetics, DictResponse, DictTitle } from "../../Interface/Dictionary";

class Dictionary {

	private userAgentKey:string = "User-Agent";
	private $:cheerio.Root;
	private word:string;

	public define = (word:string):Promise<DictResponse> => {

		this.word = word;
		return new Promise<DictResponse>((resolve:Executor<DictResponse>,reject:Executor<DictResponse>)=>{
			this.getPage().then((resp:string)=>{

				this.$ = cheerio.load(resp);
				const data:DictResponse = this.scrapData();
				if(data.status==='success'){
					resolve(data);
				} else {
					reject(data);
				}
				
			}).catch((reason:string)=>{
				logger.error(reason);
			})
		})

	}

	private scrapData = ():DictResponse => {

		let obj:DictTitle = this.getTitle();

		if(obj.title){
			return {
				status:"success",
				data: {
					...obj,
					...this.getAudios(),
					...this.getMeanings()
				}
			}
		}
		return {
			status:"error",
			message:`No match found for the word '${this.word}'`
		}
	}

	private getAudios = ():DictPhonetics => {

		const arr:Array<DictPhonetic> = [];
		const audio:DictPhonetics = {
			phonetics: arr
		};

		this.$(".pronunciations .phoneticspelling").each((i:number,ele:cheerio.Element)=>{
			
			let text:string = this.$(ele).text();
			let audio: cheerio.Cheerio = this.$(ele).next("a.speaker");

			if(audio.length){
				let src:string|undefined = audio.children("audio:first-child").attr("src");
				if(src){
					let phonetic:DictPhonetic = {
						text: text,
						audio:src
					}
					arr.push(phonetic);
				}
			}

		});
		return audio;

	}

	private getMeanings= ():DictMeanings => {

		const sections: cheerio.Cheerio = this.$("section.gramb");
		const meanings:Array<DictDefinition> = [];

		const obj:DictMeanings = {
			meanings: meanings
		}

		sections.each((i:number,element:cheerio.Element)=>{

			const ele:cheerio.Cheerio = this.$(element);

			const partOfSpeech:string = ele.find(".ps.pos > .pos").text().trim();

			if(partOfSpeech.length){

				const definitions: Array<DictMeaning> = [];

				const dictDefinition:DictDefinition = {
					partOfSpeech:partOfSpeech,
					definitions: definitions
				}

				ele.children("ul.semb").children("li").each((i:number,liElement:cheerio.Element)=>{

					const liEle:cheerio.Cheerio = this.$(liElement).find(">.trg");
	
					const meaning:string = liEle.find(" > p > .ind").text().trim();
	
					if(meaning){
	
						const dictMeaning: DictMeaning = {
							meaning: meaning
						}
	
						const usage:string = liEle.find(" > .exg  > .ex > em").first().text().trim();
	
						if(usage){
							dictMeaning.usage = usage;
						}
	
						const synonyms:string = liEle.find(" > .synonyms > .exg  > div").first().text();
	
						if(synonyms.length){
							dictMeaning.synonyms = synonyms.split(/,|;/).filter(synonym => synonym != ' ' && synonym).map(function(item) {
    							return item.trim();
    						});;
						}
	
						const antonyms:string = "";
	
						liEle.find(".antonyms .exg").children("div").each((i:number, ele:cheerio.Element)=>{
							antonyms.concat(this.$(ele).text().trim());
						})
	
						if(antonyms.length){
							dictMeaning.antonyms = antonyms.split(", ");
						}
	
						definitions.push(dictMeaning);
	
					}
				})
				meanings.push(dictDefinition);
			}

		})

		return obj;
	}

	private getTitle = ():DictTitle => {

		const obj:DictTitle = {
			title: ""
		}

		obj.title = this.$(".hwg .hw").text();
		return obj;
	}

	private getPage = ():Promise<any> => {

		const path = `/${d.lang}${d.path}${this.word}`;

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