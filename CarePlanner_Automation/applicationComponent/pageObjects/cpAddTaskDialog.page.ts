import { $, browser, element, by, By, ExpectedConditions } from "protractor";
import { FrameworkComponent } from '../../frameworkComponent';

export class AddOptionalTaskDialog {
    //Page Objects
    addTaskDialogButton = element(by.xpath("//button[contains(@id,'addtask')]"));
    addTasksToScheduleButton = element(by.xpath("//wj-popup[@id='addtask']//div[@class='buttons pull-right oButton']//button[contains(text(),'Add to schedule')]"));
    cancelButton = element(by.xpath("//wj-popup[@id='addtask']//button[contains(text(),'Cancel')]"));
    addTaskHeaderClose = element(by.xpath("//wj-popup[@id='addtask']//div[@class='icon closeButton']"));

    addTaskDialogHeaderTitle = element(by.xpath("//wj-popup[@id='addtask']//div[contains(@class,'text')]"));

    // these will need to be replaced with more generic/better locators later
    // because hardcoding is bad
    // bodyWeightListItem = element(by.xpath("//wj-popup[@id='addtask']//*[@id='patientcare']//div[contains(text(),'Body weight')]"));
    // selectedBodyWeightListItem = element(by.xpath("//wj-popup[@id='addtask']//wj-flex-grid[@id='selected']//div[contains(text(),'Body weight')]"));    

    selectedListHeader = element(by.xpath("//wj-popup[@id='addtask']//wj-flex-grid[@id='selected']//div[@class='wj-cell wj-group']"));

    // Locator for user-specified task in the task list
    taskLocatorBaseString = "//wj-popup[@id='addtask']//*[@id='patientcare']//div[contains(text(),'variable')]";
    userDefinedLocatorXPath = '';
    userDefinedListItem = element(by.xpath(this.userDefinedLocatorXPath));

    // locator for the selected user-defined task in the selected tasks list
    selectedTaskLocatorBaseString = "//wj-popup[@id='addtask']//wj-flex-grid[@id='selected']//div[contains(text(),'variable')]"
    userDefinedSelectedTaskLocatorXPath = '';
    userDefinedSelectedListItem = element(by.xpath(this.userDefinedSelectedTaskLocatorXPath));

    // element(by.xpath());
    //page methods

    openAddTaskDialog() {
        try { this.addTaskDialogButton.click(); }
        catch (error) { FrameworkComponent.logHelper.error(error); }
    }

    closeAddTaskDialog() {
        try { this.addTaskHeaderClose.click(); }
        catch (error) { FrameworkComponent.logHelper.error(error); }
    }

    selectTaskFromList() {
        try { this.userDefinedListItem.click(); }
        catch (error) { FrameworkComponent.logHelper.error(error); }
    }

    addSelectedTasksToScheduler() {
        try { this.addTasksToScheduleButton.click(); }
        catch (error) { FrameworkComponent.logHelper.error(error); }
    }

    get selectedTaskName(): any {
        try { return this.userDefinedSelectedListItem.getText(); }
        catch (error) { FrameworkComponent.logHelper.error(error); }
    }

    get getSelectHeaderText(): any {
        //to get the count, slice (-3) in the calling method
        try { return this.selectedListHeader.getText(); }
        catch (error) { FrameworkComponent.logHelper.error(error); }
    }

    get getAddTaskHeaderTitle(): any {
        try { return this.addTaskDialogHeaderTitle.getText(); }
        catch (error) { FrameworkComponent.logHelper.error(error); }
    }

    setTaskLocatorString(variable) {
        this.userDefinedLocatorXPath = this.taskLocatorBaseString.replace('variable', variable);
        this.userDefinedSelectedTaskLocatorXPath = this.selectedTaskLocatorBaseString.replace('variable', variable);
        this.userDefinedListItem = element(by.xpath(this.userDefinedLocatorXPath));
        this.userDefinedSelectedListItem = element(by.xpath(this.userDefinedSelectedTaskLocatorXPath));
        // FrameworkComponent.logHelper.warn(this.userDefinedLocatorXPath);
        // FrameworkComponent.logHelper.warn(this.userDefinedSelectedTaskLocatorXPath);
    }


}
