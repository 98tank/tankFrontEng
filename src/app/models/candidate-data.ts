import { DateInterface } from './date-interface';
import { File } from './mission-data';

export interface CandidateData {
    cv?: File;
    sex: string;
    name: string;
    email: string;
    phone: string;
    curp?: string;
    block: boolean;
    status: 'Active' | 'Discarded' | 'Hired';
    skills: string;
    guards: string;
    travel: string;
    address: string;
    ingles?: string;
    studies: string;
    comments: string;
    period_1?: string;
    period_2?: string;
    period_3?: string;
    company_1?: string;
    company_2?: string;
    company_3?: string;
    mission_id: string;
    nationality: string;
    position_1?: string;
    position_3?: string;
    position_2?: string;
    create_date: number;
    update_date: number;
    work_permit: string;
    candidate_id: string;
    availability: string;
    uid_client?: string;
    uid_recruiter: string;
    interview?: Interview;
    name_position?: string;
    place_of_birth: string;
    reason_discard?: string;
    achievements_1?: string;
    achievements_2?: string;
    achievements_3?: string;
    curriculumVideo?: string;
    birthdate?: DateInterface;
    specify_children?: string;
    courses_and_certi: string;
    years_of_experience: string;
    seen_by_the_client: boolean;
    type_contract?: TypeContract;
    specialized_software: string;
}
export interface TypeContract {
    client?: Client;
    type: string;
    date: number;
    contacted?: string;
}

interface Client {
    name: string;
    phone: string;
}
export interface Interview {
    status: string;
    channel: string;
    address: string;
    options: Option[];
    position?: string;
    name_candidate?: string;
    name_recruiter?: string;
}

export interface Option {
    date: string;
    selected: boolean;
}
