import express from "express"
import {postJob, getAllJobs, getJobById, getAdminJobs} from "../controllers/job.controller.js"
import isAuthenticated from "../middleware/isAuthenticated.js";
import checkRole from "../middleware/checkRole.js";
const router = express.Router();

router.route("/postjob").post(isAuthenticated, checkRole("recruiter"), postJob);
router.route("/getalljob").get(getAllJobs);
router.route("/getjob/:id").post(isAuthenticated, getJobById);
router.route("/getadminjob").post(isAuthenticated, checkRole("recruiter"), getAdminJobs);

export default router