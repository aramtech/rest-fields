const client = (await import("$/server/database/prisma.ts")).default;

const find_region = async function (region_name, city_name, country_name) {
    if (typeof region_name == "string" && region_name && typeof city_name == "string" && city_name && typeof country_name == "string" && country_name) {
        let country;
        country = await client.countries.findFirst({
            where: {
                deleted: false,
                name: country_name,
            },
        });
        if (!country) {
            country = await client.countries.create({
                data: {
                    deleted: false,
                    name: country_name,
                },
            });
        }
        let city;
        city = await client.cities.findFirst({
            where: {
                AND: {
                    country: {
                        deleted: false,
                        country_id: country.country_id,
                    },
                    deleted: false,
                    name: city_name,
                },
            },
        });
        if (!city) {
            city = await client.cities.create({
                data: {
                    name: city_name,
                    country: {
                        connect: {
                            country_id: country.country_id,
                        },
                    },
                },
            });
        }
        let region;
        region = await client.regions.findFirst({
            where: {
                AND: {
                    city: {
                        deleted: false,
                        city_id: city.city_id,
                    },
                    deleted: false,
                    name: region_name,
                },
            },
        });
        if (!region) {
            region = await client.regions.create({
                data: {
                    name: region_name,
                    city: {
                        connect: {
                            city_id: city.city_id,
                        },
                    },
                },
            });
        }
        return region;
    } else {
        if (region_name === null && city_name === null && country_name === null) {
            return null;
        } else {
            return undefined;
        }
    }
};

export default find_region;
