import { DateInterface } from './date-interface';

export interface User {
    profile: Profile;
    statistics?: Statistics;
}

export interface Statistics {
    new_candidates?: number;
    pending_interviews?: number;
    pending_rewards?: number;
    pending_refound?: number;
}

export interface Profile {
    uid: string;
    rfc?: string;
    giro?: string;
    name?: string;
    type?: 'client' | 'recruiter' | 'admin' | 'superAdmin';
    curp?: string;
    clabe?: number;
    email?: string;
    sector?: string;
    avatar?: string;
    status?: 'Active' | 'Block';
    career?: string;
    address?: string;
    nickname?: string;
    extension?: string;
    name_bank?: string;
    update_Date?: number;
    reason_block?: string;
    registerDate?: number;
    name_contact?: string;
    company_name?: string;
    business_name?: string;
    phone_company?: number;
    account_number?: number;
    level_of_study?: number;
    personal_phone?: number;
    lastSession: number;
    area_of_interest?: number;
    birthdate?: DateInterface;
}
