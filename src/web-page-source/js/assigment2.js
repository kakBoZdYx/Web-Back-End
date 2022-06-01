  // Code that runs right after the page is opened
    // I'll be using date object and getTime function that shows miliseconds passed from January 1 1970
    // since it counts miliseconds, I divide every date by 1000 to turn it into just seconds
    // That way I'll just show difference between the time when page last opened and page now opened
    function getCookie(c_name) {
      if (document.cookie.length > 0) {
          c_start = document.cookie.indexOf(c_name + "=");
          if (c_start != -1) {
              c_start = c_start + c_name.length + 1;
              c_end = document.cookie.indexOf(";", c_start);
              if (c_end == -1) c_end = document.cookie.length;
              return unescape(document.cookie.substring(c_start, c_end));
          }
      }
      return "";
    }


    var today = new Date();                   // declaring date object
    var date = localStorage.getItem('time');  // getting item from localStorage for further check
    if (date == null) {                       //checking if site was opened before, since date would be null if so
      localStorage.setItem('time', Math.round(today.getTime()/1000)); // setting current time if page was never opened
    }                    // by the way, every date is divided by 1000 since we need to get seconds from miliseconds
    else {   // code if page was already opened before
      var currentDate = Math.round(today.getTime()/1000); // declaring new currentDate variable for further computing
      var difDate = currentDate - date; // computing difference between times
      localStorage.setItem('time', Math.round(today.getTime()/1000)); // setting new time into localStorage
    }
    var tempCook = document.cookie; // getting data from cookies in case if they exist
    var finalUser = getCookie('user'); // slicing it from 5,  since "user=" takes 5 characters
    var min = localStorage.getItem('truth'); // variable to check if the site has been opened before
    if (min == null) {                       // if it hasn't been opened before of course there would be no 'min' in localStorage, so it would be null
      var usrnmvalue = prompt('Welcome, how would you like us to call you?'); // prompt asks for username and defines variable with input
      document.cookie = "user=" + usrnmvalue;  //declaring cookie "user=" that takes value usrnmvalue that we just have wrote
      localStorage.setItem('truth', true);     //defining 'truth' in localStorage for next times when the page will be opened
    }
    else {                    // if page has been already opened
      alert('Hello, ' + finalUser + '! Last time you were in this page ' + difDate + ' second(s) ago!'); // it'll just show all the computed and found vars that has been defined throughout the code
    }
      // the end. I could also just merge two if-elses that checks if site has been opened before, but it would be harder for me to explain the code
      // and I could also define cookie expire time, but I don't think it's necessary in this situation