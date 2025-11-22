const uniqueString = require("unique-string");
var mv = require("mv");
const jo = require('jpeg-autorotate')
const options = {quality: 100}
var fs = require('fs');
const piexif = require('piexifjs');

var filesService = {
  getPath: function(key, jobId) {
    let targetPath = '';
      if (key === "utilities") {
          targetPath =
              "../backend/public/img/jobs/" +
              jobId +
              "/reports/utilities/";
      } else if (key === "keys") {
          targetPath =
              "../backend/public/img/jobs/" +
              jobId +
              "/reports/keys/";
      } else if (key === "manuals") {
          targetPath =
              "../backend/public/img/jobs/" +
              jobId +
              "/reports/manuals/";
      } else if (key === "frontview_image") {
          targetPath =
              "../backend/public/img/jobs/" +
              jobId +
              "/reports/frontview_image/";
      } else if (key === "full_reports") {
          targetPath =
              "../backend/public/img/jobs/" +
              jobId +
              "/reports/full_reports/";
      }

      return targetPath;
  },
  saveImages: function(file, targetPath, cb) {
    if (file != null) {
      if (file != undefined) {
        let imageName = file.name;
        let indexTypeImage = imageName.lastIndexOf(".");
        let imageExtension = imageName.substring(
          indexTypeImage,
          imageName.length
        );
        let imageNewName = uniqueString() + imageExtension;
        targetPath = targetPath + imageNewName;
        let tempPath = file.tempFilePath;
        mv(tempPath, targetPath, { mkdirp: true }, function(err) {
          if (err) {
            console.log('MOVE ERROR', err);
            cb(imageNewName);
          } else {
            cb(false);
          }
        });
      } else {
        cb(false);
      }
    } else {
      cb(false);
    }
  },
  deleteThumbnailFromExif: function(imageBuffer)
  {
    try {
      const imageString = imageBuffer.toString('binary')
      const exifObj = piexif.load(imageString)
      delete exifObj.thumbnail
      delete exifObj['1st']
      const exifBytes = piexif.dump(exifObj)
      const newImageString = piexif.insert(exifBytes, imageString)
      return Buffer.from(newImageString, 'binary');
    } catch(e) {
      return imageBuffer;
    }
  }
};

module.exports = filesService;