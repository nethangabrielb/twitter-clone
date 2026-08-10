import { once } from 'node:events';

import express from 'express';

import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { errorHandler } from '../src/middlewares/errorHandler.ts';
import { upload } from '../src/middlewares/upload.ts';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

describe('upload middleware enforcement', () => {
  let server: ReturnType<ReturnType<typeof express>['listen']>;
  let baseUrl: string;

  beforeAll(async () => {
    const app = express();

    app.post(
      '/single',
      upload.single('imageUrl'),
      (req, res) => {
        res.json({ status: 'success', data: req.file?.originalname ?? null });
      }
    );

    app.post(
      '/fields',
      upload.fields([{ name: 'avatar' }, { name: 'cover' }]),
      (req, res) => {
        res.json({ status: 'success', data: req.files ? true : false });
      }
    );

    app.use(errorHandler);

    server = app.listen(0);
    await once(server, 'listening');
    const address = server.address();
    if (address === null || typeof address === 'string') {
      throw new Error('Expected an ephemeral TCP port');
    }
    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  afterAll(async () => {
    if (server) {
      server.close();
    }
  });

  const uploadFile = async (
    path: string,
    file: Blob,
    fieldName: string
  ) => {
    const formData = new FormData();
    formData.append(fieldName, file, 'test-file.bin');
    return fetch(`${baseUrl}${path}`, { method: 'POST', body: formData });
  };

  it('rejects a single upload over 5MB with a clean 413 JSON error', async () => {
    const oversized = new Blob([new Uint8Array(MAX_FILE_SIZE + 1)], {
      type: 'image/png',
    });

    const res = await uploadFile('/single', oversized, 'imageUrl');

    expect(res.status).toBe(413);
    await expect(res.json()).resolves.toEqual({
      status: 'error',
      message: 'File is too large. Maximum allowed size is 5MB.',
    });
  });

  it('rejects a non-image single upload instead of storing it', async () => {
    const textFile = new Blob(['plain text that is not an image'], {
      type: 'text/plain',
    });

    const res = await uploadFile('/single', textFile, 'imageUrl');

    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({
      status: 'error',
      message: 'Only image files (JPEG, PNG, WebP, GIF) are allowed.',
    });
  });

  it('accepts an image upload that is under the size limit', async () => {
    const image = new Blob([new Uint8Array(1024)], { type: 'image/png' });

    const res = await uploadFile('/single', image, 'imageUrl');

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({
      status: 'success',
      data: 'test-file.bin',
    });
  });

  it('rejects an oversized avatar via the fields (user profile) upload', async () => {
    const oversized = new Blob([new Uint8Array(MAX_FILE_SIZE + 1)], {
      type: 'image/jpeg',
    });

    const res = await uploadFile('/fields', oversized, 'avatar');

    expect(res.status).toBe(413);
    await expect(res.json()).resolves.toEqual({
      status: 'error',
      message: 'File is too large. Maximum allowed size is 5MB.',
    });
  });

  it('rejects a non-image cover via the fields (user profile) upload', async () => {
    const textFile = new Blob(['not an image'], { type: 'application/pdf' });

    const res = await uploadFile('/fields', textFile, 'cover');

    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({
      status: 'error',
      message: 'Only image files (JPEG, PNG, WebP, GIF) are allowed.',
    });
  });
});
