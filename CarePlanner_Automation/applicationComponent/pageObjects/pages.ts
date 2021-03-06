import { AddOptionalTaskDialog, CareNoteDialog, CareplannerClientAndPetDetailsPage, CareplannerSchedulerPage, CareplannerTaskOcurrencePopup, CareplannerTaskSchedulerPopup, TreatmentLogPage, TrendViewPage } from '../../applicationComponent';
import { CareplannerWhiteboardPage } from './cpWhiteboard.page';


export class Pages {

    public static get cpClientAndPetDetailsPage(): CareplannerClientAndPetDetailsPage {
        return new CareplannerClientAndPetDetailsPage();
    }

    public static get cpSchedulerPage(): CareplannerSchedulerPage {
        return new CareplannerSchedulerPage();
    }

    public static get cpTaskOccurrencePopup(): CareplannerTaskOcurrencePopup {
        return new CareplannerTaskOcurrencePopup();
    }

    public static get cpTaskSchedulerPopup(): CareplannerTaskSchedulerPopup {
        return new CareplannerTaskSchedulerPopup();
    }

    public static get cpCareNoteDialog(): CareNoteDialog {
        return new CareNoteDialog();
    }

    public static get cpAddOptionalTaskDialog(): AddOptionalTaskDialog {
        return new AddOptionalTaskDialog();
    }

    public static get cpTreatmentLogPage(): TreatmentLogPage {
        return new TreatmentLogPage();
    }

    public static get cpTrendViewPage(): TrendViewPage {
        return new TrendViewPage();
    }

    public static get cpWhiteboardPage(): CareplannerWhiteboardPage {
        return new CareplannerWhiteboardPage();
    }

}

// export { CareplannerSchedulerPage } from './careplanner/cpScheduler.page';
// export { CareplannerClientAndPetDetailsPage } from './careplanner/cpClientAndPetDetails.page'

