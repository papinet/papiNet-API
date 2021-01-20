cmd /c gcloud compute ssh elfralalo@node-01 --command="mkdir /home/elfralalo/papinet-mock-2021-01-16"
cmd /c gcloud compute scp app.js              elfralalo@node-01:/home/elfralalo/papinet-mock-2021-01-16/
cmd /c gcloud compute scp package.json        elfralalo@node-01:/home/elfralalo/papinet-mock-2021-01-16/
cmd /c gcloud compute scp package-lock.json   elfralalo@node-01:/home/elfralalo/papinet-mock-2021-01-16/

cmd /c gcloud compute ssh elfralalo@node-01 --command="mkdir /home/elfralalo/papinet-mock-2021-01-16/samples"
cmd /c gcloud compute scp --recurse samples/ elfralalo@node-01:/home/elfralalo/papinet-mock-2021-01-16/samples/

cmd /c gcloud compute scp orders.json         elfralalo@node-01:/home/elfralalo/papinet-mock-2021-01-16/
cmd /c gcloud compute scp order.A.step-1.json elfralalo@node-01:/home/elfralalo/papinet-mock-2021-01-16/
cmd /c gcloud compute scp order.A.step-2.json elfralalo@node-01:/home/elfralalo/papinet-mock-2021-01-16/
cmd /c gcloud compute scp order.A.step-3.json elfralalo@node-01:/home/elfralalo/papinet-mock-2021-01-16/
cmd /c gcloud compute scp order.A.step-4.json elfralalo@node-01:/home/elfralalo/papinet-mock-2021-01-16/
cmd /c gcloud compute scp order.A.step-5.json elfralalo@node-01:/home/elfralalo/papinet-mock-2021-01-16/
cmd /c gcloud compute scp order.A.step-6.json elfralalo@node-01:/home/elfralalo/papinet-mock-2021-01-16/
cmd /c gcloud compute scp order.B.step-1.json elfralalo@node-01:/home/elfralalo/papinet-mock-2021-01-16/
cmd /c gcloud compute scp order.B.step-2.json elfralalo@node-01:/home/elfralalo/papinet-mock-2021-01-16/
cmd /c gcloud compute scp order.B.step-3.json elfralalo@node-01:/home/elfralalo/papinet-mock-2021-01-16/
cmd /c gcloud compute scp order.B.step-4.json elfralalo@node-01:/home/elfralalo/papinet-mock-2021-01-16/
cmd /c gcloud compute scp order.B.step-5.json elfralalo@node-01:/home/elfralalo/papinet-mock-2021-01-16/
cmd /c gcloud compute scp order.B.step-6.json elfralalo@node-01:/home/elfralalo/papinet-mock-2021-01-16/
cmd /c gcloud compute scp order.B.step-7.json elfralalo@node-01:/home/elfralalo/papinet-mock-2021-01-16/
cmd /c gcloud compute scp order.B.step-8.json elfralalo@node-01:/home/elfralalo/papinet-mock-2021-01-16/
cmd /c gcloud compute scp order.C.step-1.json elfralalo@node-01:/home/elfralalo/papinet-mock-2021-01-16/
cmd /c gcloud compute scp order.C.step-2.json elfralalo@node-01:/home/elfralalo/papinet-mock-2021-01-16/
cmd /c gcloud compute scp order.C.step-3.json elfralalo@node-01:/home/elfralalo/papinet-mock-2021-01-16/
cmd /c gcloud compute scp order.C.step-4.json elfralalo@node-01:/home/elfralalo/papinet-mock-2021-01-16/
cmd /c gcloud compute scp order.C.step-5.json elfralalo@node-01:/home/elfralalo/papinet-mock-2021-01-16/
cmd /c gcloud compute scp order.C.step-6.json elfralalo@node-01:/home/elfralalo/papinet-mock-2021-01-16/
cmd /c gcloud compute scp order.C.step-7.json elfralalo@node-01:/home/elfralalo/papinet-mock-2021-01-16/

cmd /c gcloud compute scp papinet.papinet.io.conf elfralalo@node-01:/home/elfralalo/papinet-mock-2021-01-16/