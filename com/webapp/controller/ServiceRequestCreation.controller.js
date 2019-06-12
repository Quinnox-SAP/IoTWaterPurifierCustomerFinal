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
			// this.odataService.disableHeadRequestForToken = true;
			// this.odataService.setHeaders({
			// 		"X-Requested-With": "XMLHttpRequest",
			// 		"X-CSRF-Token": "Fetch"

			// 	}

			// );
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
				this.odataService.create("/ServiceRequestSet", data, null, function (odata, response) {

						var msg = "Service Request " + response.data.ServiceNumber + " Created Successfully";
						that.getView().byId("issue").setValue("");
						that.getView().byId("comments").setValue("");
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

					},
					function (odata, response) {

					}
				);
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
			this.getOwnerComponent().getRouter().navTo("RootView");
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