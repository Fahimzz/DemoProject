#Run 
1. install npm (npm install)
2. npm start 
The front end and backed is in all together. 
The port is 4444 
After Running the project Paste this in your browser.
http://localhost:4444/

The Apis' write in Server.js file.
/uploaddata is the API for uploading data.txt, with postman you have to select form-data
key:txt(type File) and value should be a txt file.
This Api will upload the file, insert it into mongodb dump_collections and calculate the worker count and insert it into the hourly_worker_count collection.

Initially the database is clear. you can upload a file and then you can see.