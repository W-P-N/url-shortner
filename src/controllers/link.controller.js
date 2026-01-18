import { nanoid } from "nanoid";
import { getClient } from "../config/redis.js";
import { validateLink } from "../utils/validator.js";
import AppConfig from "../config/env.js";

export async function redirectLink(req, res) {
    try {
        const client = await getClient();
        const { link } = req.params;
        console.log(link);
        if(!link || link.length < AppConfig.LINK_LENGTH) {
            return res.status(400).send({
                message: "Invalid input"
            });
        }
        const long_url = await client.get(`links:${link}`);
        console.log(long_url);
        if(long_url) {
            return res.redirect(301, long_url);
        };
        return res.status(404).send({
            message: 'URL not found'
        });
    } catch (error) {
        console.error('Redirect Error:', error);
        return res.status(500).send({
            message: "Internal Server Error"
        });
    };
};

export async function createLink(req, res) {
    const client = await getClient();
    const validationResult = validateLink(req.body);
    if(!validationResult.success) {
        return res.status(400).json({
            errors: validationResult.error.issues
        });
    };
    const { url } = validationResult.data;
    const maxRetries = 5;
    let short_code;
    let success = false;

    for(let i=0; i<maxRetries; i++) {
        short_code = nanoid(AppConfig.LINK_LENGTH);
        const result = await client.setNX(`links:${short_code}`, url);
        if(result === 1) {
            success = true;
            break;
        };
    };

    if(!success) {
        return res.status(500).send({
            message: "Failed to generate unique link."
        });
    };

    const newUrl = `${AppConfig.APP_BASE_URL}/${short_code}`;
    return res.status(200).send({
        data: newUrl,
        message: "success"
    });
}

