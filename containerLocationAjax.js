$(document).ready(function() {
	
	var storageLoc = [];
	var buildingArray = [];
	var quarantineArray = [];
	var mlcArray =[];
	var count = 0;
	
	
	$( "li" ).map( function(index, element) {
		if(this.id.match("changeLoc_"))
			storageLoc.push(this.id);
	}).get();

   //When auto position rule is set
	/*function autoFillContainerLocation(tissueType, tissueSamples)
	{
		alert("Call fun "+tissueType);
	}*/
	
	$('#fillBtn').click(function(){
		//var tissueType = $(this).attr('data-tissue-type');
		//var tissueSampleList = $(this).attr('data-tissue-samples');
		alert(('#tissueTypeHdn').value+'  '+('#tissueSamplesHdn').value);
		var tissueType = ('#tissueTypeHdn').value;
		var tissueSampleList = ('#tissueSamplesHdn').value;
		$.ajax({		
			url : 'StorageLocationAjaxServlet?action=autoFill&tissueType='+tissueType,
			data : { 
				tissueSamples : tissueSampleList
			},
			success : function(responseJson){
				alert('building');
			},
			error : function(errorThrown){
				alert('error found'+errorThrown);
			}
		});
	});
	
	
	/*$('#fillBtn').click(function(event){
		alert('===>test');
		$.ajax({		
			url : 'StorageLocationAjaxServlet?action=autoFill',
			data : { autoFill : 'true'},
			success : function(responseJson){
				alert('building');
			},
			error : function(errorThrown){
				alert('error found'+errorThrown);
			}
		});
	});*/
	

	function saveContainerLocationAjax(tissueId,sampleContainerId,elementId,existingFesaCode)
	{
		if(existingFesaCode=='undefined')
	 		existingFesaCode = '';
		 $.ajax({
				url : 'StorageLocationAjaxServlet?action=save&tissueId='+tissueId+'&existing_sample='+existingFesaCode,
				data :{
					sample_container_id : sampleContainerId
				},
				success : function(responseJson)
				{
					 if(responseJson.match('Failed'))
						 alert(responseJson);
					 else
						 {
						 	$('#fillLocationValue_'+elementId).text(responseJson);
						 	$('#fillLocationValue_'+elementId).attr('style', 'font-weight: bold; background-color: #fafdec; ');
						 }
				},
				error : function(errorThrown){
					alert('Problem while saving container details. Try again or contact Anonymus support');
				}
			 });
		 
		 existingFesaCode = '';
	}
	
	
   $.each(storageLoc, function(index,value){
		
	   var setContainerSession = 0;
       var setCaneSession = 0;
       var setGobletSession = 0;
       var setLocationSession = 0;
       var setInnerLocationSession = 0;
	   var checkFesaCode = '';
       var changeLocId = storageLoc[count];
	   var buildingId = buildingArray[count];
	   var tissueId = changeLocId.substring('changeLoc_'.length,changeLocId.length);
	    $('#'+changeLocId).click(function(event) {
			 $('#ul_'+changeLocId).show();
		 });
	    
	   $('#close_selected_'+changeLocId).click(function(event){
		   alert('close it now '+changeLocId);
		   $('#building383_1_'+changeLocId).hide();                  
           $('#quarantine_1_'+changeLocId).hide();
           $('#mlc_1_'+changeLocId).hide();
	   });
	   
	    //First level
	    $('#building383_'+changeLocId).click(function(event) {    	    	
        	 $.ajax({
                 url : 'StorageLocationAjaxServlet?action=container',
                 data : {
                     sample_container_id : '286011' //sample_conatiner_id for building 383
                 },
                 success : function(responseJson) {               	 
                	 var $building383_1_ul = $('#building383_1_'+changeLocId); 
                	 var $li_1 = [];
                	 //remove all old items from previous clicks before adding functionalities
                     $.each(responseJson, function(index, sample){
                    	 $li_1[index] = $("<li>",{id:'li_1_'+sample.primaryKey+'_'+sample.priorityId, text:sample.label});
                    	 setContainerSession = sample.priorityId;
                    	 $li_1[index].click(function(event){                    		 
                    		 event.stopPropagation();
                    		 $.ajax({
                    			 url : 'StorageLocationAjaxServlet?action=container',
                    			 data :{
                    				 sample_container_id : sample.primaryKey
                    			 },
                    			 success : function(responseJson)
                    			 {
                    				 var $building383_2_ul = $('#building383_2_'+changeLocId);
                    				 $li_1[index].append($building383_2_ul); //add <ul> to parent <li>
                    				 var $li_2 = [];
                    				 $.each(responseJson, function(index,sample){
                    					 $li_2[index] = $("<li>",{id:'li_2_'+sample.primaryKey+'_'+sample.priorityId, text:sample.label});
                    					 setCaneSession = sample.priorityId;
                    					 //Second level - Canister - on click create the child nodes
                    					 $li_2[index].click(function(event){
                                    		 event.stopPropagation(); //Important to stop event bubbling
                                    		 setCaneSession = sample.priorityId;
                                    		 $.ajax({
                                    			 url : 'StorageLocationAjaxServlet?action=container',
                                    			 data :{
                                    				 sample_container_id : sample.primaryKey
                                    			 },
                                    			 success : function(responseJson)
                                    			 {
                                    				 var $building383_3_ul = $('#building383_3_'+changeLocId);
                                    				 //$building383_3_ul.empty();
                                    				 $li_2[index].append($building383_3_ul);
                                    				 var $li_3 = [];
                                    				 $.each(responseJson, function(index,sample){
                                    					 $li_3[index] = $("<li>",{id:'li_3_'+sample.primaryKey+'_'+sample.priorityId, text:sample.label});
                                    					 setGobletSession = sample.priorityId;
                                    					 //Third level - Goblet - on click create cane/goblet nodes
                                    					 $li_3[index].click(function(event){
                                                    		 event.stopPropagation(); //Important to stop event bubbling
                                                     		 $.ajax({
                                                    			 url : 'StorageLocationAjaxServlet?action=container',
                                                    			 data :{
                                                    				 sample_container_id : sample.primaryKey
                                                    			 },
                                                    			 success : function(responseJson)
                                                    			 {
                                                    				 var $building383_4_ul = $('#building383_4_'+changeLocId);
                                                    				 $li_3[index].append($building383_4_ul);
                                                    				 var $li_4 = [];
                                                    				 $.each(responseJson, function(index,sample){
                                                    					 var tissueName = sample.label;
                                                    					 if(sample.sampleName!=null)
                                                    					 {
                                                    						 tissueName = sample.label +' ('+sample.sampleName+')';
                                                    						 checkFesaCode = sample.sampleName;
                                                    					 }
                                                    					 $li_4[index] = $("<li>",{id:'li_4_'+sample.primaryKey+'_'+sample.priorityId, text:tissueName});
                                                    					 setLocationSession = sample.priorityId;
                                                    					 //Fourth level - Tube - on click create tube nodes
                                                    					 $li_4[index].click(function(event){
                                                    						 event.stopPropagation();
                                                    						 setLocationSession = sample.priorityId;
                                                    						 $.ajax({
                                                    							 url : 'StorageLocationAjaxServlet?action=container',
                                                                    			 data :{
                                                                    				 sample_container_id : sample.primaryKey
                                                                    			 },
                                                                    			 success : function(responseJson)
                                                                    			 {
                                                                    				 if(responseJson!=null && responseJson.length>0)
                                                                    				{	 
		                                                                    				 var $building383_5_ul = $('#building383_5_'+changeLocId)
		                                                                    				 $li_4[index].append($building383_5_ul);
		                                                                    				 var $li_5 = [];
		                                                                    				 $.each(responseJson, function(index, sample){
		                                                                    					 var tissueName = sample.label;
		                                                                    					 if(sample.sampleName!=null)
		                                                                    						 {
		                                                                    						 	tissueName = sample.label +' ('+sample.sampleName+')';
		                                                                    						 	checkFesaCode = sample.sampleName;
		                                                                    						 }
		                                                                    					 $li_5[index] = $("<li>",{id:'li_5_'+sample.primaryKey+'_'+sample.priorityId, text:tissueName});
		                                                                    					 setInnerLocationSession = sample.priorityId;
		                                                                    					 $li_5[index].click(function(event){
		                                                                    						 event.stopPropagation();
		                                                                    						 setInnerLocationSession = sample.priorityId;
		                                                                    						 //Save the sample_container location for this tissue..actual saving
		                                                                    						 saveContainerLocationAjax(tissueId,sample.primaryKey,changeLocId,checkFesaCode);
		                                                                    						 checkFesaCode = '';
		                                                                    						 $('#ul_'+changeLocId).fadeOut();
		                                                                    					 });
		                                                                    				 });
		                                                                    				 
		                                                                    				 $building383_5_ul.append($li_5);
		                                                                    				 var $toremove5 = $building383_5_ul.children();
		                                                                    				 $.each($toremove5,function(index,value){
		                                                                    					 if(!this.id.match(setInnerLocationSession))
		                                                                    					 { 
		                                                                  						 	$('#'+this.id).hide();
		                                                                    					 }
		                                                                    				 }); 
                                                                    				}
                                                                    				 else
                                                                    					 {
                                                                    					     event.stopPropagation();
                                                                    					     saveContainerLocationAjax(tissueId,sample.primaryKey,changeLocId,checkFesaCode);
                                                                    					     checkFesaCode = '';
	                                                                    					 $('#ul_'+changeLocId).fadeOut();
                                                                    					 }
                                                                    			 }
                                                    						 });
                                                    						 
                                                    						  
                                                    					 });
                                                    				 });
                                                    				 $building383_4_ul.append($li_4);
                                                    				 //remove old <li> items from ul or else previously clicked list items will still stick around
                                                    				 var $toremove = $building383_4_ul.children();
                                                    				 $.each($toremove,function(index,value){
                                                    					 if(!this.id.match(setLocationSession))
                                                    					 { 
                                                  						 	$('#'+this.id).hide();
                                                    					 }
                                                    				 }); 
                                                    			 }
                                                    		 });
                                                    		 
                                                    		 
                                                    		 
                                                    	 
                                    					 });
                                    					 
                                    				 });
                                    				 $building383_3_ul.append($li_3);
                                    				 var $toremove3 = $building383_3_ul.children();
                                    				 $.each($toremove3,function(index,value){
                                    					 if(!this.id.match(setGobletSession))
                                    					 { 
                                  						 	$('#'+this.id).hide();
                                    					 }
                                    				 }); 
                                    			 }
                                    		 });
                                    		 
                                    		 
                                    		 
                                    	 });
                    					 
                    				 });
                    				 $building383_2_ul.append($li_2);
                    				 var $toremove2 = $building383_2_ul.children();
                    				 $.each($toremove2,function(index,value){
                    					 if(!this.id.match(setCaneSession))
                    					 { 
                  						 	$('#'+this.id).hide();
                    					 }
                    				 }); 
                    			 }
                    		 });
                    		 
                    		 
                    		 
                    	 });
                    	
                     });
                     
                     
                     $building383_1_ul.append($li_1);
                     var $toremove1 = $building383_1_ul.children();
    				 $.each($toremove1,function(index,value){
    			     //remove all links that are not in current session 
  					 if(!this.id.match(setContainerSession))
    					 { 
  						 	$('#'+this.id).hide();
    					 }
    				 }); 
    				
                     $('#building383_1_'+changeLocId).show();                  
                     $('#quarantine_1_'+changeLocId).hide();
                     $('#mlc_1_'+changeLocId).hide();

                 }
            });
        });
	    
	    $('#quarantine_'+changeLocId).click(function(event) {	    	
       	 $.ajax({
                url : 'StorageLocationAjaxServlet?action=container',
                data : {
                    sample_container_id : '286012' //sample_conatiner_id for Quarantine
                },
                success : function(responseJson) {               	 
               	 var $quarantine_1_ul = $('#quarantine_1_'+changeLocId); 
               	 var $q_li_1 = [];
               	 //remove all old items from previous clicks before adding functionalities
                    $.each(responseJson, function(index, sample){
                   	 $q_li_1[index] = $("<li>",{id:'q_li_1_'+sample.primaryKey+'_'+sample.priorityId, text:sample.label});
                   	 setContainerSession = sample.priorityId;
                   	 $q_li_1[index].click(function(event){                    		 
                   		 event.stopPropagation();
                   		 $.ajax({
                   			 url : 'StorageLocationAjaxServlet?action=container',
                   			 data :{
                   				 sample_container_id : sample.primaryKey
                   			 },
                   			 success : function(responseJson)
                   			 {
                   				 var $quarantine_2_ul = $('#quarantine_2_'+changeLocId);
                   				 $q_li_1[index].append($quarantine_2_ul); //add <ul> to parent <li>
                   				 var $q_li_2 = [];
                   				 $.each(responseJson, function(index,sample){
                   					 $q_li_2[index] = $("<li>",{id:'q_li_2_'+sample.primaryKey+'_'+sample.priorityId, text:sample.label});
                   					 setCaneSession = sample.priorityId;
                   					 //Second level - Canister - on click create the child nodes
                   					 $q_li_2[index].click(function(event){
                                   		 event.stopPropagation(); //Important to stop event bubbling
                                   		 setCaneSession = sample.priorityId;
                                   		 $.ajax({
                                   			 url : 'StorageLocationAjaxServlet?action=container',
                                   			 data :{
                                   				 sample_container_id : sample.primaryKey
                                   			 },
                                   			 success : function(responseJson)
                                   			 {
                                   				 var $quarantine_3_ul = $('#quarantine_3_'+changeLocId);
                                   				 //$quarantine_3_ul.empty();
                                   				 $q_li_2[index].append($quarantine_3_ul);
                                   				 var $q_li_3 = [];
                                   				 $.each(responseJson, function(index,sample){
                                   					 $q_li_3[index] = $("<li>",{id:'q_li_3_'+sample.primaryKey+'_'+sample.priorityId, text:sample.label});
                                   					 setGobletSession = sample.priorityId;
                                   					 //Third level - Goblet - on click create cane/goblet nodes
                                   					 $q_li_3[index].click(function(event){
                                                   		 event.stopPropagation(); //Important to stop event bubbling
                                                    		 $.ajax({
                                                   			 url : 'StorageLocationAjaxServlet?action=container',
                                                   			 data :{
                                                   				 sample_container_id : sample.primaryKey
                                                   			 },
                                                   			 success : function(responseJson)
                                                   			 {
                                                   				 var $quarantine_4_ul = $('#quarantine_4_'+changeLocId);
                                                   				 $q_li_3[index].append($quarantine_4_ul);
                                                   				 var $q_li_4 = [];
                                                   				 $.each(responseJson, function(index,sample){
                                                   					 var tissueName = sample.label;
                                                   					 if(sample.sampleName!=null)
                                                   					 {
                                             						 	tissueName = sample.label +' ('+sample.sampleName+')';
                                             						 	checkFesaCode = sample.sampleName;
                                             						 }
                                                   					 $q_li_4[index] = $("<li>",{id:'q_li_4_'+sample.primaryKey+'_'+sample.priorityId, text:tissueName});
                                                   					 setLocationSession = sample.priorityId;
                                                   					 //Fourth level - Tube - on click create tube nodes
                                                   					 $q_li_4[index].click(function(event){
                                                   						 event.stopPropagation();
                                                   						 setLocationSession = sample.priorityId;
                                                   						 $.ajax({
                                                   							 url : 'StorageLocationAjaxServlet?action=container',
                                                                   			 data :{
                                                                   				 sample_container_id : sample.primaryKey
                                                                   			 },
                                                                   			 success : function(responseJson)
                                                                   			 {
                                                                   				 if(responseJson!=null && responseJson.length>0)
                                                                   				{	 
		                                                                    				 var $quarantine_5_ul = $('#quarantine_5_'+changeLocId)
		                                                                    				 $q_li_4[index].append($quarantine_5_ul);
		                                                                    				 var $q_li_5 = [];
		                                                                    				 $.each(responseJson, function(index, sample){
		                                                                    					 var tissueName = sample.label;
		                                                                    					 if(sample.sampleName!=null)
		                                                                    					 {
		                                                                    						 	tissueName = sample.label +' ('+sample.sampleName+')';
		                                                                    						 	checkFesaCode = sample.sampleName;
		                                                                    					 }
		                                                                    					 $q_li_5[index] = $("<li>",{id:'q_li_5_'+sample.primaryKey+'_'+sample.priorityId, text:tissueName});
		                                                                    					 setInnerLocationSession = sample.priorityId;
		                                                                    					 $q_li_5[index].click(function(event){
		                                                                    						 event.stopPropagation();
		                                                                    						 setInnerLocationSession = sample.priorityId;
		                                                                    						 //Save the sample_container location for this tissue..actual saving
		                                                                    						 saveContainerLocationAjax(tissueId,sample.primaryKey,changeLocId,checkFesaCode);
		                                                                    					     checkFesaCode = '';
		                                                                    						 $('#ul_'+changeLocId).fadeOut();
		                                                                    					 });
		                                                                    				 });
		                                                                    				 
		                                                                    				 $quarantine_5_ul.append($q_li_5);
		                                                                    				 var $toremove5 = $quarantine_5_ul.children();
		                                                                    				 $.each($toremove5,function(index,value){
		                                                                    					 if(!this.id.match(setInnerLocationSession))
		                                                                    					 { 
		                                                                  						 	$('#'+this.id).hide();
		                                                                    					 }
		                                                                    				 }); 
                                                                   				}
                                                                   				 else
                                                                   					 {
                                                                   					     event.stopPropagation();
                                                                   					     saveContainerLocationAjax(tissueId,sample.primaryKey,changeLocId,checkFesaCode);
                                                             					         checkFesaCode = '';
	                                                                    					 $('#ul_'+changeLocId).fadeOut();
                                                                   					 }
                                                                   			 }
                                                   						 });
                                                   						 
                                                   						  
                                                   					 });
                                                   				 });
                                                   				 $quarantine_4_ul.append($q_li_4);
                                                   				 //remove old <li> items from ul or else previously clicked list items will still stick around
                                                   				 var $qtoremove = $quarantine_4_ul.children();
                                                   				 $.each($qtoremove,function(index,value){
                                                   					 if(!this.id.match(setLocationSession))
                                                   					 { 
                                                 						 	$('#'+this.id).hide();
                                                   					 }
                                                   				 }); 
                                                   			 }
                                                   		 });
                                                   		 
                                                   		 
                                                   		 
                                                   	 
                                   					 });
                                   					 
                                   				 });
                                   				 $quarantine_3_ul.append($q_li_3);
                                   				 var $qtoremove3 = $quarantine_3_ul.children();
                                   				 $.each($qtoremove3,function(index,value){
                                   					 if(!this.id.match(setGobletSession))
                                   					 { 
                                 						 	$('#'+this.id).hide();
                                   					 }
                                   				 }); 
                                   			 }
                                   		 });
                                   		 
                                   		 
                                   		 
                                   	 });
                   					 
                   				 });
                   				 $quarantine_2_ul.append($q_li_2);
                   				 var $qtoremove2 = $quarantine_2_ul.children();
                   				 $.each($qtoremove2,function(index,value){
                   					 if(!this.id.match(setCaneSession))
                   					 { 
                 						 	$('#'+this.id).hide();
                   					 }
                   				 }); 
                   			 }
                   		 });
                   		 
                   		 
                   		 
                   	 });
                   	
                    });
                    
                    
                    $quarantine_1_ul.append($q_li_1);
                    var $qtoremove1 = $quarantine_1_ul.children();
   				 $.each($qtoremove1,function(index,value){
   			     //remove all links that are not in current session 
 					 if(!this.id.match(setContainerSession))
   					 { 
 						 	$('#'+this.id).hide();
   					 }
   				 }); 
   				
                    $('#quarantine_1_'+changeLocId).show();                  
                    $('#building383_1_'+changeLocId).hide();
                    $('#mlc_1_'+changeLocId).hide();

                }
           });
	    });
	    
	    
	    
	    $('#mlc_'+changeLocId).click(function(event) {
	    	
	       	 $.ajax({
	                url : 'StorageLocationAjaxServlet?action=container',
	                data : {
	                    sample_container_id : '286013' //sample_conatiner_id for MLC
	                },
	                success : function(responseJson) {               	 
	               	 var $mlc_1_ul = $('#mlc_1_'+changeLocId); 
	               	 var $m_li_1 = [];
	               	 //remove all old items from previous clicks before adding functionalities
	                    $.each(responseJson, function(index, sample){
	                   	 $m_li_1[index] = $("<li>",{id:'m_li_1_'+sample.primaryKey+'_'+sample.priorityId, text:sample.label});
	                   	 setContainerSession = sample.priorityId;
	                   	 $m_li_1[index].click(function(event){                    		 
	                   		 event.stopPropagation();
	                   		 $.ajax({
	                   			 url : 'StorageLocationAjaxServlet?action=container',
	                   			 data :{
	                   				 sample_container_id : sample.primaryKey
	                   			 },
	                   			 success : function(responseJson)
	                   			 {
	                   				 var $mlc_2_ul = $('#mlc_2_'+changeLocId);
	                   				 $m_li_1[index].append($mlc_2_ul); //add <ul> to parent <li>
	                   				 var $m_li_2 = [];
	                   				 $.each(responseJson, function(index,sample){
	                   					 $m_li_2[index] = $("<li>",{id:'m_li_2_'+sample.primaryKey+'_'+sample.priorityId, text:sample.label});
	                   					 setCaneSession = sample.priorityId;
	                   					 //Second level - Canister - on click create the child nodes
	                   					 $m_li_2[index].click(function(event){
	                                   		 event.stopPropagation(); //Important to stop event bubbling
	                                   		 setCaneSession = sample.priorityId;
	                                   		 $.ajax({
	                                   			 url : 'StorageLocationAjaxServlet?action=container',
	                                   			 data :{
	                                   				 sample_container_id : sample.primaryKey
	                                   			 },
	                                   			 success : function(responseJson)
	                                   			 {
	                                   				 var $mlc_3_ul = $('#mlc_3_'+changeLocId);
	                                   				 //$mlc_3_ul.empty();
	                                   				 $m_li_2[index].append($mlc_3_ul);
	                                   				 var $m_li_3 = [];
	                                   				 $.each(responseJson, function(index,sample){
	                                   					 $m_li_3[index] = $("<li>",{id:'m_li_3_'+sample.primaryKey+'_'+sample.priorityId, text:sample.label});
	                                   					 setGobletSession = sample.priorityId;
	                                   					 //Third level - Goblet - on click create cane/goblet nodes
	                                   					 $m_li_3[index].click(function(event){
	                                                   		 event.stopPropagation(); //Important to stop event bubbling
	                                                    		 $.ajax({
	                                                   			 url : 'StorageLocationAjaxServlet?action=container',
	                                                   			 data :{
	                                                   				 sample_container_id : sample.primaryKey
	                                                   			 },
	                                                   			 success : function(responseJson)
	                                                   			 {
	                                                   				 var $mlc_4_ul = $('#mlc_4_'+changeLocId);
	                                                   				 $m_li_3[index].append($mlc_4_ul);
	                                                   				 var $m_li_4 = [];
	                                                   				 $.each(responseJson, function(index,sample){
	                                                   					 var tissueName = sample.label;
	                                                   					 if(sample.sampleName!=null)
	                                                   					 {
                                                 						 	tissueName = sample.label +' ('+sample.sampleName+')';
                                                 						 	checkFesaCode = sample.sampleName;
                                                 						 }
	                                                   					 $m_li_4[index] = $("<li>",{id:'m_li_4_'+sample.primaryKey+'_'+sample.priorityId, text:tissueName});
	                                                   					 setLocationSession = sample.priorityId;
	                                                   					 //Fourth level - Tube - on click create tube nodes
	                                                   					 $m_li_4[index].click(function(event){
	                                                   						 event.stopPropagation();
	                                                   						 setLocationSession = sample.priorityId;
	                                                   						 $.ajax({
	                                                   							 url : 'StorageLocationAjaxServlet?action=container',
	                                                                   			 data :{
	                                                                   				 sample_container_id : sample.primaryKey
	                                                                   			 },
	                                                                   			 success : function(responseJson)
	                                                                   			 {
	                                                                   				 if(responseJson!=null && responseJson.length>0)
	                                                                   				{	 
			                                                                    				 var $mlc_5_ul = $('#mlc_5_'+changeLocId)
			                                                                    				 $m_li_4[index].append($mlc_5_ul);
			                                                                    				 var $m_li_5 = [];
			                                                                    				 $.each(responseJson, function(index, sample){
			                                                                    					 var tissueName = sample.label;
			                                                                    					 if(sample.sampleName!=null)
			                                                                    					 {
			                                                                    						 	tissueName = sample.label +' ('+sample.sampleName+')';
			                                                                    						 	checkFesaCode = sample.sampleName;
			                                                                    					 }
			                                                                    					 $m_li_5[index] = $("<li>",{id:'m_li_5_'+sample.primaryKey+'_'+sample.priorityId, text:tissueName});
			                                                                    					 setInnerLocationSession = sample.priorityId;
			                                                                    					 $m_li_5[index].click(function(event){
			                                                                    						 event.stopPropagation();
			                                                                    						 setInnerLocationSession = sample.priorityId;
			                                                                    						 //Save the sample_container location for this tissue..actual saving
			                                                                    						 saveContainerLocationAjax(tissueId,sample.primaryKey,changeLocId,checkFesaCode);
			                                                                    					     checkFesaCode = '';
			                                                                    						 $('#ul_'+changeLocId).fadeOut();
			                                                                    					 });
			                                                                    				 });
			                                                                    				 
			                                                                    				 $mlc_5_ul.append($m_li_5);
			                                                                    				 var $mtoremove5 = $mlc_5_ul.children();
			                                                                    				 $.each($mtoremove5,function(index,value){
			                                                                    					 if(!this.id.match(setInnerLocationSession))
			                                                                    					 { 
			                                                                  						 	$('#'+this.id).hide();
			                                                                    					 }
			                                                                    				 }); 
	                                                                   				}
	                                                                   				 else
	                                                                   					 {
	                                                                   					     event.stopPropagation();
	                                                                   					     saveContainerLocationAjax(tissueId,sample.primaryKey,changeLocId,checkFesaCode);
                                                                 					         checkFesaCode = '';
		                                                                    					 $('#ul_'+changeLocId).fadeOut();
	                                                                   					 }
	                                                                   			 }
	                                                   						 });
	                                                   						 
	                                                   						  
	                                                   					 });
	                                                   				 });
	                                                   				 $mlc_4_ul.append($m_li_4);
	                                                   				 //remove old <li> items from ul or else previously clicked list items will still stick around
	                                                   				 var $mtoremove = $mlc_4_ul.children();
	                                                   				 $.each($mtoremove,function(index,value){
	                                                   					 if(!this.id.match(setLocationSession))
	                                                   					 { 
	                                                 						 	$('#'+this.id).hide();
	                                                   					 }
	                                                   				 }); 
	                                                   			 }
	                                                   		 });
	                                                   		 
	                                                   		 
	                                                   		 
	                                                   	 
	                                   					 });
	                                   					 
	                                   				 });
	                                   				 $mlc_3_ul.append($m_li_3);
	                                   				 var $mtoremove3 = $mlc_3_ul.children();
	                                   				 $.each($mtoremove3,function(index,value){
	                                   					 if(!this.id.match(setGobletSession))
	                                   					 { 
	                                 						 	$('#'+this.id).hide();
	                                   					 }
	                                   				 }); 
	                                   			 }
	                                   		 });
	                                   		 
	                                   		 
	                                   		 
	                                   	 });
	                   					 
	                   				 });
	                   				 $mlc_2_ul.append($m_li_2);
	                   				 var $mtoremove2 = $mlc_2_ul.children();
	                   				 $.each($mtoremove2,function(index,value){
	                   					 if(!this.id.match(setCaneSession))
	                   					 { 
	                 						 	$('#'+this.id).hide();
	                   					 }
	                   				 }); 
	                   			 }
	                   		 });
	                   		 
	                   		 
	                   		 
	                   	 });
	                   	
	                    });
	                    
	                    
	                    $mlc_1_ul.append($m_li_1);
	                    var $mtoremove1 = $mlc_1_ul.children();
	   				 $.each($mtoremove1,function(index,value){
	   			     //remove all links that are not in current session 
	 					 if(!this.id.match(setContainerSession))
	   					 { 
	 						 	$('#'+this.id).hide();
	   					 }
	   				 }); 
	   				
	                    $('#quarantine_1_'+changeLocId).hide();                  
	                    $('#building383_1_'+changeLocId).hide();
	                    $('#mlc_1_'+changeLocId).show();

	                }
	           });
		    
	    });
	    
	   count++;
   });
	
   
   function removeNodes(element)
   {
	   var allChildren = $(element).children();
	   $.each(allChildren, function(index, value){
		   if(this.tagName=='UL')
			   {
			   alert(this.id);
			   $('#'+this.id).hide();
			   $('#'+this.id).unbind();
			      $('#'+this.id).remove();
			     
			   }
	   });
   }
     
});
