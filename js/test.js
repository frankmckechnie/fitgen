
  var PATH_TO_DISPFORM = "http://intranet/sites/forms/Lists/Interaction%20Event%20Request/DispForm.aspx";
  var TASK_LIST = "Interaction Event Request";

   DisplayTasks();
   
   function DisplayTasks()
   {
    $('#calendar').fullCalendar( 'destroy' );
    $('#calendar').fullCalendar({
        height: 650,
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,basicWeek,basicDay,listMonth'
        },
        //open up the display form when a user clicks on an event
        eventClick: function (calEvent, jsEvent, view) {
                window.location = PATH_TO_DISPFORM + "?ID=" + calEvent.id;
        },
        editable: false,
        timezone: "UTC",
        droppable: false, // this allows things to be dropped onto the calendar
        //update the end date when a user drags and drops an event 
        eventDrop: function(event, delta, revertFunc) {
            UpdateTask(event.id,event.end);
          }, 
        //put the events on the calendar 
        events: function (start, end, timezone, callback) {
            startDate = start.format('YYYY-MM-DD');
            endDate = end.format('YYYY-MM-DD');
            
            var RESTQuery = "/_api/Web/Lists/GetByTitle('"+TASK_LIST+"')/items?$select=ID,Title,Start_x0020_Date_x0020_and_x0020,Finish_x0020_Time_x0020_and_x002,OrganiserEmail&\
                $filter=((Start Date and Time ge '"+startDate+"' and Finish Time and Date le '"+endDate+"'))";
            
            var opencall = $.ajax({
                    url: "http://intranet/sites/forms" + RESTQuery,
                    type: "GET",
                    dataType: "json",
                    headers: {
                        Accept: "application/json;odata=verbose"
                    }
            });

            opencall.done(function (data, textStatus, jqXHR) {
                    var events = [];
                    for (index in data.d.results)
                    {
                        // var assignedTo = "";
                        // for(person in data.d.results[index].AssignedTo.results)
                        // {
                        //     assignedTo += data.d.results[index].AssignedTo.results[person].Title + " ";
                        // }
                        events.push({
                                    title: data.d.results[index].Title,
                                    id: data.d.results[index].ID,
                  color: "#c00000", //specify the background color and border color can also create a class and use className paramter. 
                                    start: moment.utc(data.d.results[index].Start_x0020_Date_x0020_and_x0020),
                                    end: moment.utc(data.d.results[index].Finish_x0020_Time_x0020_and_x002).add("1","days") //add one day to end date so that calendar properly shows event ending on that day
                                });
                    }
                    
                    callback(events);
            
            });
        }
    });
}


function UpdateTask(id,dueDate)
{
      //substract the previoulsy added day to the date to store correct date
            sDate =  moment.utc(dueDate).add("-1","days").format('YYYY-MM-DD') + "T" + 
                    dueDate.format("hh:mm")+ ":00Z";
                    
        var call = jQuery.ajax({
            url: _spPageContextInfo.webAbsoluteUrl +
                "/_api/Web/Lists/getByTitle('"+TASK_LIST+"')/Items(" + id + ")",
            type: "POST",
            data: JSON.stringify({
                DueDate: sDate,
            }),
            headers: {
                Accept: "application/json;odata=nometadata",
                "Content-Type": "application/json;odata=nometadata",
                "X-RequestDigest": jQuery("#__REQUESTDIGEST").val(),
                "IF-MATCH": "*",
                "X-Http-Method": "PATCH"
            }
        });
        call.done(function (data, textStatus, jqXHR) {
            alert("Update Successful");
          DisplayTasks();
        });
        call.fail(function (jqXHR, textStatus, errorThrown) {
           alert("Update Failed");
           DisplayTasks();
        });

}


// // Format UTC dates as local date/time strings.
// function formatDateToLocal( date ) {

//     var dateUTC;

//     if ( typeof date === "string" ) {

