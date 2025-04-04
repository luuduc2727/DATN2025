import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
// user apply for job
export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;
        if(!jobId){
            return res.status(400).json({
                message: "Job ID is required.",
                success: false
            })
        }

        const existingApplication = await Application.findOne({ job: jobId, applicant: userId });
        if(existingApplication){
            return res.status(400).json({
                message: "You have already applied for this job.",
                success: false
            })
        }

        //check if job exists
        const job = await Job.findById(jobId);
        if(!job){
            return res.status(400).json({
                message: "Job not found.",
                success: false
            })
        }

        const newApplication = await Application.create({
            job: jobId,
            applicant: userId
        })

        job.applications.push(newApplication._id);
        await job.save();
        return res.status(201).json({
            message: "Application submitted successfully.",
            newApplication 
        })
    } catch (error) {
        console.log(error);
    }
}

// get all applications
export const getAppliedJobs  = async (req, res) => {
    try {
        const userId = req.id;
        const application = await Application.find({applicant:userId}).sort({createdAt:-1}).populate({
            path:'job',
            options:{sort:{createdAt:-1}},
            populate:{
                path:'company',
                options:{sort:{createdAt:-1}},
            }
        });

        if(!application){
            return res.status(400).json({
                message: "No applications found.",
                success: false
            })
        }

        return res.status(200).json({
            message: "Applied jobs fetched successfully.",
            application,
            success: true
        })
    } catch(err) {
        console.log(err);
    }
}

// get all applications for a job
export const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.find({job:jobId}).populate({
            path:'applications',
            options:{sort:{createdAt:-1}},
            populate:{
                path:'applicant',
                options:{sort:{createdAt:-1}}        
            }
        });

        if(!job){
            return res.status(400).json({
                message: "No job found.",
                success: false
            })
        }

        return res.status(200).json({
            message: "Applications fetched successfully.",
            job,
            success: true
        })
    } catch(err) {
        console.log(err);
    }
}   

// update application status    
export const updateStatus = async (req, res) => {
    try {
        const applicationId = req.params.id; 
        const {status} = req.body;
        if(!status){
            return res.status(400).json({
                message: "Status is required.",
                success: false
            })
        }

        const application = await Application.findById({_id: applicationId});
        if(!application){
            return res.status(400).json({
                message: "Application not found.",
                success: false
            })
        }

        application.status = status.toLowerCase();
        await application.save();

        return res.status(200).json({   
            message: "Application status updated successfully.",
            application,
            success: true
        })
    } catch(err) {
        console.log(err);
    }
}
