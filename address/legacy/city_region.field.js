const eq = (await import("$/server/database/helpers/exists.db.js")).default;
const pq = (await import("$/server/database/helpers/promise_query.db.js")).default;
const env = (await import("$/server/env.js")).default;
export default async (city, region, request) => {
    if (!city || !region) {
        return null;
    }
    if (typeof city != "string" || typeof region != "string") {
        throw { error: { msg: "invalid city or region" }, status_code: env.response.status_codes.invalid_field };
    }

    let qcity = await eq.one("cities", "name", city);
    if (qcity) {
        let qregion = await eq.one("regions", [
            ["name", region],
            ["city_id", qcity.city_id],
        ]);
        if (qregion) {
            return qregion.region_id;
        } else {
            const insertion_query = `insert into regions (name, city_id, created_by_user) values (
                '${region}', '${qcity.city_id}', '${request?.user?.user_id || 1}'
            )`;
            await pq(insertion_query);
            const select_query = `select region_id from regions where city_id = '${qcity.city_id}' and name = '${region}';`;
            const region_id = (await pq(select_query))[0].region_id;
            return region_id;
        }
    } else {
        const city_insertion_query = `insert into cities (name, created_by_user) values (
            '${city}', '${request?.user?.user_id || 1}'
        )`;
        await pq(city_insertion_query);
        const city_select_query = `select city_id from cities where name = '${city}';`;
        const city_id = (await pq(city_select_query))[0].city_id;
        const region_insertion_query = `insert into regions (name, city_id, created_by_user) values (
            '${region}', '${city_id}', '${request?.user?.user_id || 1}'
        )`;
        await pq(region_insertion_query);
        const region_select_query = `select region_id from regions where city_id = '${city_id}' and name = '${region}';`;
        const region_id = (await pq(region_select_query))[0].region_id;
        return region_id;
    }
};
