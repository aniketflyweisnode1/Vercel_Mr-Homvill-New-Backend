const busboy = require('busboy');
const { uploadToS3, s3Config } = require('../config/s3Config');
const path = require('path');

/**
 * Upload single file to S3
 */
const uploadSingleFile = async (req, res) => {
  try {
    // Check if content type is multipart/form-data
    const contentType = req.headers['content-type'];
    if (!contentType || !contentType.includes('multipart/form-data')) {
      return res.status(400).json({
        success: false,
        message: 'Content-Type must be multipart/form-data for file uploads',
        expectedContentType: 'multipart/form-data',
        receivedContentType: contentType || 'not provided'
      });
    }

    const busboyInstance = busboy({ 
      headers: req.headers,
      limits: {
        fileSize: s3Config.maxFileSize
      }
    });

    let uploadedFile = null;
    let folder = 'uploads';

    busboyInstance.on('field', (fieldname, value) => {
      if (fieldname === 'folder') {
        folder = value || 'uploads';
      }
    });

    busboyInstance.on('file', async (fieldname, file, filename, encoding, mimetype) => {
      try {
        // Validate file type
        if (!s3Config.allowedFileTypes.includes(mimetype)) {
          return res.status(400).json({
            success: false,
            message: 'File type not allowed',
            allowedTypes: s3Config.allowedFileTypes
          });
        }

        // Read file data
        const chunks = [];
        file.on('data', (chunk) => {
          chunks.push(chunk);
        });

        file.on('end', async () => {
          const fileData = Buffer.concat(chunks);
          
          const fileObject = {
            name: filename,
            data: fileData,
            mimetype: mimetype,
            size: fileData.length
          };

          // Upload to S3
          const uploadResult = await uploadToS3(fileObject, folder);
          
          if (uploadResult.success) {
            uploadedFile = {
              fileName: uploadResult.fileName,
              url: uploadResult.url,
              key: uploadResult.key,
              size: fileData.length,
              mimetype: mimetype,
              folder: folder
            };
          } else {
            return res.status(500).json({
              success: false,
              message: 'File upload failed',
              error: uploadResult.error
            });
          }
        });
      } catch (error) {
        console.error('File processing error:', error);
        return res.status(500).json({
          success: false,
          message: 'File processing failed',
          error: error.message
        });
      }
    });

    busboyInstance.on('finish', () => {
      if (uploadedFile) {
        res.status(200).json({
          success: true,
          message: 'File uploaded successfully',
          data: uploadedFile
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }
    });

    busboyInstance.on('error', (error) => {
      console.error('Busboy error:', error);
      res.status(400).json({
        success: false,
        message: 'File upload error',
        error: error.message
      });
    });

    req.pipe(busboyInstance);

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Upload multiple files to S3
 */
const uploadMultipleFiles = async (req, res) => {
  try {
    // Check if content type is multipart/form-data
    const contentType = req.headers['content-type'];
    if (!contentType || !contentType.includes('multipart/form-data')) {
      return res.status(400).json({
        success: false,
        message: 'Content-Type must be multipart/form-data for file uploads',
        expectedContentType: 'multipart/form-data',
        receivedContentType: contentType || 'not provided'
      });
    }

    const busboyInstance = busboy({ 
      headers: req.headers,
      limits: {
        fileSize: s3Config.maxFileSize,
        files: 10 // Maximum 10 files
      }
    });

    const uploadedFiles = [];
    let folder = 'uploads';

    busboyInstance.on('field', (fieldname, value) => {
      if (fieldname === 'folder') {
        folder = value || 'uploads';
      }
    });

    busboyInstance.on('file', async (fieldname, file, filename, encoding, mimetype) => {
      try {
        // Validate file type
        if (!s3Config.allowedFileTypes.includes(mimetype)) {
          console.log(`File type ${mimetype} not allowed for ${filename}`);
          return;
        }

        // Read file data
        const chunks = [];
        file.on('data', (chunk) => {
          chunks.push(chunk);
        });

        file.on('end', async () => {
          const fileData = Buffer.concat(chunks);
          
          const fileObject = {
            name: filename,
            data: fileData,
            mimetype: mimetype,
            size: fileData.length
          };

          // Upload to S3
          const uploadResult = await uploadToS3(fileObject, folder);
          
          if (uploadResult.success) {
            uploadedFiles.push({
              fileName: uploadResult.fileName,
              url: uploadResult.url,
              key: uploadResult.key,
              size: fileData.length,
              mimetype: mimetype,
              folder: folder
            });
          }
        });
      } catch (error) {
        console.error(`File processing error for ${filename}:`, error);
      }
    });

    busboyInstance.on('finish', () => {
      res.status(200).json({
        success: true,
        message: `${uploadedFiles.length} file(s) uploaded successfully`,
        data: uploadedFiles
      });
    });

    busboyInstance.on('error', (error) => {
      console.error('Busboy error:', error);
      res.status(400).json({
        success: false,
        message: 'File upload error',
        error: error.message
      });
    });

    req.pipe(busboyInstance);

  } catch (error) {
    console.error('Multiple upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get file upload configuration
 */
const getUploadConfig = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Upload configuration retrieved successfully',
      data: {
        maxFileSize: s3Config.maxFileSize,
        allowedFileTypes: s3Config.allowedFileTypes,
        bucketName: s3Config.bucketName,
        region: s3Config.region
      }
    });
  } catch (error) {
    console.error('Config error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Test endpoint to check if file upload service is working
 */
const testFileUpload = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'File upload service is working',
      data: {
        service: 'File Upload Service',
        status: 'active',
        timestamp: new Date().toISOString(),
        instructions: {
          singleUpload: 'POST /file-upload/single with multipart/form-data',
          multipleUpload: 'POST /file-upload/multiple with multipart/form-data',
          config: 'GET /file-upload/config',
          note: 'All endpoints require Bearer token authentication'
        }
      }
    });
  } catch (error) {
    console.error('Test error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  uploadSingleFile,
  uploadMultipleFiles,
  getUploadConfig,
  testFileUpload
};
