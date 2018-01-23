import { FrameworkComponent } from '../../../frameworkComponent';
import { SpecFile, Data, TestCase, TestBase, APILibraryController, Pages, TaskSeries, Product } from  '../../../applicationcomponent'
import { browser } from 'protractor';
import {DataReader} from '../../../dataComponent/dataReaderHelper';

let productTaskList, startPosition:number, endPosition:number, taskOccurrenceCount:number;
let taskUpdateStatus:string[] = ["Planned","Completed","Skipped","Canceled"];

let singleOccurrence = {
    scheduleStartTime : 9,
    scheduleEndTime : 0,
    repeatEveryHour : 0,
    scheduleInstructions : 'Test Instructions for the Single Occurrence',
    expectedNumberOfTaskOccurrences : 1,
    actualOccurrenceStatus : ['Overdue'],
    occurrenceIndex : 0,
    expectedOcurrenceStatus : ['Skipped'],
    taskOccurrenceNotes : 'Test notes for skip task occurrence'
}

let multiOccurrence = {
    scheduleStartTime : 9,
    scheduleEndTime : 11,
    repeatEveryHour : 1,
    scheduleInstructions : 'Test Instructions for the Multiple Occurrence',
    expectedNumberOfTaskOccurrences : 3,
    actualOccurrenceStatus : ['Overdue', 'Overdue', 'Overdue'],
    occurrenceIndex : 0,
    expectedOcurrenceStatus : ['Skipped', 'Overdue', 'Overdue'],
    taskOccurrenceNotes : 'Test notes for skip task occurrence'
}

let occurrenceDetails:TaskOccurreceDetails;


