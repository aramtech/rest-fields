const env = (await import("$/server/env.js")).default;
const eq = (await import("$/server/database/helpers/exists.db.js")).default;
const pq = (await import("$/server/database/helpers/promise_query.db.js")).default;

export default async function (speciality_name, request) {
    // validate
    if (typeof speciality_name != "string") {
        throw { error: { msg: "Invalid speciality" }, status_code: env.response.status_codes.invalid_field };
    }

    // existance checking
    const qspeciality = await eq.one("specialities", "name", speciality_name);
    if (qspeciality) {
        return qspeciality.speciality_id;
    } else {
        const insertion_query = `
            insert into specialities (name, created_by_user) values
            (
                '${speciality_name}',
                '${request?.user?.user_id || 1}'
            )
        `;
        await pq(insertion_query);

        const select_query = `
            select speciality_id from specialities where name = '${speciality_name}';
        `;
        return (await pq(select_query))[0].speciality_id;
    }
}
