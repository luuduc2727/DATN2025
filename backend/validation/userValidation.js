import Joi from "joi";

export const registerSchema = Joi.object({
  fullname: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .max(30)
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"))
    .required()
    .messages({
      "string.pattern.base": "Password must include uppercase, lowercase, number, and special character.",
      "string.min": "Password must be at least 8 characters.",
      "string.max": "Password must be under 30 characters.",
    }),
   phoneNumber: Joi.string()
    .pattern(/^[0-9]{9,15}$/)
    .required()
    .messages({
      "string.pattern.base": "Phone number must be numeric and between 9 to 15 digits.",
    }),
   role: Joi.string()
    .valid("student", "recruiter")
    .required()
    .messages({
      "any.only": "Role must be either 'student' or 'recruiter'.",
    }),
});