//describe('schedule task occurrence and skip the task occurrence scheduled', async () => {
    
    describe('schedule single task occurrence', async () => {

        let specFileData: SpecFile;
        let __data: Data;
        let __testCase: TestCase;
        beforeAll( () => {    
            specFileData = new SpecFile();
            __data = new Data();
            specFileData.Data = __data;
            specFileData.TestCases = new Array<TestCase>();            
        });

        afterAll( () => {
            TestBase.GlobalData.SpecFiles.push(specFileData);
            startPosition = 0;
            endPosition = 0;
            taskOccurrenceCount = 0;
            productTaskList = '';
            browser.Taskseriesname = '';
        });

        beforeEach(()=> {
            __testCase = new TestCase();          
        });

        afterEach(()=> {
           // FrameworkComponent.logHelper.info("TestCase Data " + __testCase.TestName);
            specFileData.TestCases.push(__testCase);
        });

        // it('Data set up and client pet details' , async () => {
        //     let specDataReader = new DataReader();
        //     specDataReader.loadSpecData(specFileData,"scheduleSkipTask","singleTaskSeries");
        //     console.log("Test this ");
            
        //     // occurrenceDetails = {
        //     //     frequency : "once",
        //     //     scheduleStartTime : singleOccurrence.scheduleStartTime,
        //     //     scheduleStartDate : '',
        //     //     scheduleEndTime : singleOccurrence.scheduleEndTime,
        //     //     scheduleEndDate : '',
        //     //     repeatHours: singleOccurrence.repeatEveryHour,
        //     //     taskInstructions : singleOccurrence.scheduleInstructions
        //     // } as TaskOccurreceDetails;
    
        // });


        it('Testcase : Data set up and client pet details' , async () => {
            try {
                __testCase.TestName = 'API Calls for scheduling a task in careplanner';
              //  await APILibraryController.careplannerLibrary.apiTestDataSetUpWithDefaultData(specFileData); 
              expect(true).toBe(true);
               // FrameworkComponent.logHelper.info("TestCase Data " + __testCase.TestName);
            } catch (error) {
                __testCase.TestResult = 'Fail';
                __testCase.ExceptionDetails = error;
            }
        });
        it('Testcase : Data set up and client pet details' , async () => {
            try {
                __testCase.TestName = 'TAPI Calls for scheduling a task in careplanner';
              //  await APILibraryController.careplannerLibrary.apiTestDataSetUpWithDefaultData(specFileData); 
              expect(true).toBe(false);
                //FrameworkComponent.logHelper.info("TestCase Data " + __testCase.TestName);
            } catch (error) {
                __testCase.TestResult = 'Fail';
                __testCase.ExceptionDetails = error;
            }
        });

        // it('should display the client & pet details matched', async () => {
        //     __testCase.TestName = "Verify the Client and Patient Details from UI";

        //     let _clientLastName = specFileData.Data.Client.LastName.length >= 12 ? specFileData.Data.Client.LastName.slice(0,12) + '…' : specFileData.Data.Client.LastName;
        //     let _patientName = specFileData.Data.Client.Patient.Name.length >=12 ? specFileData.Data.Client.Patient.Name.slice(0,12) + '…' : specFileData.Data.Client.Patient.Name;            
        //     let speciesName = specFileData.Data.Client.Patient.Species;
        //     //let speciesName = 'Canine';

        //     //Verify the page Title
        //     let pageTitle = await Pages.cpClientAndPetDetailsPage.pageTitle;
        //     await expect(pageTitle).toEqual('VCA Charge Capture');
            
        //     //Verify the Client Last Name
        //     await expect(Pages.cpClientAndPetDetailsPage.clientName).toEqual(_clientLastName);
        
        //     //Veify the Patient Name 
        //     await expect(Pages.cpClientAndPetDetailsPage.petName).toEqual(_patientName);
    
        //     //Veify the Species Name
        //     await expect(Pages.cpClientAndPetDetailsPage.speciesName).toContain(speciesName);
        // });
    
    
        // it('should validate the product category and list of tasks for the category', async () => {
            
        //     __testCase.TestName = "Verifying the Category count and product task list";

        //     //Verify the Category Count
        //     await expect(Pages.cpSchedulerPage.categoryCount).toEqual(1);
    
        //     //Verify the Task Count
        //     await expect(Pages.cpSchedulerPage.productTaskListCount).toEqual(1);
        // });
    
    
        // it('should successfuly click on a task name toschedule for single occurrence', async () => {
            
        //     __testCase.TestName = "Schedule the task for the product task series";

        //     //Click on a task name under a category
        //     productTaskList = await Pages.cpSchedulerPage.productTaskList; 
        //     FrameworkComponent.logHelper.info('Product Task List : ' + productTaskList);    
        //     browser.Taskseriesname  = productTaskList[0];

        //     await Pages.cpSchedulerPage.clickOnTaskByName(browser.Taskseriesname.split('-')[0]);
        //     await browser.sleep(1000);
    
        //     occurrenceDetails = {
        //         frequency : "once",
        //         scheduleStartTime : singleOccurrence.scheduleStartTime,
        //         scheduleStartDate : '',
        //         scheduleEndTime : singleOccurrence.scheduleEndTime,
        //         scheduleEndDate : '',
        //         repeatHours: singleOccurrence.repeatEveryHour,
        //         taskInstructions : singleOccurrence.scheduleInstructions
        //     } as TaskOccurreceDetails;
    
        //     //Schedule the Task Occurrence with the Occurrence Details
        //     await Pages.cpTaskSchedulerPopup.scheduleTaskOccurrence(occurrenceDetails);
        //     await browser.sleep(5000);
        // });
    
        // it('should match with the expected occurrence status', async () => {
    
        //     __testCase.TestName =  "Verify the Occurrence created and scheduled";

        //     //Get the task index to set the row index
        //     let _taskIndex = productTaskList.indexOf(browser.Taskseriesname);
            
        //     //Get the Row Index Details based on the Task Details
        //     setPosition(_taskIndex);
    
        //     //Verify the number of task occurrences created
        //     await Pages.cpSchedulerPage.verifyTheNumberOfTaskOccurrenceCreated(startPosition, endPosition, singleOccurrence.expectedNumberOfTaskOccurrences)
    
        //     //Verify the status of the created Occurrences
        //     await Pages.cpSchedulerPage.verifyTheStatusOfTaskOccurrenceCreated(startPosition, endPosition, singleOccurrence.actualOccurrenceStatus);

        // });
    
        // it('should display the edit task occurrence popup by click on the single task occurrence', async () => {
            
        //     __testCase.TestName = "Edit and update the task occurrence";

        //     //Click on the task occurrence to bring up the edit task occurrence popup
        //     FrameworkComponent.logHelper.info("Click on the task occurrence by index : " + singleOccurrence.occurrenceIndex);
        //     await Pages.cpSchedulerPage.clickOnOccurrenceByIndex(startPosition, endPosition, singleOccurrence.occurrenceIndex);
        //     await browser.sleep(1000);
    
        //     //Edit & Update the status of the task occurrence
        //     await Pages.cpTaskOccurrencePopup.updateOccurrenceDetails(taskUpdateStatus[2],singleOccurrence.taskOccurrenceNotes);
        //     await browser.sleep(7000);
            
        //     //Verify the task occurrence status after completing
        //     await Pages.cpSchedulerPage.verifyTheStatusOfTaskOccurrenceUpdatedByIndex(startPosition, endPosition, singleOccurrence.occurrenceIndex, singleOccurrence.expectedOcurrenceStatus[singleOccurrence.occurrenceIndex]);
        // });
    });

   