angular.module('booking-form',[
    'ng-wrappers',
    'mgcrea.ngStrap.tooltip',
    'mgcrea.ngStrap.helpers.dateParser',
    'mgcrea.ngStrap.datepicker',
    'mgcrea.ngStrap.timepicker',
    'multipleSelect',
    'config',
    'slack-webhook'])

.component('bookingForm', {
  controller:[
          '$location','$http', 'Config','GetFreeBusy','SlackWebhook','$filter','Moment','_',
  function($location,  $http,   Config , GetFreeBusy,  SlackWebhook,  $filter, Moment,  _){
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
    vm.minDateDay = new Date();
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
          
     }

    /**
     * View methods
     */
    vm.checkBusy= checkBusy;
    vm.payload= {};

    var gcRanges = null
    vm.setUpMaxEndDate =function(){
      var startRange = new Date(vm.bookingData.timeFrom)
      var endRange   = new Date(vm.bookingData.timeFrom);
      endRange.setHours(19);


      var matchedEnd = false;
      
      if(gcRanges) gcRanges.forEach(function(dateRange){
        var start = new Date(dateRange.start)
        if(startRange < start && !matchedEnd){
            endRange = start;matchedEnd=true;
        }
      });

     startRange = Moment(startRange);
     endRange   = Moment(endRange);

     startRange.add(20,'minutes');
     //endRange.subtract(10,'minutes');

     var range  = Moment.range([startRange,endRange])
     vm.dateEndRanges = range.toArray('minutes').filter(toHalfHour);

    };

    //modal-window
    vm.modalShown = false;
    vm.toggleModal = function() {
      vm.modalShown =  !vm.modalShown;
    };

    vm.submitForm=function(){

      vm.bookingData.dateDay = Moment(vm.bookingData.dateDay).format('DD/MM/YYYY');
      vm.bookingData.timeFrom = Moment(vm.bookingData.timeFrom).format('HH:mm');
      vm.bookingData.timeTo = Moment(vm.bookingData.timeTo).format('HH:mm');
      
      var prestationsList = vm.bookingData.prestationsList
                              .filter(function(elt){ return elt.selected })
                              .map(function(elt){ return elt.label });

      var booked = "le "+ (vm.bookingData.dateDay)+ ' de '+(vm.bookingData.timeFrom)+ ' à '+(vm.bookingData.timeTo);

      console.log(booked);
      var payload={
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
              "text": booked,
              "mrkdwn_in": ["text"]
            },
            { 
              "title": "Informations complémentaires",
              "text": vm.bookingData.description
            }
        ],
        "mrkdwn": true
      }
      
      SlackWebhook.post(payload)
      .then(function(response){
        vm.slackResponse = response;
        vm.bookingData = {}
      })
    };

    /** 
     * Private controller methods
     */
    
    function toHalfHour(eltDate){
        var minutes = Moment(eltDate).format('mm');
        var valid =  minutes == '00' || minutes == '30';
        return valid;
    }
 
    function checkBusy(){
        var dateFrom = new Date(vm.bookingData.dateDay);
        var dateTo = new Date(vm.bookingData.dateDay);

        dateFrom.setHours(9);
        dateTo.setHours(18);



        GetFreeBusy(dateFrom, dateTo , vm.selectedRoom.calendarId)
        .then(function(result){

          vm.bookingData.timeFrom = null
          vm.bookingData.timeTo = null

          if(result.calendars[vm.selectedRoom.calendarId]){
              gcRanges = result.calendars[vm.selectedRoom.calendarId].busy
              vm.busy = gcRanges;
              var hoursRange = Moment.range(dateFrom, dateTo);

              gcRanges.forEach(function(gcFormatedRange){
                var start = Moment(gcFormatedRange.start)
                var end = Moment(gcFormatedRange.end)

                start.subtract(20,'minutes');
                end  .add(0,'minutes');

                var gcRange = Moment.range([start,end]);

                if(typeof hoursRange.subtract == 'function'){
                  hoursRange = hoursRange.subtract(gcRange);
                }else{
                  hoursRange = _.flatten(hoursRange.map(function(currentRange){
                    newRange =  currentRange.subtract(gcRange);
                    return newRange;
                  }))
                }
                
              });

              var viewRange = [];
              if(!hoursRange.start){
                hoursRange.forEach(function(currentRange){
                  halfHours = currentRange.toArray('minutes')
                  viewRange = viewRange.concat(halfHours);
                })
              }else{
                viewRange = hoursRange.toArray('minutes');
              }

              vm.dateStartRanges = viewRange.filter(toHalfHour) 
          }
        })
    }
    return vm;
  }],
  templateUrl:"booking-form.html"
})

.service('GetFreeBusy',[
    '$http','Config','$q',
    function($http,Config,$q){
      return function(dateFrom, dateTo, calendarId){
        return $q(function(resolve){
        
        $http.post(
          'https://www.googleapis.com/calendar/v3/freeBusy',
            {
                timeMin:dateFrom,
                timeMax:dateTo,
                timeZone:'Europe/Paris',
                items:[{id:calendarId}]
              
            },
            {
                params:{key:'__GOOGLE_API_KEY__'}
            }
        )
        .then(function(response){
          resolve(response.data)
        });
      });
    }
    
}])
