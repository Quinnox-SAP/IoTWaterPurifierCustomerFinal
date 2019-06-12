sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox"
], function (Controller, MessageBox) {
	"use strict";
	return Controller.extend("com.controller.Main", {
		onInit: function () {
			this.result = {};
			this.result.items = [];

			this.zodataService = new sap.ui.model.odata.ODataModel("/IotWaterPurifier", {
				json: true
			});

			this.mobNum = "";

			var oModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oModel, "thingPageModel");

			var oModel1 = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oModel1, "Data");

			this.getView().addEventDelegate({
				onBeforeShow: jQuery.proxy(function (evt) {
					this.onBeforeShow(evt);
				}, this)
			});
		},
		onBeforeShow: function (oEvent) {

			// var thindId1 = "1499FB1614014E2DB4A1B616C2C96564";
			// var thingId2 = "256B9DAF767E4AED99E1E8919ABF6486";
			// var thingId3 = "D859B110379F4A239B5EFDFBD312C28C";

			this.odataService = new sap.ui.model.odata.ODataModel("/IOTAS-ADVANCEDLIST-THING-ODATA/CompositeThings/v1/", true);
			this.odataService.read("/Things", null, null, false, function (response) {
				// console.log(response);
				var i = 0;
				for (i = 0; i < response.results.length; i++) {
					if (response.results[i].ThingDescription === "IoT Thing for Customer 1000020") {
						sap.ui.getCore().thingId1 = response.results[i].ThingId;
						sap.ui.getCore().thing1Type = response.results[i].ThingType;
					}
					if (response.results[i].ThingDescription === "Model 2 thing") {
						sap.ui.getCore().thingId2 = response.results[i].ThingId;
						sap.ui.getCore().thing1Type = response.results[i].ThingType;
					}
					if (response.results[i].ThingDescription === "Model 3 Thing") {
						sap.ui.getCore().thingId3 = response.results[i].ThingId;
						sap.ui.getCore().thing1Type = response.results[i].ThingType;
					}

				}
				// console.log(thingId1);
				// console.log(thing1Type);
				// console.log(thingId2);
				// console.log(thing1Type);
				// console.log(thingId3);
				// console.log(thing1Type);
			});
		},
		onSubmit: function (oEvent) {
			var that = this;
			this.mobNum = that.getView().byId("idnum").getValue();

			sap.ui.getCore().sThingId = sap.ui.getCore().thingId1;
			// // this.sThingId = sap.ui.getCore().thingId2;
			// this.sThingId = sap.ui.getCore().thingId3;

			// sap.ui.getCore().thingId = "AE79A8A09BEF4EF8BF14C1ADA78EB031";
			// sap.ui.getCore().TDSthingId = "1B12D81C646A4AA5ACCBDF59EF5F5B7E";
			// var sThingType = "iot.quinnoxiotcf.iotpackage:pHOutputThingType";
			var oDetailsThingModel = this._findThingModel(sap.ui.getCore().thing1Type);
			if (oDetailsThingModel) {
				// this._readDetailsService(oDetailsThingModel, this.sThingId);
				this._readDetailsService(oDetailsThingModel, sap.ui.getCore().sThingId);
			} else {
				var sURL = "/IOTAS-DETAILS-THING-ODATA/CompositeThings/ThingType/v1/" + sap.ui.getCore().thing1Type;
				var oNewThingTypeModel = new sap.ui.model.odata.ODataModel(sURL);
				// this._readDetailsService(oNewThingTypeModel, this.sThingId);
				this._readDetailsService(oNewThingTypeModel, sap.ui.getCore().sThingId);
			}
			// if (sap.ui.getCore().validationFlag === "B") {
			// 	this.callThing2Validation(sap.ui.getCore().thingId2);
			// }

		},
		_readDetailsService: function (oDetailsModel, sThingId) {
			var that = this;
			var mobileNum = that.getView().byId("idnum").getValue();
			// this.odataService.read("/CustomerSet('" + mobileNum + "')", null, null, false, function (
			// 	response) {
			// 	if (response.ValidPhoneNo === "Success") {
			// 		that.getOwnerComponent().getModel("oCustomer").setData(response);
			// 		sap.ui.getCore().custId = response.BusinessPartner;
			// 		that.getOwnerComponent().getModel("oCustomer").refresh(true);
			// 		that.getOwnerComponent().getRouter().navTo("RouteHome");
			// 	}
			// });
			oDetailsModel.read("/Things('" + sThingId + "')", {
				urlParameters: {
					"$expand": "DYN_ENT_iot_quinnoxiotcf_iot_new_package__DefaultImagePropertySet,DYN_ENT_iot_quinnoxiotcf_iot_new_package__Device_IoT_1000020"
				},
				success: function (oData) {
					var customerPhoneNumber = oData.DYN_ENT_iot_quinnoxiotcf_iot_new_package__Device_IoT_1000020[
						"Device_IoT_1000020.Customer_Phone_number"];
					sap.ui.getCore().CustMobNo = customerPhoneNumber;
					if (mobileNum === customerPhoneNumber) {
						sap.ui.getCore().validationFlag = "A";
						sap.ui.getCore().deviceId = oData.DYN_ENT_iot_quinnoxiotcf_iot_new_package__Device_IoT_1000020[
							"Device_IoT_1000020.Device_ID"];
						sap.ui.getCore().deviceStatus = oData.DYN_ENT_iot_quinnoxiotcf_iot_new_package__Device_IoT_1000020[
							"Device_IoT_1000020.Device_Status"];
						sap.ui.getCore().faultCode = oData.DYN_ENT_iot_quinnoxiotcf_iot_new_package__Device_IoT_1000020[
							"Device_IoT_1000020.Fault_code"];
						// that.faultCode = oData.DYN_ENT_iot_quinnoxiotcf_iot_new_package__Device_IoT_1000020[
						// 	"Device_IoT_1000020.Fault_code"];

						sap.ui.getCore().filterLife = oData.DYN_ENT_iot_quinnoxiotcf_iot_new_package__Device_IoT_1000020[
							"Device_IoT_1000020.Filter_Life"];
						sap.ui.getCore().filterType = oData.DYN_ENT_iot_quinnoxiotcf_iot_new_package__Device_IoT_1000020[
							"Device_IoT_1000020.Filter_Type"];
						sap.ui.getCore().tdsInput = oData.DYN_ENT_iot_quinnoxiotcf_iot_new_package__Device_IoT_1000020[
							"Device_IoT_1000020.TDS_Input"];
						sap.ui.getCore().tdsOutput = oData.DYN_ENT_iot_quinnoxiotcf_iot_new_package__Device_IoT_1000020[
							"Device_IoT_1000020.TDS_Output"];
						sap.ui.getCore().waterConsumption = oData.DYN_ENT_iot_quinnoxiotcf_iot_new_package__Device_IoT_1000020[
							"Device_IoT_1000020.Water_Consumption"];
						sap.ui.getCore().waterFiltered = oData.DYN_ENT_iot_quinnoxiotcf_iot_new_package__Device_IoT_1000020[
							"Device_IoT_1000020.Water_Filtered"];
						sap.ui.getCore().pHInput = oData.DYN_ENT_iot_quinnoxiotcf_iot_new_package__Device_IoT_1000020[
							"Device_IoT_1000020.pH_Input"];
						sap.ui.getCore().pHOutput = oData.DYN_ENT_iot_quinnoxiotcf_iot_new_package__Device_IoT_1000020[
							"Device_IoT_1000020.pH_Output"];
						that.getView().byId("idnum").setValue("");
						//navigation code: Pass parameters in manfiest
						// that.getOwnerComponent().getRouter().navTo("Tile");
						that.readODataService(mobileNum);
						// that.getOwnerComponent().getRouter().navTo("Tile", {
						// 	deviceId: sap.ui.getCore().deviceId,
						// 	FaultCode: sap.ui.getCore().faultCode,
						// 	filterLife: sap.ui.getCore().filterLife,
						// 	waterConsumption: sap.ui.getCore().waterConsumption,
						// 	waterFiltered: sap.ui.getCore().waterFiltered,
						// 	mobileNum: that.mobNum,
						// 	filterType: sap.ui.getCore().filterType,
						// });

					} else {
						sap.ui.getCore().validationFlag = "B";
						that.callThing2Validation(sap.ui.getCore().thingId2);
					}

				},
				error: function (oError) {
					jQuery.sap.log.error(oError);
					sap.ui.getCore().byId("idBusy").close();
				}
			});

		},
		_findThingModel: function (sThingType) {
			//Create a loop and just check how many thingModels are created and break if there is no thingModel
			for (var i = 1; i < 100; i++) {
				if (this.getOwnerComponent().getModel("thingModel" + i)) {
					//Compare the thingType with the thingModel thingtype , if it matches then return that thingModel
					var sServiceURL = this.getOwnerComponent().getModel("thingModel" + i).sServiceUrl;
					var matchedThingType = sServiceURL.substring(sServiceURL.lastIndexOf("/") + 1);
					if (sThingType === matchedThingType) {
						return this.getOwnerComponent().getModel("thingModel" + i);
					}
				} else {
					jQuery.sap.log.error(
						"The thingType has not matched with the ThingModel created in the Manifest file , hence need to create a new oData Model for this thingType"
					);
					break;
				}
			}

		},
		callThing2Validation: function (sthingId) {
			// this.sThingId = sthingId;

			sap.ui.getCore().sThingId = sthingId;
			var oDetailsThingModel = this._findThingModelB(sap.ui.getCore().thing1Type);
			if (oDetailsThingModel) {
				// this._readDetailsServiceB(oDetailsThingModel, this.sThingId);
				this._readDetailsServiceB(oDetailsThingModel, sap.ui.getCore().sThingId);
			} else {
				var sURL = "/IOTAS-DETAILS-THING-ODATA/CompositeThings/ThingType/v1/" + sap.ui.getCore().thing1Type;
				var oNewThingTypeModel = new sap.ui.model.odata.ODataModel(sURL);
				// this._readDetailsServiceB(oNewThingTypeModel, this.sThingId);
				this._readDetailsServiceB(oNewThingTypeModel, sap.ui.getCore().sThingId);
			}
			// if (sap.ui.getCore().validationFlag === "C") {
			// 	this.callThing3Validation(sap.ui.getCore().thingId3);
			// }
		},
		_findThingModelB: function (sThingType) {
			//Create a loop and just check how many thingModels are created and break if there is no thingModel
			for (var i = 1; i < 100; i++) {
				if (this.getOwnerComponent().getModel("thingModel" + i)) {
					//Compare the thingType with the thingModel thingtype , if it matches then return that thingModel
					var sServiceURL = this.getOwnerComponent().getModel("thingModel" + i).sServiceUrl;
					var matchedThingType = sServiceURL.substring(sServiceURL.lastIndexOf("/") + 1);
					if (sThingType === matchedThingType) {
						return this.getOwnerComponent().getModel("thingModel" + i);
					}
				} else {
					jQuery.sap.log.error(
						"The thingType has not matched with the ThingModel created in the Manifest file , hence need to create a new oData Model for this thingType"
					);
					break;
				}
			}

		},
		_readDetailsServiceB: function (oDetailsModel, sThingId) {
			var that = this;
			var mobileNum = that.getView().byId("idnum").getValue();
			oDetailsModel.read("/Things('" + sThingId + "')", {
				urlParameters: {
					"$expand": "DYN_ENT_iot_quinnoxiotcf_iot_new_package__DefaultImagePropertySet,DYN_ENT_iot_quinnoxiotcf_iot_new_package__Device_IoT_1000020"
				},
				success: function (oData) {
					var customerPhoneNumber = oData.DYN_ENT_iot_quinnoxiotcf_iot_new_package__Device_IoT_1000020[
						"Device_IoT_1000020.Customer_Phone_number"];
					if (mobileNum === customerPhoneNumber) {

						sap.ui.getCore().validationFlag = "A";
						sap.ui.getCore().deviceId = oData.DYN_ENT_iot_quinnoxiotcf_iot_new_package__Device_IoT_1000020[
							"Device_IoT_1000020.Device_ID"];
						sap.ui.getCore().deviceStatus = oData.DYN_ENT_iot_quinnoxiotcf_iot_new_package__Device_IoT_1000020[
							"Device_IoT_1000020.Device_Status"];
						sap.ui.getCore().faultCode = oData.DYN_ENT_iot_quinnoxiotcf_iot_new_package__Device_IoT_1000020[
							"Device_IoT_1000020.Fault_code"];

						sap.ui.getCore().filterLife = oData.DYN_ENT_iot_quinnoxiotcf_iot_new_package__Device_IoT_1000020[
							"Device_IoT_1000020.Filter_Life"];
						sap.ui.getCore().filterType = oData.DYN_ENT_iot_quinnoxiotcf_iot_new_package__Device_IoT_1000020[
							"Device_IoT_1000020.Filter_Type"];
						sap.ui.getCore().tdsInput = oData.DYN_ENT_iot_quinnoxiotcf_iot_new_package__Device_IoT_1000020[
							"Device_IoT_1000020.TDS_Input"];
						sap.ui.getCore().tdsOutput = oData.DYN_ENT_iot_quinnoxiotcf_iot_new_package__Device_IoT_1000020[
							"Device_IoT_1000020.TDS_Output"];
						sap.ui.getCore().waterConsumption = oData.DYN_ENT_iot_quinnoxiotcf_iot_new_package__Device_IoT_1000020[
							"Device_IoT_1000020.Water_Consumption"];
						sap.ui.getCore().waterFiltered = oData.DYN_ENT_iot_quinnoxiotcf_iot_new_package__Device_IoT_1000020[
							"Device_IoT_1000020.Water_Filtered"];
						sap.ui.getCore().pHInput = oData.DYN_ENT_iot_quinnoxiotcf_iot_new_package__Device_IoT_1000020[
							"Device_IoT_1000020.pH_Input"];
						sap.ui.getCore().pHOutput = oData.DYN_ENT_iot_quinnoxiotcf_iot_new_package__Device_IoT_1000020[
							"Device_IoT_1000020.pH_Output"];
						that.getView().byId("idnum").setValue("");
						//navigation code: Pass parameters in manfiest
						// that.getOwnerComponent().getRouter().navTo("Tile");
						that.readODataService(mobileNum);
						// that.getOwnerComponent().getRouter().navTo("Tile", {
						// 	deviceId: sap.ui.getCore().deviceId,
						// 	FaultCode: sap.ui.getCore().faultCode,
						// 	filterLife: sap.ui.getCore().filterLife,
						// 	waterConsumption: sap.ui.getCore().waterConsumption,
						// 	waterFiltered: sap.ui.getCore().waterFiltered,
						// 	mobileNum: that.mobNum,
						// 	filterType: sap.ui.getCore().filterType,

						// });

					} else {
						sap.ui.getCore().validationFlag = "C";
						that.callThing3Validation(sap.ui.getCore().thingId3);
					}

				},
				error: function (oError) {
					jQuery.sap.log.error(oError);
					sap.ui.getCore().byId("idBusy").close();
				}
			});

		},
		callThing3Validation: function (sthingId) {
			// this.sThingId = sthingId;
			sap.ui.getCore().sThingId = sthingId;
			var oDetailsThingModel = this._findThingModelC(sap.ui.getCore().thing1Type);
			if (oDetailsThingModel) {
				// this._readDetailsServiceC(oDetailsThingModel, this.sThingId);
				this._readDetailsServiceC(oDetailsThingModel, sap.ui.getCore().sThingId);
			} else {
				var sURL = "/IOTAS-DETAILS-THING-ODATA/CompositeThings/ThingType/v1/" + sap.ui.getCore().thing1Type;
				var oNewThingTypeModel = new sap.ui.model.odata.ODataModel(sURL);
				// this._readDetailsServiceC(oNewThingTypeModel, this.sThingId);
				this._readDetailsServiceC(oNewThingTypeModel, sap.ui.getCore().sThingId);
			}
		},
		_findThingModelC: function (sThingType) {
			//Create a loop and just check how many thingModels are created and break if there is no thingModel
			for (var i = 1; i < 100; i++) {
				if (this.getOwnerComponent().getModel("thingModel" + i)) {
					//Compare the thingType with the thingModel thingtype , if it matches then return that thingModel
					var sServiceURL = this.getOwnerComponent().getModel("thingModel" + i).sServiceUrl;
					var matchedThingType = sServiceURL.substring(sServiceURL.lastIndexOf("/") + 1);
					if (sThingType === matchedThingType) {
						return this.getOwnerComponent().getModel("thingModel" + i);
					}
				} else {
					jQuery.sap.log.error(
						"The thingType has not matched with the ThingModel created in the Manifest file , hence need to create a new oData Model for this thingType"
					);
					break;
				}
			}

		},
		_readDetailsServiceC: function (oDetailsModel, sThingId) {
			var that = this;
			var mobileNum = that.getView().byId("idnum").getValue();
			oDetailsModel.read("/Things('" + sThingId + "')", {
				urlParameters: {
					"$expand": "DYN_ENT_iot_quinnoxiotcf_iot_new_package__DefaultImagePropertySet,DYN_ENT_iot_quinnoxiotcf_iot_new_package__Device_IoT_1000020"
				},
				success: function (oData) {
					var customerPhoneNumber = oData.DYN_ENT_iot_quinnoxiotcf_iot_new_package__Device_IoT_1000020[
						"Device_IoT_1000020.Customer_Phone_number"];
					if (mobileNum === customerPhoneNumber) {
						sap.ui.getCore().CustMobNo = customerPhoneNumber;
						sap.ui.getCore().validationFlag = "A";
						sap.ui.getCore().deviceId = oData.DYN_ENT_iot_quinnoxiotcf_iot_new_package__Device_IoT_1000020[
							"Device_IoT_1000020.Device_ID"];
						sap.ui.getCore().deviceStatus = oData.DYN_ENT_iot_quinnoxiotcf_iot_new_package__Device_IoT_1000020[
							"Device_IoT_1000020.Device_Status"];
						sap.ui.getCore().faultCode = oData.DYN_ENT_iot_quinnoxiotcf_iot_new_package__Device_IoT_1000020[
							"Device_IoT_1000020.Fault_code"];

						sap.ui.getCore().filterLife = oData.DYN_ENT_iot_quinnoxiotcf_iot_new_package__Device_IoT_1000020[
							"Device_IoT_1000020.Filter_Life"];
						sap.ui.getCore().filterType = oData.DYN_ENT_iot_quinnoxiotcf_iot_new_package__Device_IoT_1000020[
							"Device_IoT_1000020.Filter_Type"];
						sap.ui.getCore().tdsInput = oData.DYN_ENT_iot_quinnoxiotcf_iot_new_package__Device_IoT_1000020[
							"Device_IoT_1000020.TDS_Input"];
						sap.ui.getCore().tdsOutput = oData.DYN_ENT_iot_quinnoxiotcf_iot_new_package__Device_IoT_1000020[
							"Device_IoT_1000020.TDS_Output"];
						sap.ui.getCore().waterConsumption = oData.DYN_ENT_iot_quinnoxiotcf_iot_new_package__Device_IoT_1000020[
							"Device_IoT_1000020.Water_Consumption"];
						sap.ui.getCore().waterFiltered = oData.DYN_ENT_iot_quinnoxiotcf_iot_new_package__Device_IoT_1000020[
							"Device_IoT_1000020.Water_Filtered"];
						sap.ui.getCore().pHInput = oData.DYN_ENT_iot_quinnoxiotcf_iot_new_package__Device_IoT_1000020[
							"Device_IoT_1000020.pH_Input"];
						sap.ui.getCore().pHOutput = oData.DYN_ENT_iot_quinnoxiotcf_iot_new_package__Device_IoT_1000020[
							"Device_IoT_1000020.pH_Output"];
						that.getView().byId("idnum").setValue("");
						//navigation code: Pass parameters in manfiest
						// that.getOwnerComponent().getRouter().navTo("Tile");
						that.readODataService(mobileNum);
						// that.getOwnerComponent().getRouter().navTo("Tile", {
						// 	deviceId: sap.ui.getCore().deviceId,
						// 	FaultCode: sap.ui.getCore().faultCode,
						// 	filterLife: sap.ui.getCore().filterLife,
						// 	waterConsumption: sap.ui.getCore().waterConsumption,
						// 	waterFiltered: sap.ui.getCore().waterFiltered,
						// 	mobileNum: that.mobNum,
						// 	filterType: sap.ui.getCore().filterType,
						// });

					} else {
						that.getView().byId("idnum").setValue("");
						MessageBox.error("Please Enter a Valid Phone Number");
					}

				},
				error: function (oError) {
					jQuery.sap.log.error(oError);
					sap.ui.getCore().byId("idBusy").close();
				}
			});

		},
		readODataService: function (mobileNum) {
			var that = this;
			this.zodataService.read("/CustomerSet('" + mobileNum + "') ", {
				success: cSuccess,
				failed: cFailed
			});

			function cSuccess(data, response) {
				// console.log(response);
				if (response.data.NewUser === "NO") {
					that.getOwnerComponent().getRouter().navTo("Tile", {
						deviceId: sap.ui.getCore().deviceId,
						FaultCode: sap.ui.getCore().faultCode,
						filterLife: sap.ui.getCore().filterLife,
						waterConsumption: sap.ui.getCore().waterConsumption,
						waterFiltered: sap.ui.getCore().waterFiltered,
						mobileNum: that.mobNum,
						filterType: sap.ui.getCore().filterType
					});
				} else {
					that.getOwnerComponent().getRouter().navTo("InstallationView", {
						deviceId: sap.ui.getCore().deviceId,
						FaultCode: sap.ui.getCore().faultCode,
						mobileNum: that.mobNum

					});
				}
			}

			function cFailed(data, response) {
				// console.log(response);
			}

		}
	});
});