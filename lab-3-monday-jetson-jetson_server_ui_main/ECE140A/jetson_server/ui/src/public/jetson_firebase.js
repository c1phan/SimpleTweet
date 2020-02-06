var firebaseConfig = {
    apiKey: "AIzaSyBWrLYoawtCCILuqkdpaeZ6EEVTSDjujY4",
    authDomain: "jetson-ece140.firebaseapp.com",
    databaseURL: "https://jetson-ece140.firebaseio.com",
    projectId: "jetson-ece140",
    storageBucket: "jetson-ece140.appspot.com",
    messagingSenderId: "873497005613",
    appId: "1:873497005613:web:49bc99dc8ae15c5f7bb2a4",
    measurementId: "G-VKMWHM4HP5"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  var UserDB_REF= firebase.database().ref('Users');
 // firebase.analytics();
  var u_name = document.getElementsByName("username")[0].value;
  var u_email = document.getElementsByName("email")[0].value;
  var u_password = document.getElementsByName("password")[0].value;
  var u_password2 = document.getElementsByName("password2")[0].value;

/*Continue firebase authetnication later*/
function writeUser(u_name, u_email, u_password, u_status){
  var newUserDB_REF = UserDB_REF.push();
  newUserDB_REF.set(	
  {
    "Username" : u_name, 
    "Password" : u_password,
    "Email" : u_email,
    "Status" : u_status
  });
}
function validateUser(u_name, u_password){
  var newUserDB_REF = UserDB_REF.push();
  var user_db_password ="";
  var user_db_status = "";
  firebase.database().ref().child('Users').orderByChild("Username").equalTo(u_name).on("value", function(snapshot) {
    snapshot.forEach((child) => {

      /*This grabs the object of the username if it exists*/
      //console.log(child.val());
      user_db_password = child.val()["Password"];
      user_db_status = child.val()["Status"];
      //console.log("actual user password is: ", child.val()["Password"]);
      //console.log("password typed is ", u_password);
  });
    if (snapshot.exists()) {
       /*The user exists so we check the db password with input password to see if matches*/
       if(user_db_password == u_password && user_db_status == "Verified"){
         alert("Login Approved")
	 open_admin_page();
	 return true;
       }else{
         /*The user does not exist in the database => prompt invalid username/password*/
	 if(user_db_password == u_password && user_db_status=="Pending"){
	   alert("Please Verify Your Account");
	 }else{
           alert("Invalid Username/Passowrd");
	   document.getElementByName('username')[0].value.focus();
	}
       }
     }
  });
  return true;
}

/** returns a list of users with their username and status. used for the admin page**/
function getUsers(){
    var userList = [];
    for(var i in this){
	console.log(this[i]["Username"]);
	console.log(this[i]["Status"]);
	userList.push(
	    {"user": this[i]["Username"], "status": this[i]["Status"]}
	);
	console.log("Wow i'm in a for loop!");
    }
    console.log(userList);
    return userList;
}

/** this will update the user's status. will use when clicking verify on admin page**/
function updateStatus(userId){
    var db = firebase.database();
    db.ref("-Users/"+userId).update({Status: "Verified"});
}
