import { File } from './mission-data';

export interface Reward {
    pay?: File;
    name: string;
    status: 'Paid' | 'Pending';
    voucher?: File;
    amount?: number;
    id_reward: string;
    mission_id: string;
    create_date: number;
    update_date: number;
    uid_client?: string;
    uid_recruiter: string;
    name_position?: string;
    seen_by_recruiter: boolean;
    seen_by_admin: boolean;
}
