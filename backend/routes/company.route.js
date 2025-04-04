import express from "express";
import { registerCompany, getCompany, getCompanyById, updateCompany} from "../controllers/company.controller.js"
import isAuthenticated from "../middleware/isAuthenticated.js";
import checkRole from "../middleware/checkRole.js";
const router = express.Router();

router.route("/register").post(isAuthenticated, checkRole("recruiter"), registerCompany);
router.route("/getcompany").get(isAuthenticated, checkRole("recruiter"),  getCompany);
router.route("/getcompany/:id").get(isAuthenticated, checkRole("recruiter"), getCompanyById);
router.route("/updatecompany/:id").put(isAuthenticated, checkRole("recruiter"), updateCompany);

export default router;
