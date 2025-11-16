import { S3Client, PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION!,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
  },
});

const uploadImageToS3 = async (file: File): Promise<string> => {
  const bucketName = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!;
  const region = process.env.NEXT_PUBLIC_AWS_REGION!;
  const key = `${Date.now()}_${file.name}`;

  // Convert File → Uint8Array
  const arrayBuffer = await file.arrayBuffer();
  const bodyContent = new Uint8Array(arrayBuffer);

  // Define params with correct type
  const params: PutObjectCommandInput = {
    Bucket: bucketName,
    Key: key,
    Body: bodyContent,           // Valid: Uint8Array
    ContentType: file.type,
    // ACL: "public-read",       // REMOVED — deprecated + type error
  };

  try {
    await s3Client.send(new PutObjectCommand(params));

    const imageUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
    return imageUrl;
  } catch (error) {
    throw error;
  }
};

export default uploadImageToS3;