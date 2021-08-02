import { FastifyApp } from "../types/common";
import { nanoid } from "nanoid";
import fs from "fs";
import fsPromise from "fs/promises";
import { resolve } from "path";
import util from "util";
import { pipeline, PassThrough } from "stream";
import sharp from "sharp";
const pump = util.promisify(pipeline);

const BUCKET_DIR = resolve(__dirname, "../../bucket");

// Create initial folders
(async () => {
  let bucketFolderExists;
  try {
    //`stat` throws on folder not found, why Node?
    await fsPromise.stat(`${BUCKET_DIR}`);
    bucketFolderExists = true;
  } catch (err) {
    bucketFolderExists = false;
  } finally {
    if (!bucketFolderExists) {
      await fsPromise.mkdir(`${BUCKET_DIR}`);
    }
  }

  let thumbFolderExists;
  try {
    await fsPromise.stat(`${BUCKET_DIR}/thumb`);
    thumbFolderExists = true;
  } catch (err) {
    thumbFolderExists = false;
  } finally {
    if (!thumbFolderExists) {
      await fsPromise.mkdir(`${BUCKET_DIR}/thumb`);
    }
  }
})();

/**
 * For some reason Sharp uses a lot of listeners, so we have to pump
 * this. I don't really know the exact implications of that yet.
 *
 * - Palhari, 30/01
 */
process.setMaxListeners(30);

export function initFileRoutes(app: FastifyApp, service: {}) {
  /**
   * Create file on Bucket and it's correspondent mimetype
   */
  app.post("/", async (req, res) => {
    const id = nanoid();
    console.log({ id });
    const data = await req.file();

    if (!data) {
      return res.code(500).send({
        error: "File must not be empty!",
      });
    }

    let fileNameArray = data.filename.split(".");
    let fileExtension = fileNameArray[fileNameArray.length - 1];

    await pump(
      data.file,
      fs.createWriteStream(`${BUCKET_DIR}/${id}.${fileExtension}`)
    );

    await fsPromise.writeFile(
      `${BUCKET_DIR}/${id}.${fileExtension}.json`,
      JSON.stringify({
        mimetype: data.mimetype,
      })
    );

    return res.send({
      id: `${id}.${fileExtension}`,
    });
  });

  /**
   * Compresses an image by forcing it to be png
   */
  app.post("/compressed", async (req, res) => {
    try {
      const metaReader = sharp().metadata();
      const jpegCompresser = sharp().jpeg();
      const thumbnailGenerator = sharp().resize(200).jpeg();
      const id = `img_${nanoid()}`;
      console.log({ id });
      const data = await req.file();

      if (!data) {
        return res.code(500).send({
          error: "File must not be empty!",
        });
      }

      // Write file to disk
      let fileExtension = "jpg";
      let jpegCompresserPipe: NodeJS.ReadableStream;

      // If it's already jpg, just pass through
      if (fileExtension === "jpg" || fileExtension === "jpeg") {
        jpegCompresserPipe = data.file.setMaxListeners(30);
      } else {
        jpegCompresserPipe = data.file.pipe(jpegCompresser).setMaxListeners(30);
      }

      let imageStream = fs.createWriteStream(
        `${BUCKET_DIR}/${id}.${fileExtension}`
      );

      await pump(jpegCompresserPipe, imageStream);

      /**
       * Now we invoke Sharp on the image directly to create the thumbnails
       * and check if the dimensions are within constraints
       */
      let originalFile = sharp(`${BUCKET_DIR}/${id}.${fileExtension}`);

      let info = await originalFile.metadata();

      // Create thumbnail
      await originalFile.toFile(`${BUCKET_DIR}/thumb/${id}.${fileExtension}`);

      if (info.width && info.width > 1280) {
        // Create a resized version of the file
        await originalFile
          .resize({ width: 1280 })
          .toFile(`${BUCKET_DIR}/${id}.${fileExtension}.resized`);

        // Overwrite it
        await fsPromise.rename(
          `${BUCKET_DIR}/${id}.${fileExtension}.resized`,
          `${BUCKET_DIR}/${id}.${fileExtension}`
        );
      }

      /**
       * Store a .json with the mimetype so we can decode this later
       */
      await fsPromise.writeFile(
        `${BUCKET_DIR}/${id}.${fileExtension}.json`,
        JSON.stringify({
          mimetype: "image/jpeg",
        })
      );

      return res.send({
        id: `${id}.${fileExtension}`,
      });
    } catch (err) {
      console.log(err);
      res.status(400).send({ err });
    }
  });

  /**
   * Gets file from the Bucket and it's correspondent mimetype
   */
  app.get<{
    Querystring: { thumb?: string };
    Params: { id: string };
  }>("/:id", async (req, res) => {
    let { thumb } = req.query;

    let imagePath = `${BUCKET_DIR}/${req.params.id}`;
    if (thumb) imagePath = `${BUCKET_DIR}/thumb/${req.params.id}`;

    let imageStream = fs.createReadStream(imagePath);

    const fileExists = await doesFileFromStreamExist(imageStream);

    if (fileExists) {
      let mimetypeString = (
        await fsPromise.readFile(`${BUCKET_DIR}/${req.params.id}.json`)
      ).toString();

      let { mimetype } = JSON.parse(mimetypeString);

      res.header("Content-Type", mimetype);

      return res.send(imageStream);
    }

    return res.send({
      message: `File not found with id ${req.params.id}`,
    });
  });

  /**
   * Deletes file from the Bucket and it's correspondent mimetype
   */
  app.delete<{
    Params: { id: string };
  }>("/:id", async (req, res) => {
    let fileExists: boolean;
    let hasThumb: boolean;

    try {
      /**
       * .stat() throws when a file is not found
       */
      await fsPromise.stat(`${BUCKET_DIR}/${req.params.id}`);
      fileExists = true;
    } catch (err) {
      fileExists = false;
    }

    try {
      /**
       * .stat() throws when a file is not found
       */
      await fsPromise.stat(`${BUCKET_DIR}/thumb/${req.params.id}`);
      hasThumb = true;
    } catch (err) {
      hasThumb = false;
    }

    if (hasThumb) {
      await fsPromise.unlink(`${BUCKET_DIR}/thumb/${req.params.id}`);
    }

    if (fileExists) {
      await fsPromise.unlink(`${BUCKET_DIR}/${req.params.id}`);
      await fsPromise.unlink(`${BUCKET_DIR}/${req.params.id}.json`);

      return res.send({
        message: `File with id ${req.params.id} deleted successfully!`,
      });
    }

    return res.send({
      message: `File not found!`,
    });
  });
}

/**
 * Helper function to capture node only stream errors,
 * that tresspasses try/catches.
 *
 * Read more on @see https://stackoverflow.com/questions/17136536/is-enoent-from-fs-createreadstream-uncatchable
 * @param stream
 */
function doesFileFromStreamExist(stream: fs.ReadStream) {
  return new Promise((resolve, reject) => {
    stream.on("error", () => {
      stream.close();
      resolve(false);
    });

    stream.on("ready", () => {
      resolve(true);
    });
  });
}
