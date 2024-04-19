"strict";
/*
  https://github.com/alicelieutier/smoothScroll
*/
window.smoothScroll = (function(){
if(document.querySelectorAll === void 0 || window.pageYOffset === void 0 || history.pushState === void 0) { return; }
var getTop = function(element) {
    if(element.nodeName === 'HTML'){
      return -window.pageYOffset;
    } 
    return element.getBoundingClientRect().top + window.pageYOffset;
};
var easeInOutCubic = function (t) { return t<0.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1; };
var position = function(start, end, elapsed, duration) {
    if (elapsed > duration){
      return end;
    } 
    return start + (end - start) * easeInOutCubic(elapsed / duration);
};
var smoothScroll = function(el, duration, callback){
    duration = duration || 500;
    var start = window.pageYOffset,
        end;
    if (typeof el === 'number') {
      end = parseInt(el);
    } else {
      end = getTop(el);
    }
    var clock = Date.now();
    var requestAnimationFrame = window.requestAnimationFrame ||
        window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame ||
        function(fn){window.setTimeout(fn, 15);};
    var step = function(){
        var elapsed = Date.now() - clock;
        window.scroll(0, position(start, end, elapsed, duration));
        if (elapsed > duration) {
            if (typeof callback === 'function') {
                callback(el);
            }
        } else {
            requestAnimationFrame(step);
        }
    };
    step();
};
var linkHandler = function(ev) {
    ev.preventDefault();
    smoothScroll(document.getElementById(this.hash.substring(1)), 500, function(el) {
    });
};
document.addEventListener("DOMContentLoaded", function () {
    var internal = document.querySelectorAll('a[href^="#"]'), a;
    for(var i=internal.length; a=internal[--i];){
        a.addEventListener("click", linkHandler, false);
    }
});
return smoothScroll;
})();

var xmlToJSON = function(xmlValue) {
  var x2js = new X2JS(),
      jsonValue = x2js.xml_str2json(xmlValue);
  jsonValue = jsonValue.response;
  return jsonValue;
};

