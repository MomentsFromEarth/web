echo "Start Deploying to AWS S3 Bucket"
aws s3 sync ./dist s3://momentsfrom.earth --region us-east-1 --acl public-read --delete 
echo "Done Deploying to AWS S3 Bucket"

echo "Start Invalidation of AWS CloudFront Cache"
aws configure set preview.cloudfront true
aws cloudfront create-invalidation --distribution-id EZ7I1OOBO3GCK --paths /index.html
echo "Done Invalidation of AWS CloudFront Cache"