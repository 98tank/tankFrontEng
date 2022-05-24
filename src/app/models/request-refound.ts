import { File } from './mission-data';

export interface RequestRefound {
    pay?: File;
    reason: string;
    status: string;
    net_salary: number;
    request_id: string;
    mission_id: string;
    pay_refound?: File;
    uid_client: string;
    create_date: number;
    update_date: number;
    name_position: string;
    seen_by_admin: boolean;
}
