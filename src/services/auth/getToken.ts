import { MEMBERSHIP_API_URL } from '../../constants/api';
import { GetMembershipResponse } from '../../interfaces/responses/getMembershipResponse';
import api from '../api';
import { CustomAxiosResponse } from '../axiosResponse';

export async function getOrgToken(accessToken: string | null) {
    const config = {
        headers: { Authorization: `Bearer ${accessToken}` },
    };
    return await api.get(MEMBERSHIP_API_URL, config).then((response: CustomAxiosResponse<GetMembershipResponse>) => {
        const { status, data } = response;
        const result = data.data;

        if (status === 200 && result != null && result.memberships.length > 0) {
            return result.memberships[0].token;
        }

        return null;
    });
}