//         // Convert UTC string to date object
//         var d = new Date();
//         var year = date.split('-')[0];
//         var month = date.split('-')[1] - 1;
//         var day;
//         var hour;
//         var minute;
//         var second;
//         day = date.split('-')[2].split('T')[0];
//         hour = date.split('T')[1].split(':')[0];
//         minute = date.split('T')[1].split(':')[1].split(':')[0];
//         second = date.split('T')[1].split(':')[2].split('Z')[0];
//         dateUTC = new Date( Date.UTC( year, month, day, hour, minute, second ) );
//     }
//     else if ( typeof date === "object" ) {
//         dateUTC = date;
//     }
//     else {
//         alert( "Date is not a valid string or date object." );
//     }

//     // Create local date strings from UTC date object
//     var year = "" + dateUTC.getFullYear();
//     var month = "" + ( dateUTC.getMonth() + 1 ); // Add 1 to month because months are zero-indexed.
//     var day = "" + dateUTC.getDate();
//     var hour = "" + dateUTC.getHours();
//     var minute = "" + dateUTC.getMinutes();
//     var second = "" + dateUTC.getSeconds();

//     // Add leading zeros to single-digit months, days, hours, minutes, and seconds
//     if ( month.length < 2 ) {
//         month = "0" + month;
//     }
//     if ( day.length < 2 ) {
//         day = "0" + day;
//     }
//     if ( hour.length < 2 ) {
//         hour = "0" + hour;
//     }
//     if ( minute.length < 2 ) {
//         minute = "0" + minute;
//     }
//     if ( second.length < 2 ) {
//         second = "0" + second;
//     }

//     var localDateString = year + "-" + month + "-" + day + "T" + hour + ":" + minute + ":" + second;

//     return localDateString;
// }

// $(document).ready( function() {

//     $( '#calendar' ).fullCalendar({

//         // Assign buttons to the header of the calendar. See FullCalendar documentation for details.
//         header: {
//             left:'prev,next today',
//             center: 'title',
//             right: 'month, agendaWeek, agendaDay'
//         },
//         defaultView: "month", // Set the default view to month
//         firstHour: "5", // Set the first visible hour in agenda views to 5 a.m.
//         height: 720, // Set the height of the calendar in pixels
//         weekMode: "liquid", // Only display the weeks that are needed
//         theme: false, // Use a jQuery UI theme instead of the default fullcalendar theme
//         editable: false, // Set the calendar to read-only; events can't be dragged or resized

//         // Add events to the calendar. This is where the "magic" happens!
//         events: function( start, end, callback ) {

//             // Create an array to hold the events.
//             var events = [];

//             // Set the date from which to pull events based on the first visible day in the current calendar view. For a month view, this will usually be several days into the previous month. We can use FullCalendar's built-in getView method along with the formatDate utility function to create a date string in the format that SharePoint requires. It must be in the format YYYY-MM-DDTHH:MM:SSZ. Due to time zone differences, we will omit everything after the day.
//             var startDate = $.fullCalendar.formatDate( $( '#calendar' ).fullCalendar( 'getView' ).start, "u" ).split( "T" )[0];

//             // Get the current view of the calendar (agendaWeek, agendaDay, month, etc.). Then set the camlView to the appropriate value to pass to the web service. This way we will only retrieve events needed by the current view (e.g. the agendaWeek view will only retrieve events during the current week rather than getting all events for the current month).
//             var calView = $( '#calendar' ).fullCalendar( 'getView' ).title;
//             var camlView = "";

//             switch( calView ) {
//                 case "agendaWeek":
//                     camlView = "<Week />";
//                     break;
//                 case "agendaDay":
//                     camlView = "<Week />";
//                     break;
//                 default: // Default to month view
//                     camlView = "<Month />";
//             }

