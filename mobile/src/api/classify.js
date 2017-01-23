import request from './request';

export const Classify = () => {
    return request
        .get('http://account.ottcloud.tv/api/v1/members/all_available_interests.json')
        .then((res) => {
            if (res.status === 200) {
                return res.data.interests
            }
        })
        .catch((e) => {
            console.error(e);
        });

};
