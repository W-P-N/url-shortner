import { Router } from "express";
import { redirectLink, createLink } from "../controllers/link.controller.js";

const router = Router();

router.post('/link', createLink);

const redirectRouter = Router();
redirectRouter.get('/:link', redirectLink);

export {
    router as apiRouter,
    redirectRouter
};