//             // Set the camlFields, camlQuery, and camlOptions to the appropriate values to pass to the web service. You can add additional <ViewFields /> or adjust the CAML query if you have some custom columns that you want to filter by or display data from. The values below are the pretty much the minimum you'll want to start from to get it working.
//             var camlFields = "<ViewFields><FieldRef Name='Title' /><FieldRef Name='EventDate' /><FieldRef Name='EndDate' /><FieldRef Name='Location' /><FieldRef Name='Description' /><FieldRef Name='fRecurrence' /><FieldRef Name='RecurrenceData' /><FieldRef Name='RecurrenceID' /><FieldRef Name='fAllDayEvent' /></ViewFields>";
//             var camlQuery = "<Query><CalendarDate>" + startDate + "</CalendarDate><Where><DateRangesOverlap><FieldRef Name='EventDate' /><FieldRef Name='EndDate' /><FieldRef Name='RecurrenceID' /><Value Type='DateTime'>" + camlView + "</Value></DateRangesOverlap></Where><OrderBy><FieldRef Name='EventDate' /></OrderBy></Query>";
//             var camlOptions = "<QueryOptions><CalendarDate>" + startDate + "</CalendarDate><RecurrencePatternXMLVersion>v3</RecurrencePatternXMLVersion><ExpandRecurrence>TRUE</ExpandRecurrence><DateInUtc>TRUE</DateInUtc></QueryOptions>";

//             // Make the web service call to retrieve events.
//             $().SPServices({
//                 operation: "GetListItems",
//                 async: false,
//                 listName: "Interaction Event Request", // Change this to the GUID or display name of your calendar. If the calendar is on a different site, you can use the display name with the webURL option (see SPServices.CodePlex.com for more information).
//                 CAMLViewFields: camlFields,
//                 CAMLQuery: camlQuery,
//                 CAMLQueryOptions: camlOptions,
//                 completefunc: function( xData, Status ) {
//                     $( xData.responseXML ).find( '[nodeName="z:row"]' ).each( function() {

//                         // Check for all day events
//                         var fADE = $( this ).attr( 'ows_fAllDayEvent' );
//                         var thisADE = false;
//                         var thisStart;
//                         var thisEnd;

//                         if ( typeof fADE !== "undefined" && fADE !== "0" ) {
//                             thisADE = true;
//                             // Get the start and end date/time of the event. FullCalendar will parse date strings in local time automagically, and we don't need to do any local time conversions for all day events, so we can use the UTC date strings from SharePoint without converting them to local time.
//                             var thisStart = $( this ).attr( 'ows_EventDate' );
//                             var thisEnd = $( this ).attr( 'ows_EndDate' );
//                         }
//                         else {
//                             // Get the start and end date/time of the event. FullCalendar will parse date strings in local time automagically, so we need to convert the UTC date strings from SharePoint into local time. The formatDateToLocal() function above will take care of this. See comments in that function for more information.
//                             var thisStart = formatDateToLocal( $( this ).attr( 'ows_EventDate' ) );
//                             var thisEnd = formatDateToLocal( $( this ).attr( 'ows_EndDate' ) );
//                         }

//                         // Get the list item ID and recurrence date if present. This will be used to generate the ID query string parameter to link to the event (or the specific instance of a recurring event). The ID query string parameter must be in the format "ID.0.yyyy-MM-ddTHH:mm:ssZ" for recurring events (where "ID" is the list item ID for the event). Event ID's are returned as just a number (for non-recurring events) or several numbers separated by ";#" in 2007 or "." in 2010 to indicate individual instances of recurring events. By splitting and joining the ID this way, thisID will be set to a valid query string parameter whether an event is recurring or not for both versions of SharePoint.
//                         var thisID = $( this ).attr( 'ows_ID' ).split( ';#' ).join( '.' );

//                         // FullCalendar documentation specifies that recurring events should all have the same id value when building the events array (the id is optional, but I'm including it for completeness). We can get the list item ID (which is the same for all instances of recurring events) without the recurrence information by simply splitting thisID.
//                         var eventID = thisID.split( '.' )[0];

//                         // Get the event title. This is displayed on the calendar along with the start time of the event.
//                         var thisTitle = $( this ).attr( 'ows_Title' );

//                         // Get the event description. I don't use it in this example, but you could use it for something, perhaps as a tooltip when hovering over the event.
//                         var thisDesc = $( this ).attr( 'ows_Description' );

//                         // Add the event information to the events array so FullCalendar can display it.
//                         events.push({
//                             title: thisTitle,
//                             id: eventID,
//                             start: thisStart,
//                             end: thisEnd,
//                             allDay: thisADE,

//                             // Adjust this URL to link to the display form for your calendar events. You can include a Source parameter to allow users to easily return to the FullCalendar page.
//                             url: '/sites/forms/lists/Interaction%20Event%20Request/DispForm.aspx?ID=' + thisID + '&Source=' + window.location,
//                             description: thisDesc
//                         });

//                     });

//                     callback( events );

//                 }
//             });

//         }
//     });

// });


// $(document).ready(function() {

//     // page is now ready, initialize the calendar...

//     $('#calendar').fullCalendar({
//         header: {
//         left: 'prev,next today',
//         center: 'title',
//         right: 'month, agendaWeek, agendaDay'
//     },                                
//     displayEventEnd :true,  // shows end date
//     nextDayThreshold: "00:00:00", // When an event's end time spans into another day, the minimum time it must be in order for it to render as if it were on that day
//     timeFormat: 'h:mma ',
//     theme: false, // Use JQuery UI theme
//     fixedWeekCount: false,  // If true, the calendar will always be 6 weeks tall. If false, the calendar will have either 4, 5, or 6 weeks, depending on the month.
//     eventLimit: true, // allow "more" link when too many events
//     eventSources: eventSourceArray
//     })


// });

// var siteUrl = '/sites/forms/Interaction Event Request'; 


// function retrieveListItems() {

//     var clientContext = new SP.ClientContext(siteUrl);
//     var oList = clientContext.get_web().get_lists().getByTitle('Interaction Event Request');
        
//     var camlQuery = new SP.CamlQuery();
//     camlQuery.set_viewXml('<View><Query><Where><Geq><FieldRef Name=\'ID\'/>' + 
//         '<Value Type=\'Number\'>1</Value></Geq><Leq><FieldRef Name="Date" /><Value Type="DateTime"><Today/></Value></Leq></Where></Query><RowLimit>100</RowLimit></View>');
//     this.collListItem = oList.getItems(camlQuery);
        
//     clientContext.load(collListItem);
        
//     clientContext.executeQueryAsync(Function.createDelegate(this, this.onQuerySucceeded), Function.createDelegate(this, this.onQueryFailed));        
        
// }

// function onQuerySucceeded(sender, args) {

//     var listItemInfo = '';

//     var listItemEnumerator = collListItem.getEnumerator();
        
//     while (listItemEnumerator.moveNext()) {
//         var oListItem = listItemEnumerator.get_current();
//         listItemInfo += '\nID: ' + oListItem.get_id() + 
//             '\nTitle: ' + oListItem.get_item('Title') + 
//             '\nBody: ' + oListItem.get_item('Date');
//     }

//     console.log(listItemInfo.toString());
// }

// function onQueryFailed(sender, args) {

//     alert('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
// }

// ExecuteOrDelayUntilScriptLoaded(retrieveListItems, "sp.js")

