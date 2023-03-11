import { AxiosResponse } from 'axios';

export interface CustomAxiosResponse<T> extends AxiosResponse {
    data: {
        data?: T;
    };
}
