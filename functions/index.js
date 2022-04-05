const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();


//USER ROLES
exports.addUserRole = functions.https.onCall((data,context)=>{
    return admin.auth().getUserByEmail(data.email).then(user=>{
        return admin.auth().setCustomUserClaims(user.uid,{
            admin : false,
            donor : true,
            staff : false,
        });
    }).then(()=>{
        return {
            status : true
        }
    }).catch(error =>{
        return {status : false}
    });
});

//STAFF ROLE
exports.addStaffRole = functions.https.onCall((data,context)=>{
    return admin.auth().getUserByEmail(data.email).then(user=>{
        return admin.auth().setCustomUserClaims(user.uid,{
            admin : false,
            donor : false,
            staff : true,
            enabled : true
        });
    }).then(()=>{
        
        return {
            status : true
        }
    }).catch(error =>{
        return {status : false}
    });
});

//Disable the staff
exports.disableStaffRole = functions.https.onCall((data,context)=>{
    return admin.auth().getUserByEmail(data.email).then(user=>{
        return admin.auth().setCustomUserClaims(user.uid,{
            admin : false,
            donor : false,
            staff : true,
            enabled : false
        });
    }).then(()=>{
        // admin.firestore().collection("staff").doc(user.uid).set({
        //     enabled : false
        // });
        return {
            status : true
        }
    }).catch(error =>{
        return {status : false}
    });
});

//Enable the staff
exports.enableStaffRole = functions.https.onCall((data,context)=>{
    return admin.auth().getUserByEmail(data.email).then(user=>{
        return admin.auth().setCustomUserClaims(user.uid,{
            admin : false,
            donor : false,
            staff : true,
            enabled : true
        });
    }).then(()=>{
        // admin.firestore().collection("staff").doc(user.uid).set({
        //     enabled : true
        // });
        return {
            status : true
        }
    }).catch(error =>{
        return {status : false}
    });
});


//on notify poster
exports.onNotifyPoster = functions.firestore
  .document('posters/{docId}')
  .onCreate( async (snapshot, context) => { 
      console.log(snapshot.id);
      let title1 = "Blood Transfusion service";
      let url = snapshot.data().url;

      let tokens = [];
      let userDevices = await admin.firestore().collection('fcm').get();

      userDevices.forEach(doc =>{
        tokens.push(doc.id);
      })
     
      const message = {
          notification : {title : title1},
          data : {url : url, type : "poster"}
      };

      admin.messaging().sendToDevice(tokens,message).then(response =>{
             console.log("------------------->notification sent");
          });
  });

//on notify campaign
exports.onNotifyCampaign = functions.firestore
  .document('campaignPromo/{docId}')
  .onCreate( async (snapshot, context) => { 
      console.log(snapshot.id);

      let title1 = "New Blood Donation Campaign";
      let description = snapshot.data().location;
      let url = snapshot.data().url;

      let tokens = [];
      let userDevices = await admin.firestore().collection('fcm').get();

      userDevices.forEach(doc =>{
        tokens.push(doc.id);
      })
     
      const message = {
          notification : {title : title1, body : description},
          data : {url : url, type : "campaign"}
      };

      admin.messaging().sendToDevice(tokens,message).then(response =>{
             console.log("------------------->notification sent");
          });
  });
  
//on notify request
exports.onNotifyRequest = functions.firestore
  .document('donationRequests/{docId}')
  .onCreate( async (snapshot, context) => { 
      
      let title1 = "Donating Invitation";
      let description = snapshot.data().location;
      
      console.log(description);
      let tokens = [];
      let userDevices = await admin.firestore().collection('fcm').get();

      userDevices.forEach(doc =>{
        tokens.push(doc.id);
      })
     
      const message = {
          notification : {title : title1, body : description},
          data : {url : "this is url", type : "request"}
      };

      admin.messaging().sendToDevice(tokens,message).then(response =>{
             console.log("------------------->notification sent");
          });
      
  });  

  

