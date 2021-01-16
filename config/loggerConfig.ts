import { FileFrequency } from '../Enums/FileFrequency';
import {HttpRequestConfig} from '../Interface/HttpRequestConfig';

let config:HttpRequestConfig = {
    fileName : "debug.log",
    folderName: "logs",
    datePattern: FileFrequency.daily,
    size: "10m",
    timeFormat: "YYYY-MM-DD T HH:mm A"
}

export default config;