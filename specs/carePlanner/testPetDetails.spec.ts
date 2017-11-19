import { AppointmentController } from '../../lib/apiControllers/appointmentController';
import { AuthController } from '../../lib/apiControllers/authController';
import { ClientAndPatientController } from '../../lib/apiControllers/clientAndPatientController';
import { VisitController } from '../../lib/apiControllers/visitController';
import { browser, protractor, element, by } from 'protractor';
import { CarePlannerPetDetails } from '../../pages/carePlanner/cpPetdetails.page';
import { OrderController } from '../../lib/apiControllers/orderController';
import { CarePlannerSchedulerPage } from '../../pages/carePlanner/cpScheduler.page';
import { CarePlannerEditSchedulePopup } from '../../pages/carePlanner/cpEditSchedulePopup.page';
import { CarePlannerEditOccuranceSeriesPopup } from '../../pages/carePlanner/cpEditOccurrenceSeriesPopup.page';
import { By } from 'selenium-webdriver';
import { ActionSequence } from 'protractor/node_modules/@types/selenium-webdriver';


let cpSchedulerPage, cpPetDetailsPage, cpEditSchedulePopupPage, cpEditOccuranceSeriesPopup;
//let authController, clientAndPatientController, appointmentController;

describe('Verify the Patient Header has accurate Patient and Visit information', () => {

    beforeAll(() => {
        cpPetDetailsPage = new CarePlannerPetDetails();
        cpSchedulerPage = new CarePlannerSchedulerPage();
        let authController: AuthController = new AuthController();
        let clientAndPatientController: ClientAndPatientController = new ClientAndPatientController();
        let appointmentController: AppointmentController = new AppointmentController();
        let visitController: VisitController = new VisitController();
        let orderController: OrderController = new OrderController();
        cpEditSchedulePopupPage = new CarePlannerEditSchedulePopup();
        cpEditOccuranceSeriesPopup = new CarePlannerEditOccuranceSeriesPopup();


        var flow = protractor.promise.controlFlow();

        //Creating a Auth Token
        flow.execute(authController.getAuthToken).then((response) => {
            browser.logger.info("Getting Basic Auth token...");
            browser.token = response;
            browser.bearerToken = 'bearer ' + response;
            browser.logger.info("Bearer token: " + browser.bearerToken);
        });


        //Create a Client
        flow.execute(clientAndPatientController.createClient).then((response) => {
            browser.logger.info("Creating a new client...");
            //browser.logger.info(JSON.stringify(response));
            browser.clientID = response['ClientId'];
            browser.logger.info("ClientId: " + browser.clientID);
            browser.logger.info("Client name: " + response['FirstName'] + ' ' + response['LastName']);
            browser.clientLastName = response['LastName'];
        });

        // Create patient
        flow.execute(clientAndPatientController.createPatient).then((response) => {
            browser.logger.info("Creating a new patient...");
            //browser.logger.info(JSON.stringify(response));            
            browser.patientID = response;
            browser.logger.info("PatientId: " + browser.patientID);
            //browser.patientName 
        });

        //Create a new appointment for patient
        flow.execute(appointmentController.createNewAppointment).then(function (response) {
            browser.logger.info("Creating a new appointment...");
            //browser.logger.info(JSON.stringify(response));
            browser.appointmentID = response['AppointmentId'];
            browser.logger.info("Appointment ID: " + browser.appointmentID);
        });

        //Check appointment in
        flow.execute(appointmentController.checkInAppointment).then(function (response) {
            browser.logger.info("Checking in the appointment...");
            //browser.logger.info(JSON.stringify(response));
            browser.logger.info("Response received for adding product : " + response);
        });

        //Get checked in patient's details
        flow.execute(appointmentController.getCheckedInPatientDetails).then(function (response) {
            browser.logger.info("Getting details of checked in appointment...");
            //browser.logger.info(JSON.stringify(response));
            browser.visitId = response[0].VisitId;
            browser.logger.info("Visit Id is :" + browser.visitId);
        });

        //Add Product to the Visit
        flow.execute(orderController.addOrderToVisit).then(function (response) {
            browser.logger.info("Product Ordered Response...");
            browser.logger.info((response));
        });

        //Get Visit & Invoice Details by Visit Id
        flow.execute(visitController.getVisitDetailsByVisitId).then(function (response) {
            browser.logger.info("Visit Details & Invoice Details by Visit Id...");
            //browser.logger.info(JSON.stringify(response));
            browser.visitInvoiceItems = response[0].VisitInvoiceItems;

            for (let items of browser.visitInvoiceItems) {
                browser.logger.info("Visit Invoice Details :" + JSON.stringify(items));
                browser.logger.info("Visit Invoice Details [Visit Invoice Item Id]" + items.VisitInvoiceItemId);
                browser.logger.info("Visit Invoice Details [Invoice Item Id]" + items.InvoiceItemId);
            }
        });

        //Get Task Series Details By Order Id
        flow.execute(orderController.getTaskSeriesByOrderId).then(function (response) {
            browser.logger.info("Task Series by Order Id...");
            //browser.logger.info(JSON.stringify(response));
            browser.taskOccurances = response[0].TaskOccurences;

            for (let items of browser.taskOccurances) {
                browser.taskSeriesId = items.TaskSeriesId;
                browser.taskOccurrenceId = items.TaskOccurrenceId;
                browser.logger.info("Task Series Id :'" + browser.taskSeriesId + "' for OrderId : '" + browser.visitId + "'");
                browser.logger.info("Task Occurance Id :'" + browser.taskOccurrenceId + "' for OrderId : '" + browser.visitId + "'");
            }
        });


        // Get resource id to form care planner URL 
        flow.execute(visitController.getVisitResources).then(function (response) {
            browser.logger.info("Getting User Id...");
            // browser.logger(JSON.stringify(response));
            for (let i in response) {
                // browser.logger(response[i]);
                let user = response[i];
                if (user['ADusername'] == browser.appenvdetails.username) {
                    browser.logger.info('UserId: ', user['ResourceId']);
                    browser.userId = user['ResourceId'];
                }
            }
        });

        // Form URL to navigate to Careplanner
        flow.execute(() => {
            browser.logger.info("*********** Launching Browser ***********");
            browser.logger.info("Creating URL and launching browser...");
            var url = browser.baseUrl +
                '?hospitalId=' + browser.appenvdetails.hospitalid +
                '&patientId=' + browser.patientID +
                '&orderId=' + browser.visitId +
                '&userName=' + browser.appenvdetails.username +
                '&userId=' + browser.userId +
                '&accessToken=' + browser.token;
            browser.logger.info('URL: ', url);
            browser.get(url);

            //  browser.executeScript("document.body.style.zoom='80%'");
            browser.sleep(5000);
            browser.logger.info("*********** Executing Tests ***********");
        });


        // browser.get(" https://hcorpqa-ns02.vcaantech.com/VCAChargeCapture?hospitalId=153&patientId=314760412&orderId=472963060&userName=Josh.Chezum&userId=246200262&accessToken=W5kykM4WP8hyJ9M-tELtdHjEwnKByK6b8Q508J3H6lsIexgiZkqxLY9rqdqPaOFOqmmxW7bh16x9sVB_9QlT_i260U1gds9cAcx490HvVZeNjrgzj2tEQP6U4Bm1LF-RYiUSDvTUtsq7JTB5cUwR0yoNVsMqvy0COr2mY1mdn4k1bnaYcVN6vplYsOXl9JuoN_F8ntiwWYAmnt8NIJgBYyFcL8mRaH2FFyfb5TmF-pM7k9S2sYBaJ2YAfqcnS_F1BkzICA");
        // //     //  browser.executeScript("document.body.style.zoom='100%'");
        // browser.sleep(10000);
    });

    /// Test cases 


    it('Should have the title as VCA Charge Capture', async () => {
        browser.logger.info("***********Verifying Page Title***********");
        if ('VCA Charge Capture' == await cpPetDetailsPage.pageTitle) {
            browser.logger.info("Page title is matching");
        }
        else {
            browser.logger.error("Page title is not matching");
            fail("Page title are not matching");
            // .//div[@wj-part='cells'  and @class='wj-cells']
        }
    });


    it('Pet name should be correct', async () => {

        let __patientName = browser.patientName.length >= 12 ? browser.patientName.slice(0, 12) + '…' : browser.patientName;

        if (__patientName == await cpPetDetailsPage.petName) {
            browser.logger.info("Patient name is matching");
        }
        else {
            browser.logger.error("Patient name is not matching");
            fail("Patient names are not matching");
        }
    });

    it('Client last name should be correct ', async () => {
        let __clientLastName = browser.clientLastName.length >= 12 ? browser.clientLastName.slice(0, 12) + '…' : browser.clientLastName;

        if (__clientLastName == await cpPetDetailsPage.clientName) {

            browser.logger.info("Client name is matching");
        }
        else {
            browser.logger.error("Client name is not matching");
            fail("Client names are not matching");
        }

    });

    it('Should have the Species Name as Canine ', async () => {

        if ('Canine' == await cpPetDetailsPage.speciesName) {
            browser.logger.info("Species name is matching");
        }
        else {
            browser.logger.error("Species name is not matching");
            fail("Species names are not matching");
        }

    });

    it('Should validate primary doctor name ', async () => {

        browser.logger.info('validate doctor name');

    });

    it('Should validate category count ', async () => {
        var __catCount = await cpSchedulerPage.categoryCount;

        browser.logger.info("Cat count " + __catCount);
    });



    it('Should get product count ', async () => {

        var __productTaskList = await cpSchedulerPage.productTaskListCount;

        browser.logger.info("task list count  " + __productTaskList);

    });

    it('Should get list of category names', async () => {

        browser.logger.info(await cpSchedulerPage.productTaskList);

    });


    it('Click on Task series ', async () => {
   
        await cpSchedulerPage.clickOnTaskName("Medication");

    });

    it('Task series pop up should be displayed', async () =>{

        let val : boolean = await cpSchedulerPage.IsTaskSeriesPopUpdisplayed();
        if (val) {browser.logger.info("Task series pop up is opened");}
        else {browser.logger.info("Task series pop up is not opened");}

    });


    it('Frequency as Once and get Start Time ', async () => {
        browser.sleep(3000);
        // browser.sleep(3000);
        await cpEditSchedulePopupPage.ToggleFrequencyOnce();
        // expect(cpEditSchedulePopupPage.repeatEvery).toEqual(3);
        let __startTime: any = await (cpEditSchedulePopupPage.getStartTimeScheduleOnce);
        browser.starttimeoftaskseries = await parseInt(__startTime);
        await console.log("Start time value is .....  " + (browser.starttimeoftaskseries));
        //browser.starttimeoftaskseries =8;
    });


    it('Enter instructions  ', async () => {
        await cpEditSchedulePopupPage.EnterInstructions("Enter your instructions");
        // expect(cpEditSchedulePopupPage.repeatEvery).toEqual(3);
    });

    it('Click on Schedule button ', async () => {
        await cpEditSchedulePopupPage.ClickScheduleButton();
    });


    it('Verify the task is scheduled', async () => {
        browser.sleep(5000);
        let __taskOcccurence = "//*[@id='wijgridObject']/descendant::div[contains(@class,'wj-cell wj-alt') and not(contains(@class,'wj-frozen'))][position()=" + (browser.starttimeoftaskseries + 1) + "]//ul//div[@class='occurance-icon']";
        browser.logger.info(__taskOcccurence);
        await expect(cpSchedulerPage.IsTaskScheduled1(__taskOcccurence)).toBe(true);
        //  browser.logger.info("Verified scheduled task");
    });


    it('Click on scheduled task occurenace cell', async () => {
        let __taskOcccurence = "//*[@id='wijgridObject']/descendant::div[contains(@class,'wj-cell wj-alt') and not(contains(@class,'wj-frozen'))][position()=" + (browser.starttimeoftaskseries + 1) + "]//ul";
        browser.logger.info(__taskOcccurence);
        // browser.sleep(10000);
        await cpSchedulerPage.clickScheduledTaskItem1(__taskOcccurence);
        // browser.sleep(6000);
    });

    it("Task occurrence popup should be displayed", async () => {

        browser.logger.info("Clicked on the task scheduled item  ");
        expect(await cpEditOccuranceSeriesPopup.isPopupDisplayed).toBe(true);
        await browser.logger.info("Task occurrence pop up is displayed");
    });


    it("Enter the task notes", async () => {
        await cpEditOccuranceSeriesPopup.EnterTaskNotes("Task has been completed");
    });


    it("Click on Schedule & Save", async () => {
        await cpEditOccuranceSeriesPopup.ClickOnCompleteAndSave();

    });


    it("Verify the Status after completing the occurence", async () => {
        browser.starttimeoftaskseries;
        let __taskOcccurence = "//*[@id='wijgridObject']/descendant::div[contains(@class,'wj-cell wj-alt') and not(contains(@class,'wj-frozen'))][position()=" + (browser.starttimeoftaskseries) + "]//ul//li[@class='Complete']";
        await expect(cpSchedulerPage.TaskOccurenceStatus1(__taskOcccurence)).toEqual('Complete');
    });

});