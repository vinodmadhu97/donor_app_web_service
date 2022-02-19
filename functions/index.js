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




