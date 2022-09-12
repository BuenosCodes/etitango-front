import { AdministrationItem } from "./event_administration";

interface AccountabilityItem extends AdministrationItem {
    administrationItemIds: Array<string>;
    isApproved: boolean;
}