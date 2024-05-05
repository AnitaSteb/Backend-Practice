const { expect } = require('chai');
const request = require('supertest');
const app = require('../server'); // Assuming your Express app is exported from app.js

describe('File Management Endpoints', () => {
  let fileId;

  // Test case for creating a new file
  it('should create a new file', async () => {
    const newFile = {
      fileName: 'example.txt',
      size: 1024,
      pathToFile: '/path/to/example.txt',
      fileType: 'text/plain',
      fileOwner: 'john_doe',
      sha: 'abcdef123456...',
    };

    const res = await request(app)
      .post('/file')
      .send(newFile)
      .expect(200);

    // Store the created file ID for use in other test cases
    fileId = res.body.id;

    expect(res.body).to.have.property('id');
    expect(res.body.fileName).to.equal(newFile.fileName);
    expect(res.body.size).to.equal(newFile.size);
    expect(res.body.pathToFile).to.equal(newFile.pathToFile);
    expect(res.body.fileType).to.equal(newFile.fileType);
    expect(res.body.fileOwner).to.equal(newFile.fileOwner);
    expect(res.body.sha).to.equal(newFile.sha);
  });

  // Test case for getting file details by ID
  it('should get file details by ID', async () => {
    const res = await request(app)
      .get(`/file/${fileId}`)
      .expect(200);

    expect(res.body).to.have.property('id');
    expect(res.body.id).to.equal(fileId);
  });

  // Test case for deleting a file by ID
  it('should delete a file by ID', async () => {
    await request(app)
      .delete(`/file/${fileId}`)
      .expect(200);

    // Try to get the deleted file (should return 404)
    await request(app)
      .get(`/file/${fileId}`)
      .expect(404);
  });
});
