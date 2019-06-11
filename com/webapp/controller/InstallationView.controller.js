sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/m/MessageBox",
], function (Controller, History, MessageBox) {
	"use strict";

	return Controller.extend("com.controller.InstallationView", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.view.InstallationView
		 */
		onInit: function () {
			this.odataService = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZQNX_IOT_SRV/", true);
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute("InstallationView").attachMatched(this._onObjectMatched, this);
			this.getView().byId("issue").setValue("Installation Request");
		},
		_onObjectMatched: function (oEvent) {
			var that = this;
			that.getView().byId("issue").setValue("Installation Request");
			that.deviceId = oEvent.getParameter("arguments").deviceId;
			that.FaultCode = oEvent.getParameter("arguments").FaultCode;
			that.mobileNum = oEvent.getParameter("arguments").mobileNum;
			var mobileNumber = that.mobileNum;
			this.odataService.read("/CustomerSet('" + mobileNumber + "')", null, null, false, function (
				response) {
				if (response.ValidPhoneNo === "Success") {
					console.log(response);
					that.getOwnerComponent().getModel("oCustomer").setData(response);
					that.custId = response.BusinessPartner;
					that.getOwnerComponent().getModel("oCustomer").refresh(true);
				}

			});

		},
		onPress: function () {
			this.getOwnerComponent().getRouter().navTo("Main");
		},
		onSubmit: function () {
			var that = this;
			var issue = that.getView().byId("issue").getValue();
			var comments = that.getView().byId("comments").getValue();
			var faultCode = "Z529";
			var data = {};
			data.Issue = issue;
			data.Comment = comments;
			data.CustomerID = that.custId;
			data.DeviceName = "";
			data.ModelId = that.deviceId;

			data.FaultCode = faultCode;
			if (issue === "" || comments === "") {
				MessageBox.information("Please enter all mandatory fields");
			} else {
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
			}
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.view.InstallationView
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.view.InstallationView
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.view.InstallationView
		 */
		//	onExit: function() {
		//
		//	}

	});

});