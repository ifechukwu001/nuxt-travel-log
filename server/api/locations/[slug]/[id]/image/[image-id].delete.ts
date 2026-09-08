import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import z from "zod";

export default defineAuthenticatedEventHandler(async (event) => {
  const { slug, id, "image-id": imageId } = getRouterParams(event);

  if (!z.coerce.number().safeParse(imageId).success) {
    return sendError(event, createError({
      statusCode: 422,
      statusMessage: "Invalid image id",
    }));
  }

  await event.$fetch(`/api/locations/${slug}/${id}`);

  const deleted = await deleteLocationLogImage(Number(imageId), event.context.user.id);

  if (deleted) {
    const client = createS3Client();
    const command = new DeleteObjectCommand({
      Bucket: env.S3_BUCKET,
      Key: deleted.key,
    });

    await client.send(command);
  }

  setResponseStatus(event, 204);
});