window.ready = function(fn) {
  if (document.readyState !== 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

function productionServer(){
  return (window.location.href.indexOf('stefanbohacek.com') > -1);
}

function removeClasses(el){
  el.className = '';
}

//http://stackoverflow.com/questions/5116929/get-clicked-li-from-ul-onclick
function getEventTarget(e) {
  e = e || window.event;
  return e.target || e.srcElement; 
}

//http://stackoverflow.com/questions/1527803/generating-random-numbers-in-javascript-in-a-specific-range
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var userRole, // robot or impostor
    partnerRole = 'unknown',
    gameStarted = false,
    gameFinished = false;


window.onbeforeunload = function(e) {
  if (gameFinished === false){
    return 'Are you sure?';
  }
};


ready(function(){
  var shiftedEls1 = document.getElementsByClassName('shifted-1'),
      shiftedEls = document.getElementsByClassName('shifted'),
      loadingIndicator = document.getElementById('loading'),
      youAre = document.getElementById('you-are'),
      instructionsWrapper = document.getElementById('instructions-wrapper'),
      instructions = document.getElementById('instructions'),
      dismissInstructionsButton = document.getElementById('dismiss-instructions'),
      moreInfo = document.getElementById('more-info'),
      roleReminder = document.getElementById('role-reminder'),
      messageForm = document.getElementById('message-form'),
      sendMessageButton = document.getElementById('send-message'),
      messageTextInput = document.getElementById('message-text'),
      messagesWrapper = document.getElementById('messages-wrapper'),
      messages = document.getElementById('messages'),
      shareChatLogWrapper = document.getElementById('share-chat-log-wrapper'),
      whatIsThisLink = document.getElementById('what-is-this'),
//      requestNotificationPermission = document.getElementById('request-notification-permission'),
      shareChatLogModule = {
        triggerEl: document.getElementById('share-buttons-game'),
        service: null,
        status: document.getElementById('chat-log-url-status'),
        shareUrl: null,
        chatLogId: null
      },
      robotIDs = [
        // '37',
        '909409'
      ],
      names = [
        'your mom',
        'not your business',
        'none of your business',
        'Steve',
        'Bob',
        'Lucy',
        'Rita',
        'Cletus',  
        'Rufus',  
        'Gale',  
        'Sidney',  
        'Emmie',  
        'Ethyl',  
        'Babara',  
        'Jodie',  
        'Karon',  
        'Rashida',  
        'Olen',  
        'Felisa',  
        'Nenita',  
        'Camille',  
        'Shay',  
        'Phoebe',  
        'Angelique',  
        'Monte',  
        'Exie',  
        'Lucrecia',  
        'Melodi',  
        'Marge',  
        'Zoe',  
        'Cassandra',  
        'Rosaura',  
        'Brendon',  
        'Mckinley',  
        'Lucie',  
        'Shandi',  
        'Mao',  
        'Vilma',  
        'Shara',  
        'Giselle',  
        'Royal',  
        'Dia',  
        'Ivy',  
        'Sheridan',  
        'Kandi',  
        'Juliette',  
        'Camilla',  
        'Susanna',  
        'Gary',  
        'Gertha',  
        'Britany',  
        'Marvella',  
        'Sina',  
        'Lakeesha',  
        'Sherill',  
        'Toney',  
        'Sherri',
        'Albertina',  
        'Taren',  
        'Hildred',  
        'Erma',  
        'Lenard',  
        'Tyson',  
        'Markus',  
        'Inez',  
        'Letty',  
        'Deedra',  
        'Tammera',  
        'Stanley',  
        'Lora',  
        'Leon',  
        'Belkis',  
        'Janae',  
        'Lenna',  
        'Bronwyn',  
        'Kimbery',  
        'Debi',  
        'Bernie',  
        'Alleen',  
        'Deloise',  
        'Chiquita',  
        'Shanelle',  
        'Wynona',  
        'Kisha',  
        'Minna',  
        'Laronda',  
        'Chaya',  
        'Anabel',  
        'Leila',  
        'Arletha',  
        'Loyce',  
        'Crysta',  
        'Maegan',  
        'Valery',  
        'Hee',  
        'Ed',  
        'Mitsuko',  
        'Vincenzo',  
        'Mercedez',  
        'Janeen',  
        'Fredrick',  
        'Sharda',  
        'Dylan',  
        'Cassi',  
        'Mae',  
        'Bobbye',  
        'Lanny'   
      ],
      places = [
      'Robot factory',
      'New York',
      'Brooklyn'
      ],
      placesPrivate = [
      'Uh, where are you from?',
      'That\'s prvivate.',
      'Your mom!',
      'I live right next to you!',
      '...',
      'I\'m homeless',
      'I\'m homeless?'
      ],
      badWords = [
/*
      Imported from https://github.com/dariusk/wordfilter.
*/      
        "beeyotch",
        "biatch",
        "bitch",
        "chinaman",
        "chinamen",
        "chink",
        "crip",
        "cunt",
        "dago",
        "daygo",
        "dego",
        "dick",
        "douchebag",
        "dyke",
        "fag",
        "fatass",
        "fatso",
        "gash",
        "gimp",
        "golliwog",
        "gook",
        "gyp",
        "homo",
        "hooker",
        "jap",
        "kike",
        "kraut",
        "lame",
        "lardass",
        "lesbo",
        "negro",
        "nigga",
        "nigger",
        "paki",
        "pickaninny",
        "pussy",
        "raghead",
        "retard",
        "shemale",
        "skank",
        "slut",
        "spade",
        "spic",
        "spook",
        "tard",
        "tits",
        "titt",
        "trannies",
        "tranny",
        "twat",
        "wetback",
        "whore",
        "wop"
      ],
      robot = {
        id: robotIDs[getRandomInt(0, robotIDs.length - 1)],
        name: names[getRandomInt(0, names.length - 1)],
        from: placesPrivate[getRandomInt(0, placesPrivate.length - 1)],
        conversationID: null,
        useLessClever: Math.random() < 0.5 ? true : false,
        responsePending: false,
        pendingResponses: [],
        alreadyAnswered: [],
        alreadyAnsweredResponses: [
          'You already asked that question.',
          'You already asked me that.',
          'I think I already told you.',
          'I already told you.',
          'I already answered that.',
          'Did you read my answer?',
          'You already said that.',
          '...',
          'I told you',
          'I literally just told you.',
          'I just told you.'
        ]
      },
      offensiveWords = [
        'n(i|1)+g{2,}((e|3)+r+|a)+',
        'f+a+g+',
        'f+(a|@)+g{2,}(o|0)+t+'
      ],
      shareTarget,
      globalSocket,
      globalTimer,
      globalTimerWaiting = setTimeout(function(){
        if (gameStarted === false){
          loadingIndicator.innerHTML = 'Still waiting...';
          globalTimerWaiting = setTimeout(function(){
            if (gameStarted === false){
              loadingIndicator.innerHTML = 'Looks like nobody\'s around...';
              setTimeout(function(){
                gameFinished = true;
                location.reload();
              }, getRandomInt(300, 3000));
            }
          }, 40000);
        }
      }, 15000);

//  var Notification = window.Notification || window.mozNotification || window.webkitNotification;

  function clearText(text, removePunctuation){
    text = text.toLowerCase().trim().replace(/ /g,'');
    if (removePunctuation === true){
      text = text.replace(/[.,?!\s,]/g, '');
    }
    return text;
  }


function containsOffensiveLanguage(text){
  for (var i=0, j=offensiveWords.length; i<j; i++){
    if (new RegExp(offensiveWords[i], 'gi').test(text.replace(/\W/g, '')) === true){
      addMessage('system', 'ERROR');      
      addMessage('system', 'Unable to send message');      
      return true;
    }
  }
  return false;
}

  function shareChatLog(){
    shareChatLogModule.service = shareTarget.getAttribute('data-service');

    var shareTitle = 'Play Detective, a game by @stefanbohacek';
    if (shareChatLogModule.service !== null && shareChatLogModule.service === 'reddit'){
      shareTitle = '[log] TITLE';
    }

    shareChatLogModule.shareUrl = shareTarget.getAttribute('data-url')
      .replace(/DESCRIPTION/, 'Detective: A "reverse Turing test" chat game.')
      .replace(/CHATLOGURL/gi, 'http://stefanbohacek.com/detective/log?id=' + shareChatLogModule.chatLogId)
      .replace(/SHORTTITLE/, shareTitle);


    shareChatLogModule.status.innerHTML = '';
    window.open(shareChatLogModule.shareUrl);
  }

  function restartGlobalTimer(){
    clearTimeout(globalTimer);
    globalTimer = setTimeout(function(){
      pokeTheRobot();
    }, getRandomInt(30000, 60000));
  }

  function lessClever(text){
    if (robot.useLessClever === true && text !== '...'){
      text = text.toLowerCase().replace(/^(i )| i /ig," I ").trim();
      var temp = text.replace(/([.?!])\s*(?=[A-Z])/, "$1|").split("|");

      if (temp.length === 1){
        text = text.replace(/\.$/, "");
      }

      if (getRandomInt(1, 10) === 5){
        text = text.replace(/(')/gi, "");
      }
    }

    switch (getRandomInt(1, 10000)){
      case '1':
        text = text.replace('ll', 'l');
      break;
      case '2':
        text = text.replace('ss', 's');
      break;
      case '3':
        text = text.replace('l', 'k');
      break;
      case '4':
        text = text.replace('o', 'p');
      break;
      case '4':
        text = text.replace('w', 's');
      break;
      case '5':
        text = text.replace('s', 'd');
      break;
    }

    return text;
  }

  function checkRole(message){

  }


  function showSharingButtons(){
    shareChatLogWrapper.style.display = 'block';
    //TODO: This should be a function, eg removeClassStaggered(class)
    Array.prototype.forEach.call(document.getElementsByClassName('share-link-shifted'), function(el, index) {
      setTimeout(
        function(){
          el.classList.remove('share-link-shifted');
          el.classList.add('share-link-unshifted');
        },
        ((10*index))*index);
    });    
  }

  function contactTheRobot(message){
    if (robot.alreadyAnswered.indexOf(clearText(message, true)) === -1){
      if (message !== '...'){
        robot.alreadyAnswered.push(clearText(message, true));
      }
      var request = new XMLHttpRequest();
  // Backend doesn't support data in JSON format, keeping this here for future.
  //    request.open('GET', '//www.botlibre.com/rest/botlibre/form-chat' , true);
      request.open('GET', '//www.botlibre.com/rest/botlibre/form-chat?instance=' + robot.id + '&application=155525030417300595&message=' + message + (robot.conversationID !== null ? '&conversation=' + robot.conversationID : ''), true);
      request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
    //    JSON is not yet supported, only XML.
    //    var data = JSON.parse(request.responseText);
          var resp = xmlToJSON(request.responseText);
          if (robot.conversationID === null){
            robot.conversationID = resp._conversation;
          }

          if (resp.message === undefined){
            pokeTheRobot();
          }
          else if (new RegExp(badWords.join("|")).test(resp.message) === true) {
            // The robot is saying something offensive, let's ask him again!
            contactTheRobot(message);
          }
          else{
            robotRespond(lessClever(resp.message));            
          }
        } else {
          // console.log('ERROR');
          // console.log(request.responseText);
          // alert('ERROR: ' + request.responseText + '\n\nPlease contact stefan@stefanbohacek.com.\n\nThanks!');
        }
      };

      request.onerror = function() {
        //TODO: There was a connection error of some sort
      };
  // Backend doesn't support data in JSON format, keeping this here for future.
  /*
      var parameters = {
        instance: robot.id,
        application: '155525030417300595',
        message: 'hello'      
      };

      if (robot.conversationID !== null){
        parameters['conversation'] = robot.conversationID;
      }

      request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      request.send(JSON.stringify(parameters));
  */    
      request.send();

    }
    else{
      if (message.indexOf('?') > -1){
        if (robot.alreadyAnsweredResponses.length > 0){
          var annoyedMessage = robot.alreadyAnsweredResponses.splice(getRandomInt(0, robot.alreadyAnsweredResponses.length - 1), 1);
          annoyedMessage = annoyedMessage[0];
          robotRespond(lessClever(annoyedMessage));
        }
        else{
          robotRespond('...'); 
        }
      }
    }
  }

  function pokeTheRobot(){
    var sendText = [
          "..."
        ];
    contactTheRobot(sendText[getRandomInt(0, sendText.length - 1)]);
  }

  function robotRespond(message){
    message = message.replace(/(RobotNotImpostor(\d)*|Jenny|linh truong|Alice)/gi, robot.name);
    message = message.replace(/ROBOTFROM/gi, robot.from);
    robot.pendingResponses.push(message);

    console.log( robot.pendingResponses.length );
    
    if (robot.pendingResponses.length > 0){
      var nextMessage = robot.pendingResponses.shift(),
          nextMessageLength = nextMessage.length,
          nextMessageDelay = (nextMessageLength * getRandomInt(50, 100)) + getRandomInt(2000, 8000);
      if (robot.responsePending === false){
        robot.responsePending = true;
        setTimeout(function(){
          addMessage('robot', message);
          robot.responsePending = false;
        }, nextMessageDelay);
      }
      else{
        setTimeout(function(){
          return (function(message){
            robotRespond(message);            
          })(message);
        }, 1000);
      }
    }
  }

  function revealImpostor(detectiveGuess){
    if (partnerRole !== 'unknown'){
      gameFinished = true;
      if (detectiveGuess === partnerRole){
        addMessage('system', 'CORRECT');
        globalSocket.emit('game over', 'detective won');
        globalSocket.emit('I won', 'detective');        
      }
      else{
        addMessage('system', 'INCORRECT');
        globalSocket.emit('game over', 'detective lost');
        globalSocket.emit('I lost', 'detective');        
      }
      addMessage('system', 'Game is over');
      showSharingButtons();
    }
    else{
      addMessage('system', 'ERROR');
      addMessage('system', 'Too early to tell');
    }
    //TODO: Implement scoring system.
  }

  function addMessage(messageFrom, messageText){
    if (messageText.trim().length === 0){
      return false;
    }
    var newMessage = document.createElement("LI");
    switch (messageFrom){
      case 'user':
        newMessage.classList.add('user-message');
        newMessage.classList.add('new-message');
      break;
      case 'system':
        newMessage.classList.add('system-message');
        switch (messageText){
          case 'ERROR':
          case 'INCORRECT':
            newMessage.classList.add('error-message');
          break;
          case 'CORRECT':
            newMessage.classList.add('user-correct');
          break;
          default:
            newMessage.classList.add('new-message');
          break;
        }
      break;
      case 'robot':
      case 'impostor':
        newMessage.classList.add('rori-message');
        newMessage.classList.add('new-message');
      break;
    }

    /*
      Fun stuff -- part one! #eastereggs
    */

    var funStuff = clearText(messageText, true);

    if (funStuff.indexOf('wiggle') > -1){
      newMessage.classList.add('wiggle-message');        
    }

    if (funStuff.indexOf('jump') > -1){
      newMessage.classList.add('jump-message');        
    }

    newMessage.innerHTML = messageText.replace(/(<([^>]+)>)/ig,"");
    //TODO: Rewrite this!

    if (messageFrom !== 'user' && messageFrom !== 'system'){
      newMessage.innerHTML = '<span class="message-prepend">></span> ' + newMessage.innerHTML;
    }

    if (messageText === 'Game is over' && messageFrom === 'system'){
      newMessage.innerHTML += '. Follow <a href="https://twitter.com/detectivelogs">@detectivelogs</a> for updates!</p>';
    }


    if (messageFrom === 'robot' && gameFinished === true){
      // null
    }
    else{
      messages.appendChild(newMessage);

      /*
        Fun stuff -- part two! #eastereggs
      */
      switch(clearText(messageText, true)){
        case 'ilikethisgame':
          addMessage('system', 'Oh hey, thanks!');
        break;
        case 'godmode':
          addMessage('system', 'Not in this game.');
        break;
      }

    }
    if (messageFrom === 'user'){
      messageTextInput.value = '';
    }
    else{
      if (!document.hasFocus()){
        document.title = 'New message | Detective by @stefanbohacek';
      }
    }

    document.body.scrollTop = document.body.scrollHeight;

    window.scrollTo(0,document.body.scrollHeight);


    messageText = clearText(messageText, false);


    if (messageFrom === 'user' && /you.*re?.*(impostor|imposter|robot|bot)/gi.test(messageText) && userRole === 'detective' && gameFinished === false && messageText.indexOf('not') === -1){

      if (new RegExp(['youarearobot',
                      'you\'rearobot',
                      'youarerobot',
                      'yourerobot',
                      'yourearobot',
                      'you\'rerobot',
                      'youaretherobot',
                      'you\'retherobot'
                    ].join("|")).test(messageText) === true) {
        revealImpostor('robot');
      }
      else if (new RegExp(['youareanimposter',
                      'youareanimpostor',
                      'you\'reanimposter',
                      'you\'reanimpostor',
                      'youareimposter',
                      'youareimpostor',
                      'you\'reimposter',
                      'you\'reimpostor',
                      'youretheimposter',
                      'youretheimpostor',
                      'youreimposter',
                      'youreimpostor',
                      'youreanimposter',
                      'youreanimpostor',
                      'youaretheimposter',
                      'youaretheimpostor',
                      'you\'retheimposter',
                      'you\'retheimpostor'
                    ].join("|")).test(messageText) === true) {
       revealImpostor('impostor');
      } 
      else{
        addMessage('system', 'Please say "You are a robot" or "You are an impostor".');
      }
    }
  }

  window.addEventListener("focus", function(event) {
    if (userRole !== undefined){
      document.title = 'You are the ' + userRole + ' | Detective by @stefanbohacek';
    }
  }, false);

  var socket;

  if (productionServer()){
    // socket = io(document.location.protocol + '//stefanbohacek.com:3003');
    // socket = io(document.location.protocol + '//stefanbohacek.com/detective');

    socket = io('//stefanbohacek.com/', {     // note changed URL here
      path: '/detective/socket.io',
      autoConnect: true,
      // transports: ['websocket'],
    });
    console.log( socket );
  }
  else{
    socket = io(document.location.protocol + '//' + document.location.host);
  }

  if (dismissInstructionsButton){
    dismissInstructionsButton.addEventListener('click', function(){
      if (partnerRole === 'robot'){
        restartGlobalTimer();
      }
      instructionsWrapper.classList.add('shiftedUp');
      messageForm.classList.remove('hidden');
      moreInfo.classList.remove('hidden');
      moreInfo.classList.remove('shifted');
      messageTextInput.focus();
    });
  }

  // if (requestNotificationPermission){
  //   requestNotificationPermission.addEventListener('click', function(){
  //     Notification.requestPermission(function (permission) {
  //     console.log(permission);
  //     });
  //   });
  // }

  if (shareChatLogModule.triggerEl){
    shareChatLogModule.triggerEl.addEventListener('click', function(ev){
      ev.preventDefault();
      shareTarget = getEventTarget(ev);

      switch (shareTarget.getAttribute('data-url')){
        case 'RELOAD':
          location.reload();
        break;
        default:
          if (shareChatLogModule.shareUrl === null){
            shareChatLogModule.status.innerHTML = 'Loading...';
            globalSocket.emit('save_chat_log', messagesWrapper.innerHTML, userRole);     
          }
          else{
            shareChatLog();
          }
        break;
      }
    });
  }

  if (shiftedEls1.length > 0){
    Array.prototype.forEach.call(shiftedEls1, function(el, index) {
      setTimeout(
        function(){
          el.classList.remove('shifted-1');
          el.classList.add('unshifted-1');
        },
        (200-(10*index))*index);
    });
  }  

  socket.on('connected', function(data) {
    globalSocket = socket;
  });

  socket.on('chat_log_saved', function(data) {
    shareChatLogModule.chatLogId = data;
    shareChatLog();
  });

  socket.on('error', function(data) {
    console.log('ERROR');
    console.log(data);
  });

  socket.on('game over', function(status) {
    if (status === 'detective won'){
      addMessage('system', 'YOU HAVE BEEN REVEALED');
      globalSocket.emit('I lost', 'impostor');
    }
    else{
      addMessage('system', 'YOU FOOLED THE DETECTIVE');      
      globalSocket.emit('I won', 'impostor');
    }
    addMessage('system', 'Game is over');
    showSharingButtons();
  });

  socket.on('partner disconnected', function(data) {
    addMessage('system', 'Partner disconnected.');
    showSharingButtons();

    if (data === 'ping timeout'){
      //TODO: Was this a bot?
    }
    if (partnerRole !== 'unknown' && userRole === 'detective' && gameFinished === false){
      addMessage('system', 'You were speaking with the ' + partnerRole.toUpperCase() + '.');
    }
  });

  socket.on('you are', function(data) {
    gameStarted = true;
    clearTimeout(globalTimerWaiting);
    userRole = data;
    loadingIndicator.classList.add('shiftedUp');
    var unshiftedEls1 = document.getElementsByClassName('unshifted-1')

    if (unshiftedEls1.length > 0){
      Array.prototype.forEach.call(unshiftedEls1, function(el, index) {
        setTimeout(
          function(){
            el.classList.remove('unshifted-1');
            el.classList.add('shiftedUp1');
          },
          (200-(10*index))*index);
      });
    }



    if (shiftedEls.length > 0){
      Array.prototype.forEach.call(shiftedEls, function(el, index) {
        setTimeout(
          function(){
            el.classList.remove('shifted');
            el.classList.add('unshifted');
          },
          (200-(10*index))*index);
      });
    }
//    whatIsThisLink.classList.add('shiftedUp');
    dismissInstructionsButton.focus();
    document.title = 'You are the ' + userRole + ' | Detective by @stefanbohacek';
    roleReminder.innerHTML = 'the <span class="highlight">' + userRole + '</span>';
    youAre.innerHTML = 'You are the <span class="highlight">' + userRole + '</span>';
    if (userRole === 'detective'){
      instructions.innerHTML = '<p>You must figure out whether you are speaking to a <span class="highlight">ROBOT</span>* or an <span class="highlight">IMPOSTOR</span>, another player pretending to be a <span class="highlight">ROBOT</span>*.</p>' +
        '<p>Say <em>"You are an impostor"</em> or <em>"You are a robot"</em> once you are confident with your choice.</p>' +
        '<p class="definition">*A <a href="http://en.wikipedia.org/wiki/Chatbot" target="_blank">chatter robot</a> is a type of conversational agent, a computer program designed to simulate an intelligent conversation with one or more human users via auditory or textual methods.</p>';
    }
    else{
      instructions.innerHTML = '<p>You must convince the <span class="highlight">DETECTIVE</span> that he or she is speaking to a <span class="highlight">ROBOT</span>*.</p>' + 
      '<p class="definition">*A <a href="http://en.wikipedia.org/wiki/Chatbot" target="_blank">chatter robot</a> is a type of conversational agent, a computer program designed to simulate an intelligent conversation with one or more human users via auditory or textual methods.</p>';      
    }
  });

  socket.on('paired', function(data) {
    if (data.users[0] === 'robot' || data.users[1] === 'robot'){
      partnerRole = 'robot';
      sendMessageButton.addEventListener('click', function(event){
        event.preventDefault();
        if (containsOffensiveLanguage(clearText(messageTextInput.value, true)) === false){
          restartGlobalTimer();
          if (gameFinished === false){
            contactTheRobot(messageTextInput.value);
            addMessage('user', messageTextInput.value);          
          }
          else{
            alert('Let\'s give the robot some rest.');
          }          
        }
      });
    }
    else{
      partnerRole = (userRole === 'detective' ? 'impostor' : 'detective');

      sendMessageButton.addEventListener('click', function(event){
        event.preventDefault();
        if (containsOffensiveLanguage(clearText(messageTextInput.value, true)) === false){
          socket.emit('send message', {
              from: userRole,
              message: messageTextInput.value
            }
          );
          addMessage('user', messageTextInput.value);
        }
      });
    }

  });

  socket.on('message received', function(data) {
    if (partnerRole === 'unknown'){
      partnerRole = data.from;
    }
    if (data.from !== userRole){
      addMessage(partnerRole, data.message);
    }
  });
});
