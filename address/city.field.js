// @ts-nocheck
import { Prisma } from "$/prisma/client/index.js";

const env = (await import("$/server/env.js")).default;

const client = (await import("$/server/database/prisma.ts")).default;

/**
 *
 * @param {String} city_name
 * @param {any} request
 * @param {String} description
 * @param {String} country_name
 * @returns {Prisma.Prisma__citiesClient<import("$/prisma/client/index.js").cities, null>}
 */
export default async function (city_name, request = undefined, description = undefined, country_name = env.client.addressing.defaults.country.name) {
    if (!city_name || !country_name) {
        return undefined;
    }

    let country = await client.countries.findFirst({
        where: {
            name: country_name,
        },
    });
    if (!country) {
        country = await client.countries.create({
            data: {
                name: country_name,
                created_at: new Date(),
                updated_at: new Date(),
                created_by_user: {
                    connect: {
                        user_id: request?.user.user_id || 1,
                    },
                },
                created_by_user_full_name: request?.user.full_name || "Super Administrative User",
                created_by_user_username: request?.user.username || "admin",
                updated_by_user: {
                    connect: {
                        user_id: request?.user.user_id || 1,
                    },
                },
                updated_by_user_full_name: request?.user.full_name || "Super Administrative User",
                updated_by_user_username: request?.user.username || "admin",
                deleted: false,
            },
        });
    }

    let city = await client.cities.findFirst({
        where: {
            name: city_name,
            country: {
                country_id: country.country_id,
            },
        },
    });

    if (!city) {
        city = await client.cities.create({
            data: {
                name: city_name,
                description: description,
                country: {
                    connect: {
                        country_id: country.country_id,
                    },
                },
                created_at: new Date(),
                updated_at: new Date(),
                created_by_user: {
                    connect: {
                        user_id: request?.user.user_id || 1,
                    },
                },
                created_by_user_full_name: request?.user.full_name || "Super Administrative User",
                created_by_user_username: request?.user.username || "admin",
                updated_by_user: {
                    connect: {
                        user_id: request?.user.user_id || 1,
                    },
                },
                updated_by_user_full_name: request?.user.full_name || "Super Administrative User",
                updated_by_user_username: request?.user.username || "admin",
                deleted: false,
            },
        });
    }
    return city;
}
