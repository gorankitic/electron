import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
    avatarUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
        .onUploadComplete(async ({ metadata, file }) => { }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
