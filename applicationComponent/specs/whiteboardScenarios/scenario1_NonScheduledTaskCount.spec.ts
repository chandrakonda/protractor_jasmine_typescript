import { browser } from 'protractor';
import { APILibraryController, Data, Pages, SpecFile, TestBase, TestCase } from '../../../applicationcomponent';
import { DataReader } from '../../../dataComponent/dataReaderHelper';
import { FrameworkComponent } from '../../../frameworkComponent';


describe('Test whiteboard scenarios  -->  ', () => {

    describe('Verify the non-scheduled task series count displayed in the whiteboard for a filtered patient  -->  ', () => {
        let specFileData: SpecFile;
        let __data: Data;
        let __testCase: TestCase;
        let __dataReader: DataReader;
        beforeAll(() => {
            specFileData = new SpecFile();
            __dataReader = new DataReader();
            __data = new Data();
            specFileData.Data = __data;
            specFileData.UserData = __dataReader.loadJsonData('userDataScenario1', 'whiteboard');
            specFileData.TestCases = new Array<TestCase>();
        });

        afterAll(() => {
            TestBase.GlobalData.SpecFiles.push(specFileData);
        });

        beforeEach(() => {
            __testCase = new TestCase();
        });

        afterEach(() => {
            var myReporter = {

                specDone: function (result) {
                    __testCase.TestName = result.description;
                    __testCase.TestResult = result.status;
                    __testCase.ExceptionDetails = result.failedExpectations.length ? result.failedExpectations[0].message : '';
                    __testCase.StartTime = result.started;
                    __testCase.EndTime = result.stopped;
                },
            };

            jasmine.getEnv().addReporter(myReporter);
            specFileData.TestCases.push(__testCase);
        });


        it('Verify the careplanner application launching by setting up the informations of client, pet and visit informations', async () => {
            try {
                __testCase.TestName = 'Verify the careplanner application launching by setting up the informations of client, pet and visit informations';

                //Data setup using API call
                await APILibraryController.careplannerLibrary.apiTestDataSetUpWithDefaultData(specFileData);

                //Getting aggregated data to the specFileData
                await APILibraryController.careplannerLibrary.apiGetAggregatedDataByOrderId(specFileData);

                browser.sleep(5000);

                //Verify the page Title
                let __pageTitle = await browser.getTitle().then((title) => { return title });
                await expect(__pageTitle).toEqual('VCA Charge Capture');

            } catch (error) {
                __testCase.ExceptionDetails = error;
            }
        });

        it('Verify the client & pet informations displayed in the careplanner banner', async () => {
            try {
                __testCase.TestName = "Verify the client & pet informations displayed in the careplanner banner";

                // let _clientLastName = specFileData.Data.Client.LastName.length >= 12 ? specFileData.Data.Client.LastName.slice(0, 12) + '…' : specFileData.Data.Client.LastName;
                // let _patientName = specFileData.Data.Client.Patient.Name.length >= 12 ? specFileData.Data.Client.Patient.Name.slice(0, 12) + '…' : specFileData.Data.Client.Patient.Name;
                let _clientLastName = specFileData.Data.Client.LastName.slice(0, 12);
                let _patientName = specFileData.Data.Client.Patient.Name.slice(0, 12);
                let speciesName = specFileData.Data.Client.Patient.Species;

                //Verify the Client Last Name
                await expect(Pages.cpClientAndPetDetailsPage.clientName).toContain(_clientLastName);

                //Veify the Patient Name 
                await expect(Pages.cpClientAndPetDetailsPage.petName).toContain(_patientName);

                //Veify the Species Name
                await expect(Pages.cpClientAndPetDetailsPage.speciesName).toContain(speciesName);

            } catch (error) {
                __testCase.ExceptionDetails = error;
            }
        });

        it('Verify the product category and task list displayed in the careplanner scheduler page', async () => {
            try {
                __testCase.TestName = "Verify the product category and task list displayed in the careplanner scheduler page";

                let __taskCategoryList = await APILibraryController.careplannerLibrary.getCategoryListFromAggregatedDataByOrderId(specFileData);

                //Verify the Category Count
                await expect(Pages.cpSchedulerPage.categoryCount).toEqual(__taskCategoryList.categoryList.length);

                //Verify the Task Count
                await expect(Pages.cpSchedulerPage.productTaskListCount).toEqual(__taskCategoryList.taskList.length);

            } catch (error) {
                __testCase.ExceptionDetails = error;
            }
        });

        it('Select the technician and location details', async () => {
            try {
                __testCase.TestName = 'select the technician and location details';
                let __technicianName = 'Me';
                let __locationName = 'Cat- Double Occupancy';

                Pages.cpClientAndPetDetailsPage.selectTechnicianFromDropDown(__technicianName);

                browser.sleep(3000);

                Pages.cpClientAndPetDetailsPage.selectLocationFromDropDown(__locationName);

                browser.sleep(2000);

                let __technicianNameSelected = Pages.cpClientAndPetDetailsPage.selectedTechnicianName;
                FrameworkComponent.logHelper.info(__technicianNameSelected);
                expect(__technicianNameSelected).toBe(__technicianName);

                let __locationNameSelected = Pages.cpClientAndPetDetailsPage.selectedLocationName;
                FrameworkComponent.logHelper.info(__locationNameSelected);
                expect(__locationNameSelected).toBe(__locationName);

            } catch (error) {
                __testCase.ExceptionDetails = error;
            }
        });

        it('Navigate to the whiteboard section and verify the filter is in off state', () => {
            try {
                __testCase.TestName = 'navigate to the whiteboard section';

                Pages.cpClientAndPetDetailsPage.navigateToWhiteBoard();

                browser.sleep(10000);

                expect(Pages.cpWhiteboardPage.IsAtWhiteboardPage()).toBe(true);

                // expect(Pages.cpWhiteboardPage.getFilterStatus).toBe('OFF');


            } catch (error) {
                __testCase.ExceptionDetails = error;
            }
        });

        it('Clear the filter properties', () => {
            try {
                __testCase.TestName = 'clear the filter properties';

                Pages.cpWhiteboardPage.clearFilterOptionsSelected();

                expect(Pages.cpWhiteboardPage.getFilterStatus).toBe('OFF');

            } catch (error) {
                __testCase.ExceptionDetails = error;
            }
        })

        it('Verify the filter popup get displayed on clicking filter button', () => {
            try {
                __testCase.TestName = 'verify the filter popup get displayed on clicking filter button';

                Pages.cpWhiteboardPage.clickOnFilterButton();

                browser.sleep(1000);

                expect(Pages.cpWhiteboardPage.IsFilterPopupDisplayed()).toBe(true);

            } catch (error) {
                __testCase.ExceptionDetails = error;
            }
        })

        it('Select the location in filter options', () => {
            try {
                __testCase.TestName = 'select the filter options';

                Pages.cpWhiteboardPage.clickOnFilterByName('location');

                expect(Pages.cpWhiteboardPage.selectedFilterTitle).toBe('Location');

                expect(Pages.cpWhiteboardPage.IsSelectAllCheckboxSelected()).toBe(true);

                Pages.cpWhiteboardPage.unselectCheckboxSelectAll();

                expect(Pages.cpWhiteboardPage.IsSelectAllCheckboxSelected()).toBe(false);

                Pages.cpWhiteboardPage.selectFilterOptionsByGivenName('Cat- Double Occupancy');

                Pages.cpWhiteboardPage.clickOnBackButton();

            } catch (error) {
                __testCase.ExceptionDetails = error;
            }
        });

        it('Select the technician in filter options', () => {
            try {
                __testCase.TestName = 'select the filter options';

                Pages.cpWhiteboardPage.clickOnFilterByName('technician');

                expect(Pages.cpWhiteboardPage.selectedFilterTitle).toBe('Technician');

                expect(Pages.cpWhiteboardPage.IsSelectAllCheckboxSelected()).toBe(true);

                Pages.cpWhiteboardPage.unselectCheckboxSelectAll();

                expect(Pages.cpWhiteboardPage.IsSelectAllCheckboxSelected()).toBe(false);

                Pages.cpWhiteboardPage.selectFilterOptionsByGivenName('Me');

                Pages.cpWhiteboardPage.clickOnBackButton();

            } catch (error) {
                __testCase.ExceptionDetails = error;
            }
        });

        it('Apply the filter options selected and verify the filter applied', () => {
            try {

                __testCase.TestName = 'Apply the filter options selected and verify the filter applied';

                Pages.cpWhiteboardPage.applyFilterOptionSelected();

                browser.sleep(10000);

                expect(Pages.cpWhiteboardPage.getFilterStatus).toBe('ON');

            } catch (error) {
                __testCase.ExceptionDetails = error;
            }
        })

        it('Verify the patient information displayed in the filtered list of whiteboard', () => {
            try {
                __testCase.TestName = 'verify the patient information filtered in whiteboard';
                let __patientName = specFileData.Data.Client.Patient.Name.slice(0, 14);
                let __clientLastName = specFileData.Data.Client.LastName.slice(0, 14);
                let __isNameFiltered = Pages.cpWhiteboardPage.IsPatientInformationFilteredByName(__patientName + ' ' + __clientLastName);
                expect(__isNameFiltered).toBe(true);

                // let __overdueTaskCount = Pages.cpWhiteboardPage.getOverdueCountByclienttName(__clientLastName);
                // expect(__overdueTaskCount).toBe('4');

            } catch (error) {
                __testCase.ExceptionDetails = error;
            }
        });

        it('Verify the number of non scheduled  task series count displayed is matching for the patient information in whiteboard', () => {
            try {
                __testCase.TestName = 'verify the patient information filtered in whiteboard';
                let __expectedNonScheduledTaskCount = 0;

                specFileData.Data.Client.Patient.Visit.Category.forEach(category => {
                    __expectedNonScheduledTaskCount = __expectedNonScheduledTaskCount + category.TaskSeriesList.length;
                });

                //We have to call the api edmund gave for the Whiteboard to get the non scheduled count

                let __clientLastName = specFileData.Data.Client.LastName.slice(0, 14);

                let __actualNonScheduledTaskCount = Pages.cpWhiteboardPage.getNotScheduledCountByClientName(__clientLastName);

                FrameworkComponent.logHelper.info("Expected Non Scheduled Task Series Count : " + __expectedNonScheduledTaskCount);
                FrameworkComponent.logHelper.info("Actual Non Scheduled Task Series Count displayed as : " + __actualNonScheduledTaskCount);

                expect(__actualNonScheduledTaskCount).toBe(__expectedNonScheduledTaskCount);

            } catch (error) {
                __testCase.ExceptionDetails = error;
            }
        });

    });

});