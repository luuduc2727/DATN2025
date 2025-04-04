import multer from "multer"

const storage = multer.memoryStorage();
export const singleload = multer({storage}).single("file");