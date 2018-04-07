# ReactDemo
A React Demo Webpage, utilizing most of the React programming concepts. Uses OpenBrowserPlugin to open page in browser upon startup. Has a demo of firebase data storage, although as of currently would recommend using firestore which came out half a year ago roughly, despite it being in beta.

To Run:

Unzip files.

Make sure you have 'npm' installed.

Navigate to the folder in console and run 'npm install' to download node_modules(Assuming you have npm).

After npm install finishes running, run in the same place 'npm start' or 'npm run dev'.

..................
Personal Notes:

CASE 1: Firebase/Google Cloud vs AWL(Amazon) vs Azure(Microsoft)

Azure doesn't seem appealing to many people on the forums, and seem more complicated to set up, so I will skip talking about it.

AWL seems be slightly older/started before Google Cloud storage became big, hence its features are vast, and has competitive pricing that matches Google Cloud's, although that depends on the service. Overall is a fair match up when compared to Google Cloud.

Firebase handles as lot of the repetitive hard work for you. Great for starting up an application, handles everything from security, scallibility and offline support, all assuming you are fine working with a Json type, noSQL database. Realtime is another big perk it has for chat systems. Main problems I had was with queries, as there are no jion statements. There are 3 links below that hopefully shed some light, also remember when using firestore vs datastore, that firestore queries are shallow and don't have access to children meaning the structure of the database can be more flexible.
https://www.youtube.com/watch?v=sKFLI5FOOHs

https://www.youtube.com/watch?v=3WTQZV5-roY

https://www.youtube.com/watch?v=Idu9EJPSxiY

https://cloud.google.com/storage-options/
Google Cloud database has a lot more though, see diagram in website. After searching what other big companies use, a lot of them did use BigTable, but mind the fact that they also used like 5 different other database systems depending on which one was best for the particular task, some of the tech from these is covered in my section 'CASE 4'.

CASE 2: Storing Images in firebase, incase you thought of storing images in firestore as binary vs using firebase storage, just use firebase storage.

https://stackoverflow.com/questions/49265931/firestore-database-add-image-to-record

'I would store the images themselves in Cloud Storage for Firebase and then just keep the download URLs in Cloud Firestore. Cloud Storage is approximately 7x cheaper in terms of storage costs, has much larger limits in terms of maximum file size, and by grabbing these download URLs, you can take advantage of third-party libraries like Picasso and Glide that can manage the image downloading for you, while also adding nifty features like memory or disk caching or showing placeholder graphics.'


CASE 3: Middle end between client and firebase?

Use Google cloud functions, they are eseentially act triggers upon a database change, and alliviate as a middle man for cusotm logic on the server-side between the client and the data.


CASE 4: Cassandra, Redis, HBase and Hadoop came up often when looking at Twitter and Facebook.

CASE 5: Examine using SQL with some noSQL approach like Firebase, what would be the benefit of this stack?
