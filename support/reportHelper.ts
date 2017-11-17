import * as reporter from "protractor-jasmine2-html-reporter";
import {DisplayProcessor, SpecReporter} from "jasmine-spec-reporter";
import SuiteInfo = jasmine.SuiteInfo;
import { Utilities } from "./utils";
//var HtmlReporter = require('protractor-beautiful-reporter');
var PrettyReporter = require('protractor-pretty-html-reporter').Reporter;

class CustomProcessor extends DisplayProcessor {
    public displayJasmineStarted(info: SuiteInfo, log: string): string {
        return `TypeScript ${log}`;
    }
}

export class ReportHelper{

    public static addSpecReporter() {
        try {           
            //jasmine.getEnv().clearReporters();
            jasmine.getEnv().addReporter(new SpecReporter({
                customProcessors: [CustomProcessor],

            }));
        } catch (error) {
            
        }
    }

    // public static addBeautifulHTMLReporter(){
    //     let __path = require('path');
    //     try {
    //         // Add a screenshot reporter:
    //         jasmine.getEnv().addReporter(new HtmlReporter({
    //         preserveDirectory: true,
    //         baseDirectory: 'reports',
    //         screenshotsSubfolder: 'screenshots',
    //         jsonsSubfolder: 'jsons',
    //         takeScreenShotsOnlyForFailedSpecs: true,
    //         pathBuilder: function pathBuilder(spec, descriptions, results, capabilities) {
    //             // Return '<30-12-2016>/<browser>/<specname>' as path for screenshots:
    //             // Example: '30-12-2016/firefox/list-should work'.
    //             var currentDate = new Date(),
    //                 day = currentDate.getDate(),
    //                 month = currentDate.getMonth() + 1,
    //                 year = currentDate.getFullYear(),
    //                 hours = currentDate.getUTCHours(),
    //                 min = currentDate.getUTCMinutes()/*,
    //                 sec = currentDate.getUTCSeconds()*/;

    //             var validDescriptions = descriptions.map(function (description) {
    //                 return description.replace('/', '@');
    //             });

    //             return __path.join(
    //                 day + "-" + month + "-" + year + hours + min /*+ sec*/,
    //                 // capabilities.get('browserName'),
    //                 validDescriptions.join('-'));
    //         }
    //     }).getJasmine2Reporter());
    //     } catch (error) {
            
    //     }
    // }

    public static  pettyHtmlReporter()
    {
        let __path = require('path');
        var currentDate = new Date(),
        day = currentDate.getDate(),
        month = currentDate.getMonth() + 1,
        year = currentDate.getFullYear(),
        hours = currentDate.getUTCHours(),
        min = currentDate.getUTCMinutes(),
        sec = currentDate.getUTCSeconds()
        let __resultsFolderName = "Results"+ day + "-" + month + "-" + year + hours + min + sec;
        let __folderName = __path.join(__dirname,'../../results/'+day + "-" + month + "-" + year,__resultsFolderName);
        
        Utilities.createDirectory(__folderName);
        var prettyReporter = new PrettyReporter({
            // required, there is no default
            path: __folderName, //__path.join(__dirname, __folderName),
            screenshotOnPassed: false,
            showBrowser : true,


        });

        jasmine.getEnv().addReporter(prettyReporter);

    }


 


}