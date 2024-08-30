const env = (await import("$/server/env.js")).default;
const eq = (await import("$/server/database/helpers/exists.db.js")).default;
const pq = (await import("$/server/database/helpers/promise_query.db.js")).default;

export default async function (product_name, request) {
    // validate
    if (typeof product_name != "string" || !product_name) {
        throw { error: { msg: "Invalid Product" }, status_code: env.response.status_codes.invalid_field };
    }

    // existance checking
    const qproduct = await eq.one("products", "name", product_name);
    if (qproduct) {
        return qproduct.product_id;
    } else {
        const insertion_query = `
            insert into products (name, created_by_user) values
            (
                '${product_name}',
                '${request?.user?.user_id || 1}'
            )
        `;
        await pq(insertion_query);

        const select_query = `
            select product_id from products where name = '${product_name}';
        `;
        return (await pq(select_query))[0].product_id;
    }
}