// // var siteUrl = '/sites/forms';
// // var list = 'Acquisition Finance, Adjudication,Advertising and marketing, Aerospace & Defence, Ahead of the curve: oilfield services,AIM,Airports,Arbitration , Arbitration (International),Asset tracing and recovery,Automotive,Autonomous vehicles, Banking,Banking disputes,Banking on Cloud,Banking reform BIM,Brexit,Bribery and corruption,Business sales and outsourcing, Charities & not for profit,Charity law,Chemical,CIL, Civil Fraud ,Cloud computing,Co-insurance,Commercial,"Commercial agents distribution and franchising",Commercial litigation,Commercial trusts,Community infrastructure, Company Secretarial,Competition law ,Computer law ,Confidentiality, Construction contracts,Construction disputes,Construction procurement,Consumer protection, Contentious IP,Copyright,Corporate,Corporate Crime, Corporate Finance,Corporate Governance,Corporate Immigration ,Corporate Lending, Corporate manslaughter,Corporate Occupier,Corporate real estate,Corporate tax, Court procedure,Cybersecurity,Data Protection & Privacy,Database rights, Dawn Raids ,Debt Capital Markets,Debt Recovery,Defamation, Designs,Development Consent Orders,Directors\' duties,Directors\' service contracts, Discipline and grievances,"Disclosure, electronic disclosure and document review",Discrimination,Disputes and ADR, E-commerce,Economic infrastructure,Economic torts,Education, Email,Employment and reward,Employment status,Employment tax, Employment tribunals and courts,Energy & Infrastructure finance,Energy from Waste,Energy M&A,Energy market regulation,Enforcement,Engineering Procurement ,Environment ,Environment and climate change,Environmental protection,Equity capital markets,EU & Competition, EU & Competition disputes,EU data protection regulation,Export Controls & Sanctions,Family friendly working, Finance tax,Financial difficulty and insolvency,Financial institution advice,Financial Products and Payments, Financial services regulation,Fintech,Food safety,Forensic & Accounting Services, Freedom of information,Gambling,Gender Pay Gap,Health & safety, Healthcare,Hosting and maintenance,Hotels,Housing, Immigration,Indirect tax,Industrial Relations,Injunctions, Innovation,Inquiries,Insurance,Insurance brokers and intermediaries, Insurance claims and disputes,Insurance Distribution ,Insurance law and liability,Insurance regulation, Intellectual Property,Internal investigations,International Trade & Commodities,Internet of things, Investigations,Investment,Investment funds,Investment funds tax, Islamic finance,IT disputes,Joint Ventures,Judicial review, Licensing,Life insurance,Limitation,Litigation , Litigation and arbitration for US based corporates,Litigation funding,Local planning policy,M&A, Maritime & shipping,Media and creative industries,Merger Control ,Negligence, Non-disclosure and misrepresentation,Northern Ireland property,Notifying claims & circumstances,Oilfield services, One belt one road,Outsourcing ,Partnerships,Patent Litigation, Patents,Pay and benefits,Pension Disputes,Pension trustees, Pensions and Long Term Savings,Pensions Funds,Pensions investments,Pharmaceutical, Planning,Planning appeals,Planning applications decisions,"Planning, Zoning and Consents", Policy terms and coverage,Ports,Pre-action considerations,Private equity, Private Rentals,Private Wealth,Privilege,Product liability, Product Providers,Project finance,Projects,Projects and procurement, Property,Property Development,Property Disputes,Property Investment, Property litigation,Property tax,Public inquiries,Public procurement Public Procurement Challenges,Public Sector ,Public sector unfunded pension schemes,R&D, Rail,Real estate finance,Real Estate Structures,Real Estate Tax, Receivables & Trade Finance,Recruitment,Re-finance,Regulation, Reinsurance,Remuneration of directors,Reorganisations,Residential property, Restraint of trade and contracts,Restructuring,Schemes of arrangement,Scotland property, Securities litigation,Senior Exits,Setting up a business,Settlement, Share Plans & Incentives,Sickness,Software,Sourcing, Sport,State aid,Strategic alliances and collaborations,Structured real estate, Structured Solutions,Supply chain management,Supply of goods and services,Syndicated finance, Takeovers,Tax advisory,Tax Disputes and Investigations,Team Moves , Teleco,Termination,The Alternative Investment Fund Managers Directive,The Retail Distribution Review, TMT disputes,TMT renegotiation,Town and city centre redevelopment,Trade Marks & Passing Off, Trade unions and employee consultation,Transport,Treasury Services,Trustees, UK property,Universities,VAT,Venture capital, Waiver,Waste management,Water & wastewater,Workplace Defined Contribution Schemes';

// // function createListItem(value) {

// //     var clientContext = new SP.ClientContext(siteUrl);
// //     var oList = clientContext.get_web().get_lists().getByTitle('specialisms');
        
// //     var itemCreateInfo = new SP.ListItemCreationInformation();
// //     this.oListItem = oList.addItem(itemCreateInfo);
        
// //     oListItem.set_item('Title', value);
        
// //     oListItem.update();

// //     clientContext.load(oListItem);
        
// //     clientContext.executeQueryAsync(Function.createDelegate(this, this.onQuerySucceeded), Function.createDelegate(this, this.onQueryFailed));
// // }

// // function onQuerySucceeded() {

// //     console.log('Item created: ' + oListItem.get_id());
// // }

// // function onQueryFailed(sender, args) {

// //     console.log('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
// // }


