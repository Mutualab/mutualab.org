angular.module('booking-form',[
    'mgcrea.ngStrap.tooltip',
    'mgcrea.ngStrap.helpers.dateParser',
    'mgcrea.ngStrap.datepicker',
    'multipleSelect',
    'config',
    'slack-webhook'])

.component('bookingForm', {
  controller:[
          '$location','$http', 'Config','GetFreeDates','SlackWebhook','$filter', 
  function($location,  $http,   Config , GetFreeDates,  SlackWebhook,  $filter){
    var vm = this;

    /**
     * Initial params
     */

    vm.selectedDate = new Date();
    vm.rooms = Config.roomCalendars;
    vm.bookingData = {
      //company:"Test company",
      //organizer:"Test Organisateur",
      //email:"lorem@ipsum.dolor",
      //phone:"0000000000",
      //description:"Pour emphysiquer l'animalculisme, la force de toute la République Démocratique du Congo tarde à établir la renaissance africaine propre(s) aux congolais, Bonne Année. Parallèlement, le colloque éventualiste sous cet angle là oblige à informatiser la bijectivité avéré(e)(s), bonnes fêtes. Quand on parle de relaxation, la contextualisation autour de l'ergonométrie peut incristaliser mes frères propres propre(s) aux congolais, merci."
    };
    vm.bookingData.prestationsList = Config.prestationsList
    /**
     * Get url params
     */

    $location.absUrl();
    var urlParams = $location.search();
    vm.params = urlParams;

    /** 
     * check if room has been defined
    */
    vm.selectedRoom = {}
    if(urlParams.room){
          vm.selectedRoom = (Config.roomCalendars.filter(function(elt){
                 return  elt._id == urlParams.room
          }))[0];
          getDates();
     }


    /**
     * View methods
     */
    vm.getDates= getDates
    vm.payload= {}

    vm.submitForm=function(){
      
      var prestationsList = vm.bookingData.prestationsList
                              .filter(function(elt){ return elt.selected })
                              .map(function(elt){ return elt.label });

      var booked = vm.datesList.map(function(elt){return elt});
      booked =  booked.reduce(function(p,n){
                            return p.concat(n);
                        },[]);
      
      booked = booked
            .filter(function(elt){return elt.selected;})
            .map(function(elt){
              var bookingHour = 
                     ""+ $filter('date')(elt.start.dateTime,"dd/MM/yyyy") +
                     " de "+ $filter('date')(elt.start.dateTime,"HH:mm") +
                     " à "+ $filter('date')(elt.end.dateTime, "HH:mm");

                return "<"+elt.htmlLink+"|"+bookingHour+">";
            })

      vm.payload={
        "text":"*Nouvelle reservation de salle*",
        "attachments": [
            {
              "color":"warning",
              "title": vm.selectedRoom.name,
              "text": "*Organisation : * "+vm.bookingData.company +"\n"+
                      "*Référent : * "+vm.bookingData.organizer+
                                    "(<mailto:"+vm.bookingData.email +"|"+vm.bookingData.email+">"+
                                      (vm.bookingData.phone ? ", "+vm.bookingData.phone+"":'') + ")"+"\n"+
                      (prestationsList.length ? "*Prestation(s) :* "+ prestationsList.join(', ')+"\n":''),
              "mrkdwn_in": ["text"]
            },
            { 
              "color":"good",
              "title": "Reservation(s)",
              "text":  booked.join("\n"),
              "mrkdwn_in": ["text"]
            },
            { 
              "title": "Informations complémentaires",
              "text": vm.bookingData.description
            }
        ],
        "mrkdwn": true
      }
      SlackWebhook.post(vm.payload)
      .then(function(response){
        vm.slackResponse = response;
      })
    };



    /** 
     * Private controller methods
     */

    function getDates(){
        GetFreeDates(vm.selectedDate, vm.selectedRoom.calendarId).then(function(result){
            vm.datesList = result
        })
    }


    return vm;
  }],
  templateUrl:"booking-form.html"
})


.service('GetFreeDates',[
    '$http','Config','$q',
    function($http,Config,$q){
      return function(dateFrom, calendarId){
        return $q(function(resolve){
        var today = new Date();

        if(dateFrom > today){
          dateFrom.setHours(9);
        }

        

        var timemax = (new Date(dateFrom))
        timemax.setDate((new Date(timemax)).getDate() + 14);

        $http.get(
          'https://www.googleapis.com/calendar/v3/calendars/'+calendarId+'/events',
            {
              params:{
                key:'__GOOGLE_API_KEY__',
                orderBy:'startTime',
                singleEvents:true,
                timeMin:dateFrom,
                timeMax:timemax,
                timeZone:'Europe/Paris',
              }
            }
        )
        .then(function(response){
          var filteredDates = response.data.items.filter(function(elt){
            return elt.summary == 'libre';
          });

          var daysList = [];
          var lastDay = null;
          var lastDayGroup = [];
          filteredDates.forEach(function(elt){
            var dayToDate = new Date(elt.start.dateTime)
            var day = dayToDate.getDay()+''+dayToDate.getMonth()+''+dayToDate.getFullYear();
            if(day != lastDay) {
                if(lastDayGroup.length) daysList.push(lastDayGroup);
                lastDay = day
                lastDayGroup = [];
            }
            lastDayGroup.push(elt);
          });

          resolve(daysList)
        })
      });
    }
    
}])
