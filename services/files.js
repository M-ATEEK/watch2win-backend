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
  saveImages: function(files, key, index, job, cb) {
    if (files != null) {
      let file = files[key + "_" + index];
      if (key === "frontview_image") {
        file = files[index];
      }

      if (file != undefined) {
        let imageName = file.name;
        let indexTypeImage = imageName.lastIndexOf(".");
        let imageExtension = imageName.substring(
          indexTypeImage,
          imageName.length
        );
        let imageNewName = uniqueString() + imageExtension;
        let targetPath = filesService.getPath(key, job._id) + imageNewName;
        let tempPath = file.tempFilePath;
        mv(tempPath, targetPath, { mkdirp: true }, function(err) {
          if (err) {
            console.log('MOVE ERROR', err);
            cb(false);
          } else {

             fs.readFile(targetPath, "binary", function (err, data) {
              if (err) return err;
              let buffer = filesService.deleteThumbnailFromExif(data);
               fs.writeFile(targetPath, buffer, "binary", function (err) {
                console.log('targetPath removed ------', targetPath);
                // START
                jo.rotate(targetPath, options, (error, buffer, orientation, dimensions, quality) => {
                  if (error) {
                    console.log('An error occurred when rotating the file: ' + error.message);
                    cb(imageNewName);
                  } else {
                    console.log('buffer', buffer);
                    console.log('error', error);
                    console.log('orientation', orientation);
                    console.log('dimensions', dimensions);
                    console.log('quality', quality);
                    // save buffer on target path
                    fs.writeFile(targetPath, buffer, "binary", function (err) {
                      console.log('targetPath', targetPath);
                      console.log('saVING binary--', err); // writes out file without error, but it's not a valid image
                      cb(imageNewName);
                    });
                  }
                  // ...Do whatever you need with the resulting buffer...
                });
                // END
              });
            }); 
            
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