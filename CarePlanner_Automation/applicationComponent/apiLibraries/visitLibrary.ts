import { SpecFile, TestBase } from '../../applicationComponent';
import { DataReader } from '../../dataComponent/dataReaderHelper';
import { FrameworkComponent } from '../../frameworkComponent';
const path = require('path');

export class VisitLibrary {

    constructor() {
        FrameworkComponent.logHelper.info("*********** Visit Controller ***********")
    }

    async getVisitDetailsByVisitId(specData: SpecFile) {
        try {
            FrameworkComponent.logHelper.info("*********** Get Visit Details By Patient Visit ID  ***********");
            let __options = await this.getVisitDetailsByVisitIdOptions(specData);
            FrameworkComponent.logHelper.info(__options);

            let __response = await FrameworkComponent.apiServiceHelper.makeApiCall(__options).then((response) => {
                FrameworkComponent.logHelper.info(response);
                return response;
            });

            let __visitDetails = await FrameworkComponent.apiServiceHelper.parseResultOfMakePostRequest(__response).then((response) => {
                FrameworkComponent.logHelper.info(response);
                specData.Data.Client.Patient.Visit.VisitInvoiceItem = response[0].VisitInvoiceItems;

                for (let items of specData.Data.Client.Patient.Visit.VisitInvoiceItem) {
                    FrameworkComponent.logHelper.info("Visit Invoice Details :" + JSON.stringify(items));
                    FrameworkComponent.logHelper.info("Visit Invoice Details [Visit Invoice Item Id]" + items.visitinvoiceitemid);
                    FrameworkComponent.logHelper.info("Visit Invoice Details [Invoice Item Id]" + items.invoiceitemid);
                }
            });
        } catch (error) {
            FrameworkComponent.logHelper.error(error);
            throw error;
        }
    }

    getVisitDetailsByVisitIdOptions(specData: SpecFile) {
        try {
            FrameworkComponent.logHelper.info('*********** Gettting Visit Details and Invoice Items by Visit Id ***********');

            let __options = DataReader.loadAPITemplates("getOrders"); // require(path.join(__dirname, '../../../../applicationComponent/data/apiTemplates/getOrders.json'));

            //Set URL
            __options.url = TestBase.GlobalData.EnvironmentDetails.wwapiendpoint + 'Orders';

            //Set header values
            __options.headers['x-hospital-id'] = TestBase.GlobalData.EnvironmentDetails.hospitalid;
            __options.headers.authorization = TestBase.GlobalData.GlobalAuthToken;

            //Add visit Id to query
            __options.qs.visitIds = specData.Data.Client.Patient.Visit.VisitId;
            return __options;
        } catch (error) {
            FrameworkComponent.logHelper.error(error);
            throw error;
        }
    }


    async getVisitResources(specData: SpecFile) {
        try {
            FrameworkComponent.logHelper.info("*********** Get Resources of the visit Details ***********");
            let __options = this.getVisitResourcesOptions(specData);
            FrameworkComponent.logHelper.info(__options);

            let __response = await FrameworkComponent.apiServiceHelper.makeApiCall(__options).then((response) => {
                return response;
            });
            let __visitDetails = await FrameworkComponent.apiServiceHelper.parseResultOfMakePostRequest(__response).then((response) => {
                specData.Data.Client.Patient.Visit.VisitInvoiceItem = response[0].VisitInvoiceItems;

                for (let i in response) {
                    // browser.logger(response[i]);
                    let user = response[i];
                    if (user['ADusername'] == TestBase.GlobalData.EnvironmentDetails.username) {
                        FrameworkComponent.logHelper.info('UserId: ', user['ResourceId']);
                        specData.UserId = user['ResourceId'];
                    }
                }
            });
        } catch (error) {
            FrameworkComponent.logHelper.error(error);
            throw error;
        }
    }

    getVisitResourcesOptions(specData: SpecFile) {
        try {
            FrameworkComponent.logHelper.info('**************************** Getting User Details *************************************');
            let __options = DataReader.loadAPITemplates("getVisitResources"); //require(path.join(__dirname, '../../../../applicationComponent/data/apiTemplates/getVisitResources.json'));

            //Set URL
            __options.url = TestBase.GlobalData.EnvironmentDetails.wwapiendpoint + 'VisitResources';

            //Set header values
            __options.headers['x-hospital-id'] = TestBase.GlobalData.EnvironmentDetails.hospitalid;
            __options.headers.authorization = TestBase.GlobalData.GlobalAuthToken;
            return __options;
        } catch (error) {
            FrameworkComponent.logHelper.error(error);
            throw error;
        }
    }
}