// exports.scheduledFunctionCrontab = functions.pubsub.schedule('every 1 minutes')
//   .timeZone('Asia/Kolkata') // Users can choose timezone - default is America/Los_Angeles
//   .onRun((context) => {
//     var db = admin.firestore();
//     db.collection("posters").get().then(snapshot => {
//             var today = new Date();
//             var dd = today.getDate();
//             var mm = today.getMonth()+1; 
//             var yyyy = today.getFullYear();

//             if(dd<10) {
//                 dd='0'+dd;
//             } 

//             if(mm<10) {
//                 mm='0'+mm;
//             }

//             today = yyyy+'-'+mm+'-'+dd;

//         snapshot.forEach(doc =>{
            
            
//             console.log('-------------------------------------------- HIT');

//             if(doc.data().expireDate == today){
//                 console.log( doc.id);
//             }
            
//         });
//     });
  
//   return null;
// });

// exports.sendNotificationToFCMToken =
// functions.firestore.document('notifications/{nUid}')
// .onWrite(async (event) => {
// const user_id = event.after.get('user_id');
// const title = event.after.get('title');
// const content = event.after.get('content');
// let userDevices = await admin.firestore()
// .collection('devices')
// .where('userid','==', user_id)
// .where('is_enable','==', true)
// .get();



// let token;
// console.log('Start sending message');
// userDevices.forEach(doc => {
// token = doc.get('token');
// console.log(token);
// var message = {
// notification: {
// title: title,
// body: content,
// },
// token: token,
// }
// admin.messaging().send(message).then(response => {
// console.log('Successfully sent message:', response);
// }).catch(error => {
// console.log('Error sending message:', error);
// })
// });
// console.log('Finished sending message');
// });



// const db = admin.firestore();
// exports.saveNotificationsOnNotificationCollection =
// functions.firestore.document('notifications_queue/{nUid}')
// .onWrite((change, context) => {
// const title = change.after.get('title');
// const content = change.after.get('content');
// const type = change.after.get('type');
// const audience = change.after.get('audience');
// const is_visible = change.after.get('is_visible');
// const user_id = change.after.get('user_id');
// const course_id = change.after.get('course_id');



// if (true === is_visible && null != course_id && 'specific_subject' === audience) {
// const snapshot = db.collection('chats')
// .where('subject_id','==', course_id)
// .get();
// snapshot.then(doc => {
// return doc.docs.forEach(data => {
// let users = data.get('users');
// for (let i = 0; i < users.length; i++) {
// db.collection('notifications')
// .doc()
// .set({
// title: title,
// content: content,
// type: type,
// user_id: user_id,
// created_at: admin.firestore.FieldValue.serverTimestamp(),
// }).catch(error => {
// console.log('Error in save notification:', error);
// }).catch(error => {
// console.log('Error in save notification:', error);
// })
// }
// })
// });
// } else if (true === is_visible && null != user_id && 'specific_user' === audience) {
// db.collection('notifications')
// .doc()
// .set({
// title: title,
// content: content,
// type: type,
// user_id: user_id,
// created_at: admin.firestore.FieldValue.serverTimestamp(),
// }).catch(error => {
// console.log('Error in save notification:', error);
// }).catch(error => {
// console.log('Error in save notification:', error);
// })
// } else if (true === is_visible && 'all_user' === audience) {
// const device_snapshot = db.collection('devices')
// .get();
// device_snapshot.then(device_doc => {
// return device_doc.docs.forEach(device_data => {
// let userid = device_data.get('userid');
// db.collection('notifications')
// .doc()
// .set({
// title: title,
// content: content,
// type: type,
// user_id: userid,
// created_at: admin.firestore.FieldValue.serverTimestamp(),
// }).catch(error => {
// console.log('Error in save notification:', error);
// }).catch(error => {
// console.log('Error in save notification:', error);
// })
// })
// });
// }
// });


