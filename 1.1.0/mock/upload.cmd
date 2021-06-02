cmd /c gcloud compute ssh elfralalo@node-01 --command="mkdir /home/elfralalo/papinet-mock-service-1-1-0"
cmd /c gcloud compute scp app.js              elfralalo@node-01:/home/elfralalo/papinet-mock-service-1-1-0/
cmd /c gcloud compute scp package.json        elfralalo@node-01:/home/elfralalo/papinet-mock-service-1-1-0/
cmd /c gcloud compute scp package-lock.json   elfralalo@node-01:/home/elfralalo/papinet-mock-service-1-1-0/

cmd /c gcloud compute ssh elfralalo@node-01 --command="mkdir /home/elfralalo/papinet-mock-service-1-1-0/samples"
cmd /c gcloud compute scp --recurse samples/ elfralalo@node-01:/home/elfralalo/papinet-mock-service-1-1-0/samples/

cmd /c gcloud compute ssh elfralalo@node-01 --command="mkdir /home/elfralalo/papinet-mock-service-1-1-0/nginx"
cmd /c gcloud compute scp --recurse nginx/ elfralalo@node-01:/home/elfralalo/papinet-mock-service-1-1-0/nginx/
