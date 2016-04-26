<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<script src="http://code.jquery.com/jquery-2.2.3.js" type="text/javascript"></script>
	<script src="<%=request.getContextPath()%>/containerLocationAjax.js" type="text/javascript"></script>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Insert title here</title>
</head>
<body>
                        <span id="fillLocationValue_changeLoc_1">
                       	
                       	</span>
                       		<!-- Physically create the list parent nodes only. Jquery/Ajax containerLocationAjax.js will create child nodes dynamically-->
                       		<!-- ADD ONLY THE FIRST CHILDREN AS <li> (next to img tag) -->
                                        	 		<ul class="menuFloat">
                                        	 		<li id="changeLoc_1%>">Change Location
                                        	 			<ul id="ul_changeLoc_1 %>" style="display:none">
                                        	 				<li id="building383_changeLoc_1 %>" >
                                        	 					<img src="<%=request.getContextPath()%>/stylesheet/extToolkit/resources/images/default/tree/house.png">Building 383
                                        	 					<ul id="building383_1_changeLoc_1 %>" ></ul>
                                        	 						<ul id="building383_2_changeLoc_1 %>" ></ul>
                                        	 							<ul id="building383_3_changeLoc_1 %>"></ul>
                                        	 								<ul id="building383_4_changeLoc_1 %>"></ul>
                                        	 									<ul id="building383_5_changeLoc_1 %>"></ul>
                                        	 					
                                        	 				</li>
                                        	 				<li id="quarantine_changeLoc_1 %>">
                                        	 				<img src="<%=request.getContextPath()%>/stylesheet/extToolkit/resources/images/default/tree/house.png">Quarantine suite
                                        	 					<ul id="quarantine_1_changeLoc_1 %>" ></ul>
                                        	 						<ul id="quarantine_2_changeLoc_1 %>" ></ul>
                                        	 							<ul id="quarantine_3_changeLoc_1 %>"></ul>
                                        	 								<ul id="quarantine_4_changeLoc_1 %>" ></ul>
                                        	 									<ul id="quarantine_5_changeLoc_1 %>" ></ul>
                                        	 				</li>
                                        	 				<li id="mlc_changeLoc_1 %>">
                                        	 				<img src="<%=request.getContextPath()%>/stylesheet/extToolkit/resources/images/default/tree/house.png">MLC main centre
                                        	 					<ul id="mlc_1_changeLoc_1 %>" ></ul>
                                        	 						<ul id="mlc_2_changeLoc_1 %>" ></ul>
                                        	 							<ul id="mlc_3_changeLoc_1 %>" ></ul>
                                        	 								<ul id="mlc_4_changeLoc_1 %>"></ul>
                                        	 									<ul id="mlc_5_changeLoc_1 %>"></ul>
                                        	 					</li>
                                        	 			</ul>
                                        	 		</li>
                                      </ul>
                                     

</body>
</html>