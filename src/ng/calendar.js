/**
* mutualab.org Module
*
* Description
*/

angular.module('mutualab.org')


.component('mtCalendar',{
  templateUrl:"calendar.html",
  controller:[
      '$http','Config',
      function($http,Config){
        var vm = this;
        var timemax = (new Date())
        timemax.setDate((new Date()).getDate() + 205);
        $http.get(
          'https://www.googleapis.com/calendar/v3/calendars/'+Config.googleEventsCalendarId+'/events',
          {
              params:{
                key:'__GOOGLE_API_KEY__',
                orderBy:'startTime',
                singleEvents:true,
                timeMin:new Date(),
                timeMax:timemax,
                timeZone:'Europe/Paris',


              }
          }
          )
        .then(function(response){
          var items =  response.data.items.map(function(elt){
            if(elt.start.date)
              elt.start.dateTime = Date.parse(elt.start.date)
            
            if(elt.end.date)
              elt.end.dateTime = Date.parse(elt.end.date)

            return elt
          })
          vm.events = items;
          console.log(response.data)
        })

        vm.randomColor= function(){ return Math.round(Math.random() * (4 - 0) + 0); }

        return vm;
      }
  ]
})

