var Student = {
  name: "Ani_Petrosian",
  
};

Student.updateHTML = function () {
  var studentInfo = this.name;
  document.getElementById("student").innerHTML = studentInfo;
};
