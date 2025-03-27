//middileware --> jane se pahle mujhse mil ke jana

//Multer is a middleware for handling multipart/form-data, which is primarily used for uploading files in Node.js applications. 
//It is commonly used with Express.js to handle file uploads from forms.

import multer from "multer"; //to install use npm i multer

//this is code is in multer documentation(https://www.npmjs.com/package/multer) --> scroll down and see
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    //cb is callback  file option is given by multer( earlier it was not availabel)
    cb(null, "./public/temp"); //return null when no error occured
    //store the file in temp folder(so that we used .gitkeep so that it folder be uploaded on git) else then it will give error path no found
  },
  filename: function (req, file, cb) {
    //help us to give the name of file

    cb(null, file.originalname);
  },
});

export const upload = multer({
  storage, //storage : storage as we are usign es6 so we can write it as storage only (it will be converted to storage: storage)
});
//see user.route.js , if want to see how to upload

//fieldname --> is the name given to input button which recieve file
//<input type="file" name="profileImage"> ---> fieldname is profileImage
// .single(fieldname)
// Accept a single file with the name fieldname. The single file will be stored in req.file.

// .array(fieldname[, maxCount])
// upload.array("images", 5) //fieldname is "images", maxCount is 5
// Accept an array of files, all with the name fieldname. Optionally error out if more than maxCount files are uploaded. The array of files will be stored in req.files.

// .fields(fields)
// Accept a mix of files, specified by fields. An object with arrays of files will be stored in req.files.

// fields should be an array of objects with name and optionally a maxCount. Example:

// [
//   { name: 'avatar', maxCount: 1 },
//   { name: 'gallery', maxCount: 8 }
// ]

//if want to throw error

// destination: function (req, file, cb) {
//   if (someConditionFails) {
//       cb(new Error("Failed to set destination")); // Pass an error object
//   } else {
//       cb(null, "./public/temp"); // No error
//   }
// },
// filename: function (req, file, cb) {
//   if (someOtherConditionFails) {
//       cb(new Error("Failed to set filename")); // Pass an error object
//   } else {
//       cb(null, file.originalname); // No error
//   }
// }
