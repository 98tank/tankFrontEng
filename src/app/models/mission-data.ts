import { TypeContract } from './candidate-data';

export interface MissionData {
    pay: File;
    uid: string;
    area: string;
    state?: string;
    levels: string;
    status: 'Pending' | 'Active' | 'Cancelled' | 'Accomplished' | 'Rejected';
    travel: string;
    reward?: number;
    studies: string;
    duration: string;
    comments: string;
    schedule: string;
    languages: string;
    net_salary: number;
    hiringTime: string;
    tank_price?: number;
    mission_id?: string;
    create_date: number;
    update_date: number;
    company_name?: string;
    name_position: string;
    business_days: string;
    status_payment?: 'Paid' | 'Pending';
    position_level?: string;
    request_refound: Refound;
    numberInterviews: number;
    duration_details?: string;
    benefits_details?: string;
    desireble_skills?: string;
    courses_and_certi?: string;
    years_of_experience: string;
    specialized_software: string;
    type_contract?: TypeContract;
    indispensables_skills: string;
}
export interface Refound{
    status: string;
    reason: string;
    update_date: number;
}

export interface File {
    url?: string;
    type?: string;
    name?: string;
    filePath?: string;
  }
