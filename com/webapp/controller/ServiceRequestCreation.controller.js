sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/core/routing/History"
], function (Controller, MessageBox, History) {
	"use strict";

	return Controller.extend("com.controller.ServiceRequestCreation", {

		onInit: function () {
			this.result = {};
			this.result.items = [];
			this.deviceId = "";
			this.FaultCode = "";
			this.customerID = "";

			this.odataService = new sap.ui.model.odata.ODataModel("/IotWaterPurifier", {
				json: true
			});
			// this.odataService = new sap.ui.model.odata.ODataModel("/IotWaterPurifier", {
			// 	json: true,
			// 	headers: {
			// 		"X-Requested-With": "XMLHttpRequest",

			// 		"Content-Type": "application/atom+xml",

			// 		"DataServiceVersion": "2.0",

			// 		"X-CSRF-Token": "Fetch"

			// 	}
			// });
			// console.log(this.odataService);
			// this.odataService.disableHeadRequestForToken = true;
			// this.odataService.setHeaders({
			// 		"X-Requested-With": "XMLHttpRequest",

			// 		"Content-Type": "application/atom+xml",

			// 		"DataServiceVersion": "2.0",

			// 		"X-CSRF-Token": "Fetch"

			// 	}

			// );
			// console.log(X-CSRF-Token);
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute("ServiceRequestCreation").attachMatched(this._onObjectMatched, this);
		},
		_onObjectMatched: function (oEvent) {
			var that = this;
			that.deviceId = oEvent.getParameter("arguments").deviceId;
			that.FaultCode = oEvent.getParameter("arguments").FaultCode;
			that.customerID = oEvent.getParameter("arguments").customerID;
		},

		onSubmitDialog: function () {
			var that = this;
			// var issue = that.getView().byId("issue").getValue();
			var issue = that.getView().byId("issue").getSelectedItem().getText();
			var comments = that.getView().byId("comments").getValue();
			if ((issue !== "") && (comments !== "")) {
				var faultCode;
				if (issue === "Water Filter Issue") {
					faultCode = "Z105";
				} else
				if (issue === "Carbon Filter Issue") {
					faultCode = "Z106";
				} else if (issue === "RE Loose Connections") {
					faultCode = "Z109";
				} else if (issue === "No Water") {
					faultCode = "Z521";
				} else if (issue === "Water Not Clear") {
					faultCode = "Z522";
				} else if (issue === "Smell in Water") {
					faultCode = "Z523";
				} else if (issue === "Unit giving Shock") {
					faultCode = "Z524";
				} else if (issue === "No Green Light") {
					faultCode = "Z525";
				} else if (issue === "Unit not Working") {
					faultCode = "Z526";
				} else if (issue === "VC-Burning Smell") {
					faultCode = "Z527";
				} else if (issue === "Low Water Flow") {
					faultCode = "Z528";
				} else if (issue === "Others") {
					faultCode = "Z530";
				}
				var data = {};
				data.Issue = issue;
				data.Comment = comments;
				data.CustomerID = that.customerID;
				data.DeviceName = "";
				data.ModelId = that.deviceId;

				data.FaultCode = faultCode;
				// data.FaultCode = that.FaultCode;
				// data.DateOfCreation = "";
				// data.ServiceNumber = "";

				// http: //qnx-s4hana.quinnox.corp:8000/sap/opu/odata/sap/ZQNX_IOT_SRV/NotificationCreateSet(CustomerID='1000020',ModelId='Model2(1c8169af-cbdc-4202-950f-b233f2f5942d)',FaultCode='Z105',Issue='Water Filter Issue',Comment='testing Anna Bond')
				this.odataService.read(
					"/NotificationCreateSet(CustomerID='" + that.customerID + "',ModelId='" + that.deviceId + "',FaultCode='" + faultCode +
					"',Issue='" + issue +
					"',Comment='" + comments + "')",
					null, null,
					function (odata, response) {
						//console.log(response);
						// MessageBox.success("Service Request Created", {
						// 	title: "Success",
						// 	Action: "OK",
						// 	onClose: function (oAction) {
						// 		if (oAction === sap.m.MessageBox.Action.OK) {
						// 			// that.getOwnerComponent().getRouter().navTo("Main");
						// 			var sPreviousHash = History.getInstance().getPreviousHash();
						// 			if (sPreviousHash !== undefined) {
						// 				history.go(-1);
						// 			}
						// 		}
						// 	}

						// });
					},
					function (response) {
						//console.log(response);
						that.getView().byId("comments").setValue("");
						var serviceRequestNumber = response.ServiceNumber;
						var TechnicianPhone = response.TechnicianPhone;
						var TechnicianName = response.TechnicianName;
						var msg = "Service Request " + serviceRequestNumber + " Created Sucessfully.Technician Name-" + TechnicianName +
							" and Mobile-" + TechnicianPhone;

						MessageBox.success(msg, {
							title: "Success",
							Action: "OK",
							onClose: function (oAction) {
								if (oAction === sap.m.MessageBox.Action.OK) {
									// that.getOwnerComponent().getRouter().navTo("Main");
									var sPreviousHash = History.getInstance().getPreviousHash();
									if (sPreviousHash !== undefined) {
										history.go(-1);
									}
								}
							}

						});
					});
				// this.odataService.create("/ServiceRequestSet", data, {
				// 	headers: this.headers,
				// 	success: function (odata, response) {response

				// 		var msg = "Service Request " + response.data.ServiceNumber + " Created Successfully";
				// 		that.getView().byId("issue").setValue("");
				// 		that.getView().byId("comments").setValue("");
				// 		MessageBox.success(msg, {
				// 			title: "Success",
				// 			Action: "OK",
				// 			onClose: function (oAction) {
				// 				if (oAction === sap.m.MessageBox.Action.OK) {
				// 					// that.getOwnerComponent().getRouter().navTo("Main");
				// 					var sPreviousHash = History.getInstance().getPreviousHash();
				// 					if (sPreviousHash !== undefined) {
				// 						history.go(-1);
				// 					}
				// 				}
				// 			}

				// 		});

				// 	},
				// 	error: function (odata, response) {

				// 	}
				// });
				//Tried New 1
				// that.odataService.request({
				// 		requestUri: "/ServiceRequestSet",
				// 		method: "GET",
				// 		headers: {
				// 			"X-Requested-With": "XMLHttpRequest",
				// 			"Content-Type": "application/atom+xml",
				// 			"DataServiceVersion": "2.0",
				// 			"x-csrf-token": "Fetch"
				// 		}
				// 	},
				// 	function (insertedItem, response) {
				// 		var header_xcsrf_token = response.headers['x-csrf-token'];
				// 		var oHeaders = {
				// 			"X-Requested-With": "XMLHttpRequest",
				// 			"Content-Type": "application/atom+xml",
				// 			"DataServiceVersion": "2.0",
				// 			"x-csrf-token": header_xcsrf_token,
				// 			"Access-Control-Allow-Origin": "*",
				// 			"Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,OPTIONS",
				// 			"Accept": "application/json, application/atom+xml, application/atomsvc+xml "
				// 		};
				// 		that.odataService.request({
				// 				requestUri: "/ServiceRequestSet",
				// 				method: "POST",
				// 				headers: oHeaders,
				// 				data: data
				// 			},
				// 			function (data, response) {
				// 				MessageBox.success("Hi");
				// 				// SUCCESS
				// 			},
				// 			function (data, request) {
				// 				MessageBox.error("Hello");
				// 				// alert("error POST : " + data.response.body);

				// 			},
				// 			function () {

				// 				// dialogBusy.close();
				// 				// alert('error Get ');
				// 			});
				// 		// 		// Tried New 
				// 		// $.ajax({
				// 		// 	url: 'that.odataService/ServiceRequestSet',
				// 		// 	type: "GET",
				// 		// 	// Access-Control-Allow-Origin:"*",
				// 		// 	// Access-Control-Allow-Methods: "GET,PUT,POST,DELETE,OPTIONS",
				// 		// 	beforeSend: function (xhr) {
				// 		// 		xhr.setRequestHeader("X-CSRF-Token", "Fetch");
				// 		// 	},
				// 		// 	complete: function (xhr) {
				// 		// 		var token = xhr.getResponseHeader("X-CSRF-Token");
				// 		// 		console.log(token);

				// 		// 		$.ajax({
				// 		// 			type: 'POST',
				// 		// 			url: 'that.odataService/ServiceRequestSet',
				// 		// 			dataType: "json",
				// 		// 			data: JSON.stringify(data),
				// 		// 			contentType: "application/json",
				// 		// 			beforeSend: function (xhr) {
				// 		// 				xhr.setRequestHeader('X-CSRF-Token', token);
				// 		// 			},

				// 		// 			success: function () {
				// 		// 				MessageBox.success("Service Request Created Successfully");

				// 		// 				// new sap.m.MessageToast.show();
				// 		// 				// oDialogue.close();
				// 		// 				// sap.ui.getCore().byId("myTable").getModel().refresh(true);
				// 		// 			},
				// 		// 			error: function () {
				// 		// 				MessageBox.error("Error creating service request");
				// 		// 				// new sap.m.MessageToast.show("Error while adding the Customer");
				// 		// 				// oDialogue.close();
				// 		// 			}
				// 		// 		});

				// 		// 	}
				// 		// });

				// 	});
			} else {
				MessageBox.information("Please enter all mandatory fields");
			}

		},
		// comboboxChange: function (oEvent) {
		// 	var newval = oEvent.getParameter("newValue");
		// 	var key = oEvent.getSource().getSelectedItem();

		// 	if (newval !== "" && key === null) {
		// 		oEvent.getSource().setValue("");
		// 		oEvent.getSource().setValueState("Error");
		// 	} else {
		// 		oEvent.getSource().setValueState("None");
		// 	}

		// },
		onNavBack: function () {
			var sPreviousHash = History.getInstance().getPreviousHash();
			if (sPreviousHash !== undefined) {
				history.go(-1);
			} else {
				this.getOwnerComponent().getRouter().navTo("Tile");
			}

		},
		onPress: function () {
			var oRef = this;
			var sRouter = sap.ui.core.UIComponent.getRouterFor(oRef);
			sRouter.navTo("RootView",null,true);
			//	this.getOwnerComponent().getRouter().navTo("RootView");
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.view.ServiceRequestCreation
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.view.ServiceRequestCreation
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.view.ServiceRequestCreation
		 */
		//	onExit: function() {
		//
		//	}
	});

});