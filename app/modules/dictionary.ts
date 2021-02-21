
import cheerio from "cheerio";
import logger from "../utils/logger";

import {definitionConfig as d} from "../../config/dictionaryConfig";
import { DictData, DictDefinition, DictMeaning, DictMeanings, DictPhonetic, DictPhonetics, DictResponse, DictTitle } from "../../Interface/Dictionary";
import { FetchPage } from "../../Class/FetchPage";
import CustomError from "../../Class/CustomError";

class Dictionary extends FetchPage {

	private $:cheerio.Root;
	private word:string;
	private lang:string = "en";

	public getMeaning = async (word:string):Promise<DictData> => {

		this.word = word;
		try {
			const path = `/${this.lang}${d.path}${this.word}`;
			const resp:string = await this.getPage(d.hostname,path);
			this.$ = cheerio.load(resp);
			const data:DictResponse = this.scrapData();
			if(data.status==="success"){
				return data.data;
			} else {
				throw new CustomError(data.message);
			}
		} catch (e:any) {
			logger.error(e.message);
			throw new CustomError(e);

		}
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

}

export default new Dictionary